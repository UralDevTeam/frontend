import {User} from "../index";

export type EditableUser = User & {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    hireDate?: Date;
};

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
        middleName: parts.slice(2).join(" ") ?? "",
    };
};

const deriveHireDate = (experience?: number, existing?: Date) => {
    if (existing) return existing;
    const days = Number(experience);
    if (!Number.isFinite(days) || days <= 0) return undefined;

    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    return dt;
};

export const withAdminFields = (user: User): EditableUser => {
    const fioParts = splitFio(user.fio);
    return {
        ...user,
        firstName: user.firstName ?? fioParts.firstName,
        middleName: user.middleName ?? fioParts.middleName,
        lastName: user.lastName ?? fioParts.lastName,
        hireDate: deriveHireDate(user.experience, user.hireDate),
    };
};
