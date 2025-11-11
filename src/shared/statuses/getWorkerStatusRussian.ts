import {WorkerStatuses} from "./workerStatuses";

export default function getWorkerStatusRussian(workerStatus: string) {
    switch (workerStatus) {
        case WorkerStatuses.active:
            return "на связи";
        case WorkerStatuses.vacation:
            return "в отпуске";
        case WorkerStatuses.sickLeave:
            return "на больничном";
        default:
            return "Неизвестный статус";
    }
}