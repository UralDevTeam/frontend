import {WorkerStatuses} from "./workerStatuses";

export default function getWorkerStatusRussian(workerStatus: string) {
    switch (workerStatus) {
        case WorkerStatuses.work:
            return "на связи";
        case WorkerStatuses.vacation:
            return "в отпуске";
        case WorkerStatuses.sickLeave:
            return "на больничном";
        default:
            return "Неизвестный статус";
    }
}
