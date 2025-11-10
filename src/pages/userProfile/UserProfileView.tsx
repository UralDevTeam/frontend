import React from 'react';
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/UserBasicInfoCard/IUserBasicInfoCard";
import { observer } from 'mobx-react-lite';
import { userStore } from '../../entities/user';

function UserProfileViewInner() {
  const user = userStore.user;

  if (!user) return <div>No user</div>;

  return (
    <div className="simple-shadow-card user-profile-card">
      <UserMainProperties user={user}/>
      <div className={"user-profile-content"}>
        <UserBasicInfoCard user={user}/>
        <UserPersonalInfoCardController user={user} isEdit={false}/>
      </div>
    </div>
  );
}

const UserProfileView = observer(UserProfileViewInner);

export default UserProfileView;
