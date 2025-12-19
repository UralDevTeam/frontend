import {NavLink, useNavigate} from "react-router";
import {routes} from "../../../shared/routes";
import React, {useCallback, useEffect, useState} from "react";
import {createPortal} from "react-dom";
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
    return /^https:\/\/most\.udv\.group\/udv\/messages\/@.+/.test(value.trim());
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
    if (!date) return false;
    const dt = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(dt.getTime())) return false;

    const now = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(now.getFullYear() - 100);

    const fourteenYearsAgo = new Date();
    fourteenYearsAgo.setFullYear(now.getFullYear() - 14);

    return dt >= hundredYearsAgo && dt <= fourteenYearsAgo;
};

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
    };
};

const normalizeTeam = (team?: string[]) =>
    Array.isArray(team) ? team.map((v) => String(v ?? "").trim()).filter(Boolean) : [];

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
    showEditButton?: boolean;
};

const UserPersonalInfoCardController = (
    {
        user,
        isEdit,
        canEdit = false,
        editPath = routes.meEdit(),
        viewPath = routes.me(),
        saveUserFn,
        afterSave,
        adminMode = false,
        showEditButton = true,
    }: Props) => {
    const navigate = useNavigate();
    const [draftUser, setDraftUser] = useState<User>(user);
    const [originalUser, setOriginalUser] = useState<User>(user);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [invalidFieldKeys, setInvalidFieldKeys] = useState<InvalidFieldKey[]>([]);
    const [actionsHost, setActionsHost] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setDraftUser(user);
        setOriginalUser(user);
    }, [user]);

    useEffect(() => {
        setValidationError(null);
        setInvalidFieldKeys([]);
    }, [draftUser]);

    useEffect(() => {
        const host = document.getElementById("user-profile-edit-actions-anchor");
        setActionsHost(host);
    }, []);

    const handleUndo = useCallback(() => {
    }, [draftUser]);
    const prepareUserForSave = useCallback((userToNormalize: User): { user?: User; error?: string; invalidKeys?: InvalidFieldKey[] } => {
        const next: User = { ...userToNormalize };
        next.city = capitalizeCity(next.city);
        next.mattermost = (next.mattermost ?? "").trim();
        next.phone = formatPhoneNumber(next.phone);
        next.aboutMe = next.aboutMe ?? "";

        if (!isMattermostValid(next.mattermost)) {
            return { error: "Ссылка на mattermost должна начинаться с https://most.udv.group/udv/messages/@", invalidKeys: ["mattermost"] };
        }

        if (next.phone && !isPhoneValid(next.phone)) {
            return { error: "Телефон должен содержать 11 цифр и начинаться с +7", invalidKeys: ["phone"] };
        }

        if (!isAboutValid(next.aboutMe)) {
            return { error: "Поле \"Обо мне\" должно содержать не более 1000 символов", invalidKeys: ["aboutMe"] };
        }

        if (!isBirthdayValid(next.birthday)) {
            return { error: "Заполните дату рождения: возраст должен быть от 14 до 100 лет", invalidKeys: ["birthday"] };
        }

        if (adminMode) {
            const [domain, legalEntity, department, group] = [0, 1, 2, 3].map(
                (idx) => (Array.isArray(next.team) ? String(next.team[idx] ?? "").trim() : "")
            );

            if (!domain) {
                return {
                    error: "Поле \"домен\" обязательно для заполнения",
                    invalidKeys: ["domain"],
                };
            }

            if (legalEntity && !domain) {
                return {
                    error: "Чтобы добавить юр. лицо, сначала укажите домен",
                    invalidKeys: ["domain"],
                };
            }

            if (department && (!domain || !legalEntity)) {
                return {
                    error: "Для изменения отдела заполните домен и юр. лицо",
                    invalidKeys: !domain ? ["domain"] : ["legalEntity"],
                };
            }

            if (group && (!domain || !legalEntity || !department)) {
                return {
                    error: "Для изменения направления заполните домен, юр. лицо и отдел",
                    invalidKeys: !domain ? ["domain"] : !legalEntity ? ["legalEntity"] : ["department"],
                };
            }

            const sanitizedTeam = normalizeTeam(next.team);
            const originalTeam = normalizeTeam(originalUser.team);
            const addedSegmentsCount = sanitizedTeam.filter((_, idx) => idx >= originalTeam.length).length;

            if (addedSegmentsCount > 1) {
                return {
                    error: "За один раз можно добавить только один новый уровень структуры. Добавляйте части команды поэтапно",
                    invalidKeys: ["domain", "legalEntity", "department", "group"],
                };
            }

            next.team = sanitizedTeam;
            next.domain = sanitizedTeam[0] ?? "";
            next.legalEntity = sanitizedTeam[1] ?? "";
            next.department = sanitizedTeam[2] ?? "";
            next.group = sanitizedTeam[3] ?? "";

            const fioParts = splitFio(next.fio);
            if (!fioParts.lastName || !fioParts.firstName) {
                return {
                    error: "Для сотрудника обязательны фамилия и имя",
                    invalidKeys: !fioParts.lastName ? ["lastName"] : ["firstName"],
                };
            }

            if (!next.position?.trim()) {
                return { error: "Поле \"роль\" обязательно для заполнения", invalidKeys: ["position"] };
            }
        }

        return { user: next };
    }, [adminMode, originalUser]);

    const handleSave = useCallback(async () => {
        const normalized = prepareUserForSave(draftUser);
        if (normalized.error) {
            setValidationError(normalized.error);
            setInvalidFieldKeys(normalized.invalidKeys ?? []);
            return;
        }

        if (normalized.user) {
            setDraftUser(normalized.user);
        }

        setValidationError(null);
        setInvalidFieldKeys([]);
        setIsSaving(true);
        try {
            await (saveUserFn ?? ((u: User) => saveUser(u)))(normalized.user ?? draftUser, originalUser);

            if (afterSave) {
                await afterSave();
            } else {
                await userStore.loadUserFromApi(fetchCurrentUser);
            }
            navigate(viewPath);
        } catch (err) {
            const rawMessage = (err as Error)?.message ?? String(err);
            let friendlyMessage = "Не удалось сохранить изменения. Проверьте, что домен, юр. лицо, отдел и направление существуют и указаны без опечаток. За раз можно создать только одну новую структуру.";
            let friendlyInvalidKeys: InvalidFieldKey[] = ["domain", "legalEntity", "department", "group"];

            if (/Team '.+' not found/i.test(rawMessage)) {
                friendlyMessage =
                    "Не найдена указанная структура. Убедитесь, что названия домена, юр.лица, отдела и направления написаны без опечаток и существуют в системе.\n\nЕсли вы создаёте новую структуру, убедитесь, что создаёте только один уровень иерархии, который должен быть наименьшим.";
            }

            setValidationError(friendlyMessage);
            setInvalidFieldKeys(friendlyInvalidKeys);
            return;
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

    const actions = (
        <div className={`user-personal-info-controller__actions ${actionsHost ? "user-personal-info-controller__actions--floating" : ""}`}>
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
    );

    return (
        <div className="user-personal-info-controller">
            <div className="user-personal-info-controller__header">
                {!isEdit && <p className="user-profile-section-title">Личное</p>}
                {!isEdit && canEdit && showEditButton && <NavLink to={editPath}>
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
                invalidFieldKeys={invalidFieldKeys}
            />
            {isEdit && <>
                {validationError && <p className="user-personal-info-controller__error">{validationError}</p>}
                <p className="user-personal-info-controller__hint">нажмите `сохранить` чтобы данные изменились</p>
                {actionsHost ? createPortal(actions, actionsHost) : actions}
            </>
            }

        </div>
    )
}
export default UserPersonalInfoCardController;
