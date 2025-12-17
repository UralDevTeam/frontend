import "./userMainProperties.css";
import ProfileCircle from "../../../../shared/profileCircle/profileCircle";
import WorkerStatus from "../../../../shared/statuses/workerStatus";
import {User} from "../../index";

type Prop = {
    user: User,
    toSelf?: boolean,
};

export default function UserMainPropertiesView({user, toSelf = false}: Prop) {
    const formattedTeam = user.team.length ? user.team.join(" / ") : "-";

    return (
        <div className="user-main-properties-container">
            <ProfileCircle
                size={106}
                userId={user.id}
                toSelf={toSelf}
                isAdmin={user.isAdmin}
                addStar={true}
            />
            <div className={"user-main-properties"}>
                <p className="user-main-properties-name">
                    {user.fio}
                </p>
                <div className="user-main-properties-line">
                    {user.position}
                    <img src={"/icons/dot.svg"} alt={"dot icon"}/>
                    {formattedTeam}
                    <img src={"/icons/dot.svg"} alt={"dot icon"}/>
                    <WorkerStatus status={user.status}/>
                </div>
            </div>
        </div>
    );
}
