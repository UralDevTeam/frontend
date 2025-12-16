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

const normalizeUserForPayload = (user: User) => ({
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

const arraysEqual = (a?: string[], b?: string[]) => {
    if (a === b) return true;
    const left = Array.isArray(a) ? a : [];
    const right = Array.isArray(b) ? b : [];
    if (left.length !== right.length) return false;
    return left.every((val, idx) => val === right[idx]);
};

const buildUserPayload = (updatedUser: User, originalUser?: User) => {
    const nextPayload = normalizeUserForPayload(updatedUser);

    if (!originalUser) return nextPayload;

    const prevPayload = normalizeUserForPayload(originalUser);
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

const saveUserWithUrl = async (url: string, updatedUser: User, originalUser?: User) => {
    const payload = buildUserPayload(updatedUser, originalUser);

    if (Object.keys(payload).length === 0) {
        return updatedUser;
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
    const url = `/api/me`;
    return await saveUserWithUrl(url, updatedUser, originalUser);
}

export async function saveUserById(userId: string, updatedUser: User, originalUser?: User) {
    const url = `/api/users/${encodeURIComponent(userId)}`;
    return await saveUserWithUrl(url, updatedUser, originalUser);
}

export {buildUserPayload};
