import React from 'react';
import UserPersonalInfoCardController from "../../entities/user/ui/UserPersonalInfoCardController";
import UserMainProperties from "../../entities/user/ui/UserMainProperties/IUserMainProperties";
import UserBasicInfoCard from "../../entities/user/ui/UserBasicInfoCard/IUserBasicInfoCard";
import { observer } from 'mobx-react-lite';
import {User, userStore} from '../../entities/user';
import "./profile.css"

type Props = {
  user?: User;
  canEdit?: boolean;
  editPath?: string;
  viewPath?: string;
}

function UserProfileViewInner(props: Props) {
  const user = props.user ?? userStore.user;

  if (!user) return <div>No user</div>;

  const canEdit = props.canEdit ?? true;
  const editPath = props.editPath ?? "/me/edit";
  const viewPath = props.viewPath ?? "/me";

  return (
    <div className="user-profile-card">
      <UserMainProperties user={user} toSelf={true}/>
      <div className={"user-profile-content"}>
        <UserBasicInfoCard user={user}/>
        <UserPersonalInfoCardController
          user={user}
          isEdit={false}
          canEdit={canEdit}
          editPath={editPath}
          viewPath={viewPath}
        />
      </div>
    </div>
  );
}

const UserProfileView = observer(UserProfileViewInner);

export default UserProfileView;
