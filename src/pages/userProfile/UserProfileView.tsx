import React from 'react';
import { User } from '../../entries/user';
import UserMainProperties from "../../entries/userInfo/userMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/userBasicInfoCard";
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";

type Props = {
  user: User;
}

export default function UserProfileView({ user }: Props) {
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

