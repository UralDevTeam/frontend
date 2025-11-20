import "./userMainProperties.css"
import ProfileCircle from "../../../../shared/profileCircle/profileCircle";
import WorkerStatus from "../../../../shared/statuses/workerStatus";
import {User} from "../../index";

type IUserMainProperties = {
  user: User,
  toSelf?: boolean,
}

export default function UserMainProperties({user, toSelf = false}: IUserMainProperties) {
  console.log("UserMainProperties", user);
  return (
    <div className="user-main-properties-container">
      <ProfileCircle size={106} userId={user.id} toSelf={toSelf} isAdmin={user.isAdmin}/>
      <div className={"user-main-properties"}>
        <p className="user-main-properties-name">{user.fio}</p>
        <div className="user-main-properties-line">
          {user.role}
          <img src={"/icons/dot.svg"} alt={"dot icon"}/>
          {user.team.join(" / ")}
          <img src={"/icons/dot.svg"} alt={"dot icon"}/>
          <WorkerStatus status={user.status}/>
        </div>
      </div>
    </div>
  )
}
