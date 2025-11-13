import {User} from "../user";
import {NavLink, useNavigate} from "react-router";
import React, {useCallback, useEffect, useState} from "react";
import Modal from "../../shared/modal/Modal";
import UserPersonalInfoCard from "./UserPersonalInfoCard/UserPersonalInfoCard";
import {API_BASE} from "../../shared/apiConfig";
import {userStore} from "../../entities/user";
import {fetchCurrentUser} from "../../entities/user/fetcher";


function SuccessSaveModal({onClose}: { onClose: () => void }) {
    return (
        <Modal onClose={onClose} closeOnBackdrop={false}>
            <div className="modal-body">Ваши данные успешно изменены в личном кабинете</div>
            <div className="modal-actions">
                <button className="edit-mode-button" onClick={onClose}>Хорошо</button>
            </div>
        </Modal>
    )
}

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

    const saveRequest = useCallback(async (updatedUser: User) => {
        const url = `${API_BASE}/api/me`;
        const payload = {
            city: (updatedUser as any).city ?? "",
            phone: (updatedUser as any).phone ?? "",
            mattermost: (updatedUser as any).mattermost ?? "",
            tg: (updatedUser as any).tg ?? "",
            aboutMe: (updatedUser as any).aboutMe ?? ""
        };

        const headers: Record<string, string> = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        const basicToken = localStorage.getItem("basicAuth");
        if (basicToken) {
            headers["Authorization"] = `Basic ${basicToken}`;
        }

        const res = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
            credentials: "include" // включает cookie если используется сессионная авторизация
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Save failed: ${res.status} ${text}`);
        }

        return await res.json();
    }, []);


    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await saveRequest(draftUser);
            await userStore.loadUserFromApi(fetchCurrentUser);
            setShowSuccess(true);
        } finally {
            setIsSaving(false);
        }
    }, [draftUser, saveRequest]);

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
