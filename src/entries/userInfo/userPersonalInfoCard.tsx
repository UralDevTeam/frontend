import {User} from "../user";
import "./userPersonalInfoCard.css"
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";
import WorkerStatus from "../../shared/statuses/workerStatus";
import {useEffect, useState} from "react";

type IUserPersonalInfoCard = {
  user: User,
  isEdit: boolean,
}

export default function UserPersonalInfoCard({user, isEdit}: IUserPersonalInfoCard) {

  const [editedUser, setEditedUser] = useState<User>(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user])

  return (
    <div className={`simple-border-card user-personal-info-card ${isEdit ? "user-personal-info-card-edit" : ""}`}>

      <div className="user-personal-info-card-1-row">
        <div className="user-personal-info-card-item">
          <label htmlFor={"city"}>город*</label>
          <input
            id="city"
            value={editedUser.city}
            disabled={!isEdit}
            onChange={e => setEditedUser(p => ({...p, city: e.target.value}))}
          />
        </div>
        <div className="user-personal-info-card-item">
          <label htmlFor={"birthday"}>дата рождения*</label>
          <input
            id="birthday"
            value={editedUser.birthday.toISOString().slice(0, 10)}
            disabled={!isEdit}
            type={"date"}
            onChange={e => setEditedUser(p => ({...p, birthday: new Date(e.target.value)}))}
          />
        </div>
        <div className="user-personal-info-card-item">
          <label htmlFor="phone">телефон</label>
          <input
            id="phone"
            value={editedUser.phone}
            disabled={!isEdit}
            type={"tel"}
            onChange={e => setEditedUser(p => ({...p, phone: e.target.value}))}
          />
        </div>
      </div>

      <div className="user-personal-info-card-2-row">
        <div className="user-personal-info-card-item">
          <label htmlFor="mattermost">mattermost*</label>
          <input
            id="mattermost"
            value={editedUser.mattermost}
            disabled={!isEdit}
            onChange={e => setEditedUser(p => ({...p, mattermost: e.target.value}))}
          />
        </div>
        <div className="user-personal-info-card-item">
          <label htmlFor='tg'>ник telegram</label>
          <input
            id="tg"
            value={editedUser.tg}
            disabled={!isEdit}
            onChange={e => setEditedUser(p => ({...p, tg: e.target.value}))}
          />
        </div>
      </div>

      <div className="user-personal-info-card-item">
        <label htmlFor="aboutMe">обо мне</label>
        <textarea
          id="aboutMe"
          value={editedUser.aboutMe}
          disabled={!isEdit}
          onChange={e => setEditedUser(p => ({...p, aboutMe: e.target.value}))}
        />
      </div>

      <hr/>

      <div className="user-personal-info-card-3-row">
        <div className="user-personal-info-card-status-set">
          <label htmlFor={"status"}>текущий статус</label>
          <select
            id="status"
            value={editedUser.status}
            disabled={!isEdit}
            onChange={e => setEditedUser(p => ({...p, status: e.target.value as keyof typeof WorkerStatuses}))}
          >
            {Object.keys(WorkerStatuses).map((entry) => (
              <option key={entry} value={entry}>{getWorkerStatusRussian(entry)}</option>
            ))}
          </select>
        </div>
        <div className="user-personal-info-card-status-view" style={isEdit ? {display: "none"} : {}}>
          <p>отображение статуса</p>
          <WorkerStatus status={editedUser.status}/>
        </div>
      </div>

      <p style={{fontSize: 14, marginTop: 30}}>
        {isEdit ? "нажмите `сохранить` чтобы данные изменились" : "нажмите `редактировать` чтобы изменить данные"}
      </p>

    </div>
  )
}