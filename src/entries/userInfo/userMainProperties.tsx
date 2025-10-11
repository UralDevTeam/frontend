import WorkerStatus from "../../shared/statuses/workerStatus";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import ProfileCircle from "../../shared/profileCircle/profileCircle";
import "./userMainProperties.css"

type UserMainProperties = {
    name: string;
    position: string;
    team: string;
    status: WorkerStatuses;
}

export default function UserMainProperties({name, position, team, status}: UserMainProperties) {
    return (
        <div className="user-main-properties-container">
            <ProfileCircle size={106}/>
            <div className={"user-main-properties"}>
                <p className="user-main-properties-name">{name}</p>
                <div className="user-main-properties-line">
                    <WorkerStatus status={status}/>
                    <img src={"/icons/dot.svg"}/>
                    {position}
                    <img src={"/icons/dot.svg"}/>
                    {team}
                </div>
            </div>
        </div>
    )
}