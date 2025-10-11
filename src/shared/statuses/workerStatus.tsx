import {WorkerStatuses} from "./workerStatuses";
import "./workerStatus.css"

export default function WorkerStatus({status}: { status: WorkerStatuses }) {
    if (status === WorkerStatuses.work) {
        return (
            <div className="worker-status worker-status-work">
                <p>работает</p>
            </div>
        )
    }
    return (
        <div>
            <p>Неизвестный статус</p>
        </div>
    )
}