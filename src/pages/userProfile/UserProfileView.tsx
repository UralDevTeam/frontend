import React from 'react';
import { User } from '../../entries/user';
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/UserBasicInfoCard/IUserBasicInfoCard";

type Props = {
  user: User;
}

export default function UserProfileView({ user }: Props) {
  return (
    <div className="user-profile-card">
      <UserMainProperties user={user}/>
      <div className={"user-profile-content"}>
        <UserBasicInfoCard user={user}/>
        <UserPersonalInfoCardController user={user} isEdit={false}/>
      </div>
    </div>
  );
}

