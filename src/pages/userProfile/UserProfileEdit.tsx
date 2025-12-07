import UserPersonalInfoCardController from "../../entities/user/ui/UserPersonalInfoCardController";
import UserMainPropertiesEdit from "../../entities/user/ui/UserMainProperties/UserMainPropertiesEdit";
import {User, userStore} from "../../entities/user";
import React from "react";
import {observer} from "mobx-react-lite";
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
        <UserMainPropertiesEdit
            user={user}
            toSelf={true}
        />
      <div className={"user-profile-content"}>
        <UserPersonalInfoCardController user={user} isEdit={true} viewPath={viewPath}/>
      </div>
    </div>
  );
}

export default observer(UserProfileEdit);
