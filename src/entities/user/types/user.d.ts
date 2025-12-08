import {WorkerStatuses} from "../../../shared/statuses/workerStatuses";

export type UserLinkDTO = {
    id: string;
    fullName: string; // Иванова Анастасия Сергеевна
    shortName: string; // Траблона Е.К.
}

export type UserDTO = {
    id: string;
    fio: string;
    email: string;
    phone?: string;
    mattermost?: string;
    tg?: string;
    isAdmin: boolean;

    birthday?: string;
    hideBirthdayYear?: boolean;
    team: string[];
    legalEntity: string;
    department: string;
    boss: UserLinkDTO;
    role: string;
    experience: number; // days
    status: keyof typeof WorkerStatuses;

    city?: string;
    aboutMe?: string;
}


export type User = Omit<UserDTO, "birthday" | "formatTeam"> & {
    birthday?: Date;
    formatTeam: string;
}

