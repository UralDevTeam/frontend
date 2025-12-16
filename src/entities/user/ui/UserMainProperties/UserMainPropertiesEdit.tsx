import "./userMainProperties.css";
import ProfileCircle from "../../../../shared/profileCircle/profileCircle";
import {User} from "../../index";

type Props = {
    user: User,
    toSelf?: boolean,
};

export default function UserMainPropertiesEdit({user, toSelf = false}: Props) {
    return (
        <div className="user-main-properties-container edit-mode">
            <div className="user-main-properties-avatar">
                <ProfileCircle
                    size={106}
                    userId={user.id}
                    toSelf={toSelf}
                    isAdmin={user.isAdmin}
                    editable={true}
                    disableNavigation={true}
                    allowDelete={true}
                />
                <p className="user-main-properties-avatar__note">до 10МБ</p>
            </div>
            <div className={"user-main-properties"}>
                <p className="user-main-properties-title-override">
                    Редактирование личных данных
                </p>
            </div>
        </div>
    );
}
