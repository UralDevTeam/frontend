import UserPersonalInfoCardController from "../../entities/user/ui/UserPersonalInfoCardController";
import UserMainPropertiesEdit from "../../entities/user/ui/UserMainProperties/UserMainPropertiesEdit";
import {User, userStore} from "../../entities/user";
import React from "react";
import {observer} from "mobx-react-lite";
import {routes} from "../../shared/routes";
import "./profile.css"

type Props = {
    initialUser?: User;
    viewPath?: string;
    saveUserFn?: (updated: User, original?: User) => Promise<unknown>;
    afterSave?: () => Promise<unknown> | void;
    toSelf?: boolean;
    adminMode?: boolean;
}

function UserProfileEdit({initialUser, viewPath = routes.me(), saveUserFn, afterSave, toSelf = true, adminMode = false}: Props) {
    const user = initialUser ?? userStore.user;
    const titleText = toSelf ? "Редактирование личных данных" : "Редактирование данных сотрудника";

    if (!user) return <div>No user</div>;

    return (
        <div className="user-profile-card">
            <UserMainPropertiesEdit
                user={user}
                toSelf={toSelf}
                titleText={titleText}
                adminMode={adminMode}
            />
            <div className={"user-profile-content"}>
                <UserPersonalInfoCardController
                    user={user}
                    isEdit={true}
                    viewPath={viewPath}
                    saveUserFn={saveUserFn}
                    afterSave={afterSave}
                    adminMode={adminMode}
                />
            </div>
        </div>
    );
}

export default observer(UserProfileEdit);
