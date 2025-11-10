import {WorkerStatuses} from "./workerStatuses";
import "./workerStatus.css"

export default function WorkerStatus({status}: { status: keyof typeof WorkerStatuses }) {
    switch (status) {
        case WorkerStatuses.work:
            return (
                <div className="worker-status worker-status-work">
                    <p>на связи</p>
                </div>
            );
        case WorkerStatuses.vacation:
            return (
                <div className="worker-status worker-status-vacation">
                    <p>в отпуске</p>
                </div>
            );
        case WorkerStatuses.sickLeave:
            return (
                <div className="worker-status worker-status-sick">
                    <p>заболел</p>
                </div>
            );
        default:
            return (
                <div>
                    <p>Неизвестный статус</p>
                </div>
            );
    }
}
