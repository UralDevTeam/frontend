import React, {useState} from 'react';
import {User} from '../../entries/user';
import UserMainProperties from "../../entries/userInfo/userMainProperties";
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";

// Простая заглушка для сохранения — в реальном приложении тут будет API
async function saveUserApi(user: User): Promise<User> {
  // имитация задержки
  await new Promise(r => setTimeout(r, 300));
  return user;
}

type Props = {
  initialUser: User;
}

export default function UserProfileEdit({initialUser}: Props) {
  return (
    <div className="simple-shadow-card user-profile-card">
      <UserMainProperties user={initialUser}/>
      <div className={"user-profile-content"}>
        <UserPersonalInfoCardController user={initialUser} isEdit={true}/>
      </div>
    </div>
  );
}