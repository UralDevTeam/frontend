import {WorkerStatuses} from "./workerStatuses";

export default function getWorkerStatusRussian(workerStatus: string) {
    switch (workerStatus) {
        case WorkerStatuses.work:
            return "на связи";
        default:
            return "Неизвестный статус";
    }
}
