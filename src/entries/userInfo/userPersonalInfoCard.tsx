import {User} from "../user";
import "./userPersonalInfoCard.css"
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";
import WorkerStatus from "../../shared/statuses/workerStatus";

type IUserPersonalInfoCard = {
  user: User,
  isEdit: boolean,
}

export default function UserPersonalInfoCard({user, isEdit}: IUserPersonalInfoCard) {

  console.log(user.birthday.toLocaleDateString("RU-ru"))

  return (
    <div className="simple-border-card user-personal-info-card">

      <div className="user-personal-info-card-1-row">
        <div className="user-personal-info-card-item">
          <p>город*</p>
          <input defaultValue={user.city} disabled={!isEdit}/>
        </div>
        <div className="user-personal-info-card-item">
          <p>дата рождения*</p>
          <input defaultValue={user.birthday.toISOString().slice(0, 10)} disabled={!isEdit} type={"date"}/>
        </div>
        <div className="user-personal-info-card-item">
          <p>телефон</p>
          <input defaultValue={user.phone} disabled={!isEdit} type={"tel"}/>
        </div>
      </div>

      <div className="user-personal-info-card-2-row">
        <div className="user-personal-info-card-item">
          <p>mattermost*</p>
          <input defaultValue={user.mattermost} disabled={!isEdit}/>
        </div>
        <div className="user-personal-info-card-item">
          <p>ник telegram</p>
          <input defaultValue={user.tg} disabled={!isEdit}/>
        </div>
      </div>

      <div className="user-personal-info-card-item">
        <p>обо мне</p>
        <textarea defaultValue={user.aboutMe} disabled={!isEdit}/>
      </div>

      <hr/>

      <div className="user-personal-info-card-3-row">
        <div className="user-personal-info-card-status-set">
          <p>текущий статус</p>
          <select defaultValue={user.status} disabled={!isEdit}>
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

      <p style={{fontSize: 14, marginTop: 30}}>нажмите `редактировать` чтобы изменить данные</p>

    </div>
  )
}