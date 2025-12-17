import { User } from "../../entities/user";
import { apiClient } from "../../shared/lib/api-client";

type UserMeUpdatePayload = {
    city: string;
    phone: string;
    mattermost: string;
    tg: string;
    aboutMe: string;
    birthDate: string; // YYYY-MM-DD
    isBirthyearVisible: boolean;
    status: User["status"];
};

type AdminUserUpdatePayload = Partial<{
    city: string;
    phone: string;
    mattermost: string;
    tg: string;
    status: User["status"];
    isBirthyearVisible: boolean;
    aboutMe: string;
    birthDate: string; // YYYY-MM-DD
    firstName: string;
    middleName: string;
    lastName: string;
    hireDate: string; // YYYY-MM-DD
    email: string;
    position: string;
    team: string[];
    isAdmin: boolean;
}>;

const toYmd = (d?: Date): string => {
    if (!d) return "";
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
};

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
        middleName: parts.slice(2).join(" ") ?? "",
    };
};

const deriveHireDateYmdFromExperience = (experienceDays?: number): string => {
    const days = Number(experienceDays);
    if (!Number.isFinite(days) || days <= 0) return "";
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    return toYmd(dt);
};

const normalizeStr = (v: unknown) => String(v ?? "");
const normalizeOptStr = (v: unknown) => String(v ?? "");

const sameString = (a: unknown, b: unknown) => normalizeStr(a) === normalizeStr(b);

const normalizeTeam = (team?: string[]) =>
    Array.isArray(team) ? team.map((v) => String(v ?? "").trim()).filter(Boolean) : [];

const sameArray = (a?: string[], b?: string[]) => {
    const aa = Array.isArray(a) ? a : [];
    const bb = Array.isArray(b) ? b : [];
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
    return true;
};

const sameTeam = (a?: string[], b?: string[]) => sameArray(normalizeTeam(a), normalizeTeam(b));

// --------- 1) СВОЙ ПРОФИЛЬ (/api/me) ---------
export const buildUserPayload = (updatedUser: User): UserMeUpdatePayload => {
    return {
        city: updatedUser.city ?? "",
        phone: updatedUser.phone ?? "",
        mattermost: updatedUser.mattermost ?? "",
        tg: updatedUser.tg ?? "",
        aboutMe: updatedUser.aboutMe ?? "",
        birthDate: updatedUser.birthday ? toYmd(updatedUser.birthday) : "",
        isBirthyearVisible: updatedUser.isBirthyearVisible ?? true,
        status: updatedUser.status,
    };
};

// --------- 2) АДМИНСКОЕ ОБНОВЛЕНИЕ (/api/users/{id}) только изменения ---------
export const buildAdminUserUpdatePayloadDiff = (
    originalUser: User,
    updatedUser: User
): AdminUserUpdatePayload => {
    const payload: AdminUserUpdatePayload = {};

    if (!sameString(originalUser.city ?? "", updatedUser.city ?? "")) {
        payload.city = normalizeOptStr(updatedUser.city);
    }
    if (!sameString(originalUser.phone ?? "", updatedUser.phone ?? "")) {
        payload.phone = normalizeOptStr(updatedUser.phone);
    }
    if (!sameString(originalUser.mattermost ?? "", updatedUser.mattermost ?? "")) {
        payload.mattermost = normalizeOptStr(updatedUser.mattermost);
    }
    if (!sameString(originalUser.tg ?? "", updatedUser.tg ?? "")) {
        payload.tg = normalizeOptStr(updatedUser.tg);
    }
    if (!sameString(originalUser.aboutMe ?? "", updatedUser.aboutMe ?? "")) {
        payload.aboutMe = normalizeOptStr(updatedUser.aboutMe);
    }

    if (originalUser.status !== updatedUser.status) {
        payload.status = updatedUser.status;
    }

    if ((originalUser.isBirthyearVisible ?? true) !== (updatedUser.isBirthyearVisible ?? true)) {
        payload.isBirthyearVisible = updatedUser.isBirthyearVisible ?? true;
    }

    const origBirth = originalUser.birthday ? toYmd(originalUser.birthday) : "";
    const nextBirth = updatedUser.birthday ? toYmd(updatedUser.birthday) : "";
    if (origBirth !== nextBirth) {
        payload.birthDate = nextBirth;
    }

    const origFio = splitFio(originalUser.fio);
    const nextFio = splitFio(updatedUser.fio);

    if (origFio.firstName !== nextFio.firstName) payload.firstName = nextFio.firstName;
    if (origFio.middleName !== nextFio.middleName) payload.middleName = nextFio.middleName;
    if (origFio.lastName !== nextFio.lastName) payload.lastName = nextFio.lastName;

    const origHire = deriveHireDateYmdFromExperience(originalUser.experience);
    const nextHire = deriveHireDateYmdFromExperience(updatedUser.experience);
    if (origHire !== nextHire) {
        payload.hireDate = nextHire;
    }

    if (!sameString(originalUser.email, updatedUser.email)) payload.email = updatedUser.email;
    if (!sameString(originalUser.position, updatedUser.position)) payload.position = updatedUser.position;

    const normalizedOrigTeam = normalizeTeam(originalUser.team);
    const normalizedNextTeam = normalizeTeam(updatedUser.team);
    if (!sameTeam(normalizedOrigTeam, normalizedNextTeam)) payload.team = normalizedNextTeam;

    if (originalUser.isAdmin !== updatedUser.isAdmin) payload.isAdmin = updatedUser.isAdmin;

    return payload;
};

const putJson = async (url: string, body: unknown) => {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    const res = await apiClient.fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${text}`);
    }

    return await res.json();
};

export async function saveUser(updatedUser: User) {
    return await putJson("/api/me", buildUserPayload(updatedUser));
}

export async function saveUserByIdAdmin(userId: string, originalUser: User, updatedUser: User) {
    const url = `/api/users/${encodeURIComponent(userId)}`;
    const diff = buildAdminUserUpdatePayloadDiff(originalUser, updatedUser);

    if (Object.keys(diff).length === 0) {
        return updatedUser;
    }

    return await putJson(url, diff);
}
