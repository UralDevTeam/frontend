import {User} from "../../entities/user";
import {adaptBackendUserToFrontend, BackendUserDTO} from "../../entities/user/fetcher";
import {apiClient} from "../../shared/lib/api-client";

const formatDateOnly = (value?: Date | string | null) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
};

const normalizeTeam = (team?: string[]) => {
    if (!Array.isArray(team)) return [] as string[];
    return team.map(String).filter(Boolean);
};

const arraysEqual = (a?: string[], b?: string[]) => {
    if (a === b) return true;
    const left = Array.isArray(a) ? a : [];
    const right = Array.isArray(b) ? b : [];
    if (left.length !== right.length) return false;
    return left.every((val, idx) => val === right[idx]);
};

const normalizeSelfPayload = (user: User) => ({
    city: user.city ?? "",
    phone: user.phone ?? "",
    mattermost: user.mattermost ?? "",
    tg: user.tg ?? "",
    aboutMe: user.aboutMe ?? "",
    birthDate: formatDateOnly(user.birthday),
    isBirthyearVisible: user.isBirthyearVisible ?? true,
    status: user.status,
});

const buildSelfPayload = (updatedUser: User, originalUser?: User) => {
    const nextPayload = normalizeSelfPayload(updatedUser);
    if (!originalUser) return nextPayload;

    const prevPayload = normalizeSelfPayload(originalUser);

    const diffEntries = (Object.keys(nextPayload) as Array<keyof typeof nextPayload>).filter((key) => {
        return nextPayload[key] !== prevPayload[key];
    }).map((key) => [key, nextPayload[key]]);

    return Object.fromEntries(diffEntries);
};

const normalizeAdminPayload = (user: User) => ({
    city: user.city ?? "",
    phone: user.phone ?? "",
    mattermost: user.mattermost ?? "",
    tg: user.tg ?? "",
    status: user.status,
    isBirthyearVisible: user.isBirthyearVisible ?? true,
    aboutMe: user.aboutMe ?? "",
    birthDate: formatDateOnly(user.birthday),
    hireDate: formatDateOnly(user.hireDate),
    firstName: user.firstName ?? "",
    middleName: user.middleName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    legalEntity: user.legalEntity ?? "",
    department: user.department ?? "",
    position: user.position ?? "",
    team: normalizeTeam(user.team),
    isAdmin: Boolean(user.isAdmin),
});

const buildAdminPayload = (updatedUser: User, originalUser?: User) => {
    const nextPayload = normalizeAdminPayload(updatedUser);

    if (!originalUser) return nextPayload;

    const prevPayload = normalizeAdminPayload(originalUser);
    const diffEntries = (Object.keys(nextPayload) as Array<keyof typeof nextPayload>).filter((key) => {
        const nextVal = nextPayload[key];
        const prevVal = prevPayload[key];

        if (Array.isArray(nextVal) || Array.isArray(prevVal)) {
            return !arraysEqual(nextVal as string[], prevVal as string[]);
        }

        return nextVal !== prevVal;
    }).map((key) => [key, nextPayload[key]]);

    return Object.fromEntries(diffEntries);
};

const saveUserWithUrl = async (url: string, payload: Record<string, unknown>, fallbackUser: User) => {
    if (Object.keys(payload).length === 0) {
        return fallbackUser;
    }

    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    const res = await apiClient.fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
        credentials: "include"
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${text}`);
    }

    const raw = await res.json() as BackendUserDTO;
    return adaptBackendUserToFrontend(raw);
};

export async function saveUser(updatedUser: User, originalUser?: User) {
    const payload = buildSelfPayload(updatedUser, originalUser);
    return await saveUserWithUrl(`/api/me`, payload, updatedUser);
}

export async function saveUserById(userId: string, updatedUser: User, originalUser?: User) {
    const payload = buildAdminPayload(updatedUser, originalUser);
    return await saveUserWithUrl(`/api/users/${encodeURIComponent(userId)}`, payload, updatedUser);
}

export {buildAdminPayload as buildUserPayload};
