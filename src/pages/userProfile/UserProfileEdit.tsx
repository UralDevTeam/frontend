import {User} from '../../entries/user';
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";

type Props = {
  initialUser: User;
}

export default function UserProfileEdit({initialUser}: Props) {
  return (
    <div className="user-profile-card">
      <UserMainProperties user={initialUser}/>
      <div className={"user-profile-content"}>
        <UserPersonalInfoCardController user={initialUser} isEdit={true}/>
      </div>
    </div>
  );
}
