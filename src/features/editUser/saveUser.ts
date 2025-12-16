import {User} from "../../entities/user";
import {apiClient} from "../../shared/lib/api-client";

const buildUserPayload = (updatedUser: User) => {
    return {
        city: updatedUser.city ?? "",
        phone: updatedUser.phone ?? "",
        mattermost: updatedUser.mattermost ?? "",
        tg: updatedUser.tg ?? "",
        aboutMe: updatedUser.aboutMe ?? "",
        birthDate: updatedUser.birthday
            ? new Date(updatedUser.birthday).toISOString().slice(0, 10)
            : "",
        isBirthyearVisible: updatedUser.isBirthyearVisible ?? true,
        status: updatedUser.status,
    };
};

const saveUserWithUrl = async (url: string, updatedUser: User) => {
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    const res = await apiClient.fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(buildUserPayload(updatedUser)),
        credentials: "include"
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${text}`);
    }

    return await res.json();
};

export async function saveUser(updatedUser: User) {
    const url = `/api/me`;
    return await saveUserWithUrl(url, updatedUser);
}

export async function saveUserById(userId: string, updatedUser: User) {
    const url = `/api/users/${encodeURIComponent(userId)}`;
    return await saveUserWithUrl(url, updatedUser);
}

export {buildUserPayload};
