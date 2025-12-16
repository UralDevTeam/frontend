import {WorkerStatuses} from "../../../shared/statuses/workerStatuses";

export type UserLinkDTO = {
    id: string;
    fullName: string; // Иванова Анастасия Сергеевна
    shortName: string; // Траблона Е.К.
}

export type UserDTO = {
    id: string;
    fio: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    mattermost?: string;
    tg?: string;
    isAdmin: boolean;

    birthday?: string;
    hireDate?: string;
    isBirthyearVisible: boolean;
    team: string[];
    legalEntity: string;
    department: string;
    boss: UserLinkDTO;
    position: string;
    experience: number; // days
    status: keyof typeof WorkerStatuses;

    city?: string;
    aboutMe?: string;
}

export type User = {
    id: string;
    fio: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    mattermost?: string;
    tg?: string;
    isAdmin: boolean;

    birthday?: Date;
    hireDate?: Date;
    isBirthyearVisible: boolean;
    team: string[];
    legalEntity: string;
    department: string;
    boss: UserLinkDTO;
    position: string;
    experience: number; // days
    status: keyof typeof WorkerStatuses;

    city?: string;
    aboutMe?: string;

    formatTeam: string;
}

