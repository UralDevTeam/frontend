import "./userMainProperties.css"
import {User} from "../../user";
import ProfileCircle from "../../../shared/profileCircle/profileCircle";
import WorkerStatus from "../../../shared/statuses/workerStatus";

type IUserMainProperties = {
  user: User,
}

export default function UserMainProperties({user}: IUserMainProperties) {
  return (
    <div className="user-main-properties-container">
      <ProfileCircle size={106}/>
      <div className={"user-main-properties"}>
        <p className="user-main-properties-name">{user.fio}</p>
        <div className="user-main-properties-line">
          <WorkerStatus status={user.status}/>
          <img src={"/icons/dot.svg"} alt={"dot icon"} />
          {user.role}
          <img src={"/icons/dot.svg"} alt={"dot icon"}/>
          {user.team.join(" / ")}
        </div>
      </div>
    </div>
  )
}