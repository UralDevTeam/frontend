import React from 'react';
import {User} from '../../entries/user';
import UserPersonalInfoCardController from "../../entries/userInfo/UserPersonalInfoCardController";
import UserMainProperties from "../../entries/userInfo/UserMainProperties/IUserMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/UserBasicInfoCard/IUserBasicInfoCard";

type Props = {
    user: User;
    canEdit?: boolean;
    editPath?: string;
    viewPath?: string;
}

export default function UserProfileView({user, canEdit = true, editPath = "/me/edit", viewPath = "/me"}: Props) {
    return (
        <div className="user-profile-card">
            <UserMainProperties user={user}/>
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

