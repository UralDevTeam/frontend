import {WorkerStatuses} from "../../shared/statuses/workerStatuses";

export type UserLinkDTO = {
    id: string;
    fullName: string; // Траблона Е.К.
    shortName: string; // Иванова Анастасия Сергеевна
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
