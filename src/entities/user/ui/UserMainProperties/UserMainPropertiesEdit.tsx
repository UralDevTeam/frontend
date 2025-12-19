import "./userMainProperties.css";
import ProfileCircle from "../../../../shared/profileCircle/profileCircle";
import {User} from "../../index";

type Props = {
    user: User,
    toSelf?: boolean,
    titleText?: string,
    adminMode?: boolean,
};

export default function UserMainPropertiesEdit({
                                                   user,
                                                   toSelf = false,
                                                   titleText = "Редактирование личных данных",
                                                   adminMode = false
                                               }: Props) {
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
                    adminMode={adminMode}
                />
                <p className="user-main-properties-avatar__note">до 10МБ</p>
            </div>
            <div className="user-main-properties__header">
                <p id="user-profile-edit-title" className="user-main-properties-title-override">
                    {titleText}
                </p>
            </div>
        </div>
    );
}
