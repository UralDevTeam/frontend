import {NavLink, useNavigate} from "react-router";
import React, {useCallback, useEffect, useState} from "react";
import UserPersonalInfoCard from "./UserPersonalInfoCard/UserPersonalInfoCard";
import {User, userStore} from "../index";
import {fetchCurrentUser} from "../fetcher";
import {saveUser} from "../../../features/editUser/saveUser";
import "./UserPersonalInfoCardController.css";


type Props = {
    user: User;
    isEdit: boolean;
    canEdit?: boolean;
    editPath?: string;
    viewPath?: string;
    saveUserFn?: (updated: User, original?: User) => Promise<unknown>;
    afterSave?: () => Promise<unknown> | void;
    adminMode?: boolean;
};

const UserPersonalInfoCardController = (
    {
        user,
        isEdit,
        canEdit = false,
        editPath = "/me/edit",
        viewPath = "/me",
        saveUserFn,
        afterSave,
        adminMode = false,
    }: Props) => {
    const navigate = useNavigate();
    const [draftUser, setDraftUser] = useState<User>(user);
    const [originalUser, setOriginalUser] = useState<User>(user);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setDraftUser(user);
        setOriginalUser(user);
    }, [user]);

    const handleUndo = useCallback(() => {
    }, [draftUser]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await (saveUserFn ?? ((u: User) => saveUser(u)))(draftUser, originalUser);

            if (afterSave) {
                await afterSave();
            } else {
                await userStore.loadUserFromApi(fetchCurrentUser);
            }
            navigate(viewPath);
        } finally {
            setIsSaving(false);
        }
    }, [draftUser, originalUser, navigate, viewPath, saveUserFn, afterSave]);

    const editingDisabled = isSaving;
    const preventNavigationIfDisabled = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        if (editingDisabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, [editingDisabled]);

    return (
        <div className="user-personal-info-controller">
            <div className="user-personal-info-controller__header">
                {!isEdit && <p className="user-profile-section-title">Личное</p>}
                {!isEdit && canEdit && <NavLink to={editPath}>
                    <button className="user-personal-info-controller__edit-mode-button">
                        редактировать
                    </button>
                </NavLink>
                }
            </div>
            <UserPersonalInfoCard
                user={isEdit ? draftUser : user}
                isEdit={isEdit}
                onChange={setDraftUser}
                disabled={editingDisabled}
                adminMode={adminMode}
            />
            {isEdit && <>
                <p className="user-personal-info-controller__hint">нажмите `сохранить` чтобы данные изменились</p>
                <div className="user-personal-info-controller__actions">
                    <NavLink to={viewPath} onClick={preventNavigationIfDisabled}>
                        <button className="user-personal-info-controller__undo-edit-button" onClick={handleUndo}
                                disabled={editingDisabled}>
                            отменить
                        </button>
                    </NavLink>
                    <button className="user-personal-info-controller__save-mode-button" onClick={handleSave}
                            disabled={editingDisabled}>
                        сохранить
                    </button>
                </div>
            </>
            }

        </div>
    )
}
export default UserPersonalInfoCardController;
