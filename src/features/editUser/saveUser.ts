import {User} from "../../entities/user";
import {apiClient} from "../../shared/lib/api-client";

export async function saveUser(updatedUser: User) {
    const url = `/api/me`;
    const payload = {
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

    return await res.json();
}

