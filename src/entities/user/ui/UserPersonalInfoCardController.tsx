import {NavLink, useNavigate} from "react-router";
import React, {useCallback, useEffect, useState} from "react";
import UserPersonalInfoCard from "./UserPersonalInfoCard/UserPersonalInfoCard";
import {User, userStore} from "../index";
import {fetchCurrentUser} from "../fetcher";
import {saveUser} from "../../../features/editUser/saveUser";
import "./UserPersonalInfoCardController.css";

const capitalizeCity = (city?: string) => {
    const trimmed = (city ?? "").trim();
    if (!trimmed) return "";
    return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
};

const isMattermostValid = (value?: string) => {
    if (!value) return true;
    return /^(https?:\/\/)/.test(value.trim());
};

const formatPhoneNumber = (value?: string) => {
    const digits = (value ?? "").replace(/\D/g, "");
    if (!digits) return "";
    const normalized = (digits.startsWith("8") ? `7${digits.slice(1)}` : digits).slice(0, 11);

    const part1 = normalized.slice(0, 1);
    const part2 = normalized.slice(1, 4);
    const part3 = normalized.slice(4, 7);
    const part4 = normalized.slice(7, 9);
    const part5 = normalized.slice(9, 11);

    let result = part1 ? `+${part1}` : "";
    result += part2 ? ` (${part2}` : "";
    result += part2 && part2.length === 3 ? ")" : "";
    result += part3 ? ` ${part3}` : "";
    result += part4 ? `-${part4}` : "";
    result += part5 ? `-${part5}` : "";

    return result.trim();
};

const isPhoneValid = (value?: string) => {
    const digits = (value ?? "").replace(/\D/g, "");
    return digits.length === 11 && digits.startsWith("7");
};

const isAboutValid = (value?: string) => (value ?? "").length <= 1000;

const isBirthdayValid = (date?: Date | string) => {
    if (!date) return true;
    const dt = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(dt.getTime())) return false;

    const now = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(now.getFullYear() - 100);

    return dt >= hundredYearsAgo && dt <= now;
};

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
    };
};

type InvalidFieldKey = keyof User | "firstName" | "middleName" | "lastName";


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
    const [validationError, setValidationError] = useState<string | null>(null);
    const [invalidFieldKey, setInvalidFieldKey] = useState<InvalidFieldKey | null>(null);

    useEffect(() => {
        setDraftUser(user);
        setOriginalUser(user);
    }, [user]);

    useEffect(() => {
        setValidationError(null);
        setInvalidFieldKey(null);
    }, [draftUser]);

    const handleUndo = useCallback(() => {
    }, [draftUser]);
    const prepareUserForSave = useCallback((userToNormalize: User): { user?: User; error?: string; invalidKey?: InvalidFieldKey } => {
        const next: User = { ...userToNormalize };
        next.city = capitalizeCity(next.city);
        next.mattermost = (next.mattermost ?? "").trim();
        next.phone = formatPhoneNumber(next.phone);
        next.aboutMe = next.aboutMe ?? "";

        if (!isMattermostValid(next.mattermost)) {
            return { error: "Ссылка на mattermost должна начинаться с http:// или https://", invalidKey: "mattermost" };
        }

        if (next.phone && !isPhoneValid(next.phone)) {
            return { error: "Телефон должен содержать 11 цифр и начинаться с +7", invalidKey: "phone" };
        }

        if (!isAboutValid(next.aboutMe)) {
            return { error: "Поле \"Обо мне\" должно содержать не более 1000 символов", invalidKey: "aboutMe" };
        }

        if (!isBirthdayValid(next.birthday)) {
            return { error: "Дата рождения должна соответствовать возрасту не старше 100 лет", invalidKey: "birthday" };
        }

        if (adminMode) {
            const fioParts = splitFio(next.fio);
            if (!fioParts.lastName || !fioParts.firstName) {
                return {
                    error: "Для сотрудника обязательны фамилия и имя",
                    invalidKey: !fioParts.lastName ? "lastName" : "firstName",
                };
            }

            if (!next.position?.trim()) {
                return { error: "Поле \"роль\" обязательно для заполнения", invalidKey: "position" };
            }
        }

        return { user: next };
    }, [adminMode]);

    const handleSave = useCallback(async () => {
        const normalized = prepareUserForSave(draftUser);
        if (normalized.error) {
            setValidationError(normalized.error);
            setInvalidFieldKey(normalized.invalidKey ?? null);
            return;
        }

        if (normalized.user) {
            setDraftUser(normalized.user);
        }

        setValidationError(null);
        setInvalidFieldKey(null);
        setIsSaving(true);
        try {
            await (saveUserFn ?? ((u: User) => saveUser(u)))(normalized.user ?? draftUser, originalUser);

            if (afterSave) {
                await afterSave();
            } else {
                await userStore.loadUserFromApi(fetchCurrentUser);
            }
            navigate(viewPath);
        } finally {
            setIsSaving(false);
        }
    }, [draftUser, originalUser, navigate, viewPath, saveUserFn, afterSave, prepareUserForSave]);

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
                invalidFieldKey={invalidFieldKey ?? undefined}
            />
            {isEdit && <>
                {validationError && <p className="user-personal-info-controller__error">{validationError}</p>}
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
