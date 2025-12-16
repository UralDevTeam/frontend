import UserPersonalInfoCardController from "../../entities/user/ui/UserPersonalInfoCardController";
import UserMainPropertiesEdit from "../../entities/user/ui/UserMainProperties/UserMainPropertiesEdit";
import {User, userStore} from "../../entities/user";
import React from "react";
import {observer} from "mobx-react-lite";
import "./profile.css"

type Props = {
    initialUser?: User;
    viewPath?: string;
    saveUserFn?: (user: User, originalUser?: User) => Promise<unknown>;
    afterSave?: () => Promise<unknown> | void;
    toSelf?: boolean;
}

function UserProfileEdit({initialUser, viewPath = "/me", saveUserFn, afterSave, toSelf = true}: Props) {
    const user = initialUser ?? userStore.user;
    const adminMode = Boolean(userStore.user?.isAdmin && !toSelf);

    if (!user) return <div>No user</div>;

    return (
        <div className="user-profile-card">
            <UserMainPropertiesEdit
                user={user}
                toSelf={toSelf}
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
