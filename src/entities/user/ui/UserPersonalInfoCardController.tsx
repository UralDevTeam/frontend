import {NavLink, useNavigate} from "react-router";
import React, {useCallback, useEffect, useState} from "react";
import UserPersonalInfoCard from "./UserPersonalInfoCard/UserPersonalInfoCard";
import {User, userStore} from "../index";
import {fetchCurrentUser} from "../fetcher";
import SuccessSaveModal from "../../../features/editUser/SuccessSaveModal";
import {saveUser} from "../../../features/editUser/saveUser";


type Props = {
    user: User;
    isEdit: boolean;
    canEdit?: boolean;
    editPath?: string;
    viewPath?: string;
};

const UserPersonalInfoCardController = ({
    user,
    isEdit,
    canEdit = false,
    editPath = "/me/edit",
    viewPath = "/me",
}: Props) => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    const [draftUser, setDraftUser] = useState<User>(user);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setDraftUser(user);
    }, [user]);

    const handleUndo = useCallback(() => {
        console.log("Отмена редактирования пользователя", draftUser);
    }, [draftUser]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await saveUser(draftUser);
            await userStore.loadUserFromApi(fetchCurrentUser);
            setShowSuccess(true);
        } finally {
            setIsSaving(false);
        }
    }, [draftUser]);

    const handleSuccessClose = useCallback(() => {
        setShowSuccess(false);
        navigate(viewPath);
    }, [navigate, viewPath]);

    const editingDisabled = showSuccess || isSaving;
    const preventNavigationIfDisabled = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        if (editingDisabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, [editingDisabled]);

    return (
        <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column", width: "max-content"}}>
            {showSuccess && <SuccessSaveModal onClose={handleSuccessClose}/>}
            <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                <p className="user-profile-section-title">Личное</p>
                {!isEdit && canEdit && <NavLink to={editPath}>
                    <button className="edit-mode-button">
                        редактировать
                        <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
                    </button>
                </NavLink>
                }
            </div>
            <UserPersonalInfoCard
                user={isEdit ? draftUser : user}
                isEdit={isEdit}
                onChange={setDraftUser}
                disabled={editingDisabled}
            />
            {isEdit && <div style={{display: "flex", gap: 18, height: 48}}>
                <NavLink to={viewPath} onClick={preventNavigationIfDisabled}>
                    <button className="undo-edit-button" onClick={handleUndo} disabled={editingDisabled}>
                        отменить
                    </button>
                </NavLink>
                <button className="edit-mode-button" onClick={handleSave} disabled={editingDisabled}>
                    сохранить
                </button>
            </div>
            }

        </div>
    )
}
export default UserPersonalInfoCardController;
