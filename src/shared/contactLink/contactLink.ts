export type ContactLinkKey = "tg" | "mattermost" | "email";

export type ContactLink = {
    href: string;
    label: string;
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizeMattermostLink = (value: string): ContactLink | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const href = isHttpUrl(trimmed) ? trimmed : `http://${trimmed}`;
    const usernameMatch = trimmed.match(/@([^/?#\s]+)/);
    const label = usernameMatch?.[1] ?? trimmed;

    return { href, label };
};

const normalizeTelegramLink = (value: string): ContactLink | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const username = trimmed.replace(/^@+/, "");
    if (!username) return null;

    return {
        href: `https://t.me/${username}`,
        label: trimmed,
    };
};

const normalizeEmailLink = (value: string): ContactLink | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    return {
        href: `mailto:${trimmed}`,
        label: trimmed,
    };
};

export const buildContactLink = (key: ContactLinkKey, rawValue?: string | null): ContactLink | null => {
    if (!rawValue) return null;

    switch (key) {
        case "tg":
            return normalizeTelegramLink(rawValue);
        case "mattermost":
            return normalizeMattermostLink(rawValue);
        case "email":
            return normalizeEmailLink(rawValue);
        default:
            return null;
    }
};
