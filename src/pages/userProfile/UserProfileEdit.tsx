import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";
import {userStore} from "../../entities/user";
import React from "react";
import {observer} from "mobx-react-lite";
import "./profile.css"


function UserProfileEditInner() {

  const initialUser = userStore.user;

  if (!initialUser) return <div>No user</div>;

  return (
    <div className="simple-shadow-card user-profile-card">
      <UserMainProperties user={initialUser}/>
      <div className={"user-profile-content"}>
        <UserPersonalInfoCardController user={initialUser} isEdit={true}/>
      </div>
    </div>
  );
}

const UserProfileEdit = observer(UserProfileEditInner);

export default UserProfileEdit;

