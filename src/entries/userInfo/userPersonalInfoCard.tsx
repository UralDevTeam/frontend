import {User} from "../user";
import "./userPersonalInfoCard.css"
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";
import WorkerStatus from "../../shared/statuses/workerStatus";

type UserPersonalInfoCard = {
    user: User,
}

export default function UserPersonalInfoCard({user}: UserPersonalInfoCard) {
    return (
        <div className="simple-border-card user-personal-info-card">
            <div className="user-personal-info-card-1-row">
                <div className="user-personal-info-card-city">
                    <p>город</p>
                    <input/>
                </div>
                <div className="user-personal-info-card-contact">
                    <p>контактные данные</p>
                    <input/>
                </div>
            </div>
            <div className="user-personal-info-card-about-me">
                <p>обо мне</p>
                <textarea/>
            </div>

            <hr/>

            <div className="user-personal-info-card-3-row">
                <div className="user-personal-info-card-status-set">
                    <p>текущий статус</p>
                    <select>
                        {Object.keys(WorkerStatuses).map((entry) => (
                            <option key={entry} value={entry}>{getWorkerStatusRussian(entry)}</option>
                        ))}
                    </select>
                </div>
                <div className="user-personal-info-card-status-view">
                    <p>отображение статуса</p>
                    <WorkerStatus status={user.status}/>
                </div>
            </div>

            <p style={{fontSize: 14, marginTop: 84}}>нажмите `редактировать` чтобы изменить данные</p>

        </div>
    )
}