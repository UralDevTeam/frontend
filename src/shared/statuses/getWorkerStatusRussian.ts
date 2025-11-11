import {WorkerStatuses} from "./workerStatuses";

export default function getWorkerStatusRussian(workerStatus: string) {
    switch (workerStatus) {
        case WorkerStatuses.active:
            return "Работает";
        default:
            return "Неизвестный статус";
    }
}