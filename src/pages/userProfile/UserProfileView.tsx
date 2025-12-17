import React, {useEffect} from 'react';
import UserPersonalInfoCardController from "../../entities/user/ui/UserPersonalInfoCardController";
import UserMainPropertiesView from "../../entities/user/ui/UserMainProperties/UserMainPropertiesView";
import UserBasicInfoCard from "../../entities/user/ui/UserBasicInfoCard/IUserBasicInfoCard";
import {observer} from 'mobx-react-lite';
import {User, userStore} from '../../entities/user';
import "./profile.css"
import {notificationsStore} from "../../features/notifications";

type Props = {
  user?: User;
  canEdit?: boolean;
  editPath?: string;
  viewPath?: string;
}

function UserProfileViewInner(props: Props) {
  const user = props.user ?? userStore.user;

  const canEdit = props.canEdit ?? true;
  const editPath = props.editPath ?? "/me/edit";
  const viewPath = props.viewPath ?? "/me";

  useEffect(() => {
    const notificationId = notificationsStore.success(`
Заполните свой профиль 
до конца. так коллеги узнают 
о тебе больше!
`, {text: "Профиль", href: "/me"})
    return () => {
      notificationsStore.removeNotification(notificationId);
    }
  }, []);

  if (!user) return <div>No user</div>;

  return (
    <div className="user-profile-card">
      <UserMainPropertiesView user={user} toSelf={true}/>
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
