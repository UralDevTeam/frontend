import {WorkerStatuses} from "../../shared/statuses/workerStatuses";

export type User = {
    id: string;
    fio: string;
    birthday: Date;
    team: string[];
    role: string;
    grade: string;
    experience: number; // days
    status: keyof typeof WorkerStatuses;

    formatTeam: string;
}

export type UserDTO = {
    id: string;
    fio: string;
    birthday: string;
    team: string[];
    role: string;
    grade: string;
    experience: number; // days
    status: keyof typeof WorkerStatuses;
}

