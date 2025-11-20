import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";
import {userStore} from "../../entities/user";
import React from "react";
import {observer} from "mobx-react-lite";
import {User} from "../../entries/user";
import "./profile.css"

type Props = {
  initialUser?: User;
  viewPath?: string;
}

function UserProfileEdit({initialUser, viewPath = "/me"}: Props) {
  const user = initialUser ?? userStore.user;

  if (!user) return <div>No user</div>;

  return (
    <div className="user-profile-card">
      <UserMainProperties user={user} toSelf={true}/>
      <div className={"user-profile-content"}>
        <UserPersonalInfoCardController user={user} isEdit={true} viewPath={viewPath}/>
      </div>
    </div>
  );
}

export default observer(UserProfileEdit);
