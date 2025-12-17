import React, { useEffect, useMemo, useState } from "react";
import WorkerStatusSelectorRowInfo from "../../../../shared/statuses/workerStatusSelectorRowInfo";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import { formatDateRussian } from "../../../../shared/date/formatDateRussian";
import "./userPersonalInfoCard.css";
import { User } from "../../index";
import CopyIcon from "../../../../shared/icons/copy-icon";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";
import EyeIcon from "../../../../shared/icons/eye-icon";
import EyeCloseIcon from "../../../../shared/icons/yey-close-icon";
import { buildContactLink } from "../../../../shared/contactLink/contactLink";

type IUserPersonalInfoCard = {
    user: User;
    isEdit: boolean;
    onChange?: (user: User) => void;
    disabled?: boolean;
    adminMode?: boolean;
    invalidFieldKey?: keyof AdminEditedUser;
};

type AdminEditedUser = User & {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    hireDate?: Date;
};

type RowDefinition = {
    key: keyof AdminEditedUser;
    label: string;
    inputType?: string;
    textarea?: boolean;
    tooltipContent?: React.ReactNode;
};

function Field(props: {
    value: string;
    disabled: boolean;
    type?: string;
    onChangeValue: (v: string) => void;
    textarea?: boolean;
    className?: string;
    inputClassName?: string;
}) {
    const { value, disabled, type = "text", onChangeValue, textarea, className, inputClassName } = props;
    const wrapperClass = ["user-personal-info-card-item", className].filter(Boolean).join(" ");

    return (
        <div className={wrapperClass}>
            {textarea ? (
                <textarea
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChangeValue(e.target.value)}
                    className={inputClassName}
                />
            ) : (
                <input
                    value={value}
                    disabled={disabled}
                    type={type}
                    onChange={(e) => onChangeValue(e.target.value)}
                    className={inputClassName}
                />
            )}
        </div>
    );
}

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
        middleName: parts.slice(2).join(" ") ?? "",
    };
};

const composeFio = (lastName?: string, firstName?: string, middleName?: string) =>
    [lastName, firstName, middleName].map((s) => (s ?? "").trim()).filter(Boolean).join(" ");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const deriveHireDate = (experienceDays?: number, existing?: Date) => {
    if (existing) return existing;
    const days = Number(experienceDays);
    if (!Number.isFinite(days) || days <= 0) return undefined;
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    return dt;
};

const computeExperienceDaysFromHireDate = (hireDate?: Date) => {
    if (!hireDate || Number.isNaN(hireDate.getTime())) return undefined;
    const diff = Date.now() - hireDate.getTime();
    const days = Math.floor(diff / MS_PER_DAY);
    return days >= 0 ? days : 0;
};

const withAdminFields = (user: User): AdminEditedUser => {
    const fioParts = splitFio(user.fio);
    return {
        ...user,
        firstName: fioParts.firstName,
        middleName: fioParts.middleName,
        lastName: fioParts.lastName,
        hireDate: deriveHireDate(user.experience, undefined),
    };
};

const stripAdminFields = (u: AdminEditedUser): User => {
    const { firstName, middleName, lastName, hireDate, ...rest } = u;
    return rest as User;
};

const group = (value?: string[] | null) =>
    value?.[3] ?? "";

const parseTeam = (value: string): string[] =>
    value
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean);

const formatPhoneNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) return "";

    const normalized = (digitsOnly.startsWith("8") ? `7${digitsOnly.slice(1)}` : digitsOnly).slice(0, 11);

    const country = normalized.slice(0, 1);
    const part1 = normalized.slice(1, 4);
    const part2 = normalized.slice(4, 7);
    const part3 = normalized.slice(7, 9);
    const part4 = normalized.slice(9, 11);

    let formatted = country ? `+${country}` : "+";
    formatted += part1 ? ` (${part1}` : "";
    formatted += part1 && part1.length === 3 ? ")" : "";
    formatted += part2 ? ` ${part2}` : "";
    formatted += part3 ? `-${part3}` : "";
    formatted += part4 ? `-${part4}` : "";

    return formatted.trim();
};

export default function UserPersonalInfoCard({
                                                 user,
                                                 isEdit,
                                                 onChange,
                                                 disabled,
                                                 adminMode = false,
                                                 invalidFieldKey,
                                             }: IUserPersonalInfoCard) {
    const [editedUser, setEditedUser] = useState<AdminEditedUser>(() =>
        adminMode ? withAdminFields(user) : { ...user }
    );

    const mattermostTooltip = (
        <div className="mattermost-tooltip">
      <span className="mattermost-tooltip__title">
        Добавь ссылку, чтобы коллеги могли тебе написать в mattermost
      </span>
            <ol className="mattermost-tooltip__list">
                <li>Открываешь диалог с собой</li>
                <li>Копируешь ссылку из поисковой строки</li>
                <li>Вставь ссылку в это поле</li>
            </ol>
        </div>
    );

    useEffect(() => {
        setEditedUser(adminMode ? withAdminFields(user) : { ...user });
    }, [user, adminMode]);

    const prefixedInputs: Partial<Record<keyof User, string>> = {
        tg: "@",
        phone: "+7",
    };

    const ensurePrefixed = (value: string, prefix?: string) => {
        if (!prefix) return value;
        const stripped = value.startsWith(prefix) ? value.slice(prefix.length) : value;
        return `${prefix}${stripped}`;
    };

    const normalizePrefixedInput = (value: string, prefix?: string) => {
        if (!prefix) return value;
        const withoutPrefix = value.replace(new RegExp(`^\\${prefix}+`), "");
        return `${prefix}${withoutPrefix}` || prefix;
    };

    const copyableFields = useMemo(() => new Set<keyof User>(["phone", "mattermost", "tg"]), []);
    const { copiedKey, copy } = useCopyStatus(500);

    const update = (key: keyof AdminEditedUser, value: any) => {
        if (disabled) return;

        const next: AdminEditedUser = { ...editedUser };

        if (key === "phone") {
            (next as any)[key] = formatPhoneNumber(String(value ?? ""));
        } else if (key === "birthday" || key === "hireDate") {
            (next as any)[key] = value ? new Date(value) : undefined;
        } else if (key === "team") {
            (next as any)[key] = parseTeam(String(value ?? ""));
        } else {
            (next as any)[key] = value;
        }

        if (adminMode && (key === "firstName" || key === "middleName" || key === "lastName")) {
            const fio = composeFio(next.lastName, next.firstName, next.middleName);
            if (fio) next.fio = fio;
        }

        if (adminMode && key === "hireDate") {
            const days = computeExperienceDaysFromHireDate(next.hireDate);
            if (typeof days === "number") next.experience = days;
        }

        setEditedUser(next);
        onChange?.(stripAdminFields(next));
    };

    // ---------- VIEW MODE ----------
    const viewRows: Array<Pick<RowDefinition, "key" | "label" | "tooltipContent" | "textarea">> = [
        { key: "city", label: "город" },
        { key: "birthday", label: "дата рождения" },
        { key: "tg", label: "ник telegram" },
        { key: "phone", label: "телефон" },
        { key: "mattermost", label: "mattermost", tooltipContent: mattermostTooltip },
        { key: "aboutMe", label: "обо мне", textarea: true },
    ];

    const optionalViewKeys = new Set<(typeof viewRows)[number]["key"]>(["city", "mattermost", "aboutMe", "tg", "phone"]);
    const rowsToRender = viewRows.filter((row) => {
        if (!optionalViewKeys.has(row.key)) return true;

        const value = (user as any)[row.key];
        return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
    });

    if (!isEdit) {
        return (
            <div className="user-personal-info-card user-personal-info-card--view">
                {rowsToRender.map((r, idx) => (
                    <React.Fragment key={String(r.key)}>
                        <RowInfo
                            label={r.label}
                            className={r.key === "aboutMe" ? "row-info--align-start" : undefined}
                            tooltipContent={r.tooltipContent}
                            showTooltipTrigger={false}
                        >
                            {(() => {
                                const rawValue = (user as any)[r.key];

                                if (r.key === "birthday") {
                                    const formatted = formatDateRussian(rawValue as Date | string | undefined, {
                                        hideYear: !user.isBirthyearVisible,
                                    });
                                    return formatted || "-";
                                }

                                if (r.key === "team") {
                                    return group();
                                }

                                const value = String(rawValue ?? "-");
                                const keyStr = String(r.key);
                                const link =
                                    value !== "-" && (r.key === "tg" || r.key === "mattermost")
                                        ? buildContactLink(r.key, value)
                                        : null;
                                const content = link ? (
                                    <a className="contact-link" href={link.href} target="_blank" rel="noreferrer">
                                        {link.label}
                                    </a>
                                ) : (
                                    value
                                );

                                if (copyableFields.has(r.key as keyof User) && value !== "-") {
                                    return (
                                        <div className="row-copyable">
                                            <span className="row-copyable__text">{content}</span>
                                            <div className="copy-controls">
                                                <button
                                                    className="copy-button"
                                                    onClick={() => copy(value, keyStr)}
                                                    aria-label={`Скопировать ${r.label}`}
                                                    title={`Скопировать ${r.label}`}
                                                >
                                                    <CopyIcon className="copy-button-icon" />
                                                </button>
                                                {copiedKey === keyStr && <span className="copy-status">скопировано</span>}
                                            </div>
                                        </div>
                                    );
                                }

                                return content;
                            })()}
                        </RowInfo>
                        {idx !== rowsToRender.length - 1 && <hr />}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    // ---------- EDIT MODE ----------
    const renderField = (r: RowDefinition) => {
        const prefix = (prefixedInputs as Partial<Record<keyof AdminEditedUser, string>>)[r.key];

        const baseValue = (() => {
            const val = (editedUser as any)[r.key];

            if (r.key === "birthday" || r.key === "hireDate") {
                return val ? (val instanceof Date ? val.toISOString().slice(0, 10) : String(val)) : "";
            }

            if (r.key === "team") return group(val);

            return String(val ?? "");
        })();

        const displayValue = prefix ? ensurePrefixed(baseValue, prefix) || prefix : baseValue;
        const isPlaceholderOnly = prefix && (!baseValue || baseValue === prefix);

        const inputClassNames = [
            isPlaceholderOnly ? "user-personal-info-card-item__placeholder-value" : "",
            r.key === "birthday" && !editedUser.isBirthyearVisible ? "birthday-field__input-control--hidden-year" : "",
            invalidFieldKey === r.key ? "user-personal-info-card-item__input--invalid" : "",
        ]
            .filter(Boolean)
            .join(" ");

        const handleChange = (nextValue: string) => {
            const normalized = prefix ? normalizePrefixedInput(nextValue, prefix) : nextValue;
            const sanitized = prefix && normalized === prefix ? "" : normalized;
            update(r.key, sanitized);
        };

        const field = (
            <Field
                onChangeValue={handleChange}
                value={displayValue}
                disabled={!!disabled}
                type={r.inputType || "text"}
                textarea={r.textarea}
                className={prefix ? "user-personal-info-card-item--with-prefix" : undefined}
                inputClassName={inputClassNames}
            />
        );

        if (r.key === "birthday") {
            return (
                <React.Fragment key={String(r.key)}>
                    <RowInfo label={r.label}>
                        <div className="birthday-field">
                            {field}
                            {editedUser.isBirthyearVisible ? (
                                <EyeIcon className="birthday-field__icon" onClick={() => update("isBirthyearVisible", false)} />
                            ) : (
                                <EyeCloseIcon className="birthday-field__icon eye-closed" onClick={() => update("isBirthyearVisible", true)} />
                            )}
                        </div>
                    </RowInfo>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment key={String(r.key)}>
                <RowInfo
                    label={r.label}
                    className={r.textarea ? "row-info--align-start" : undefined}
                    tooltipContent={r.tooltipContent}
                >
                    {field}
                </RowInfo>
            </React.Fragment>
        );
    };

    // --- SELF EDIT ---
    const selfPrimaryRows: RowDefinition[] = [
        { key: "city", label: "город" },
        { key: "birthday", label: "дата рождения", inputType: "date" },
        { key: "mattermost", label: "mattermost", tooltipContent: mattermostTooltip },
    ];

    const selfOptionalRows: RowDefinition[] = [
        { key: "tg", label: "ник telegram" },
        { key: "phone", label: "телефон", inputType: "tel" },
        { key: "aboutMe", label: "обо мне", textarea: true },
    ];

    // --- ADMIN EDIT ---
    const adminFioRows: RowDefinition[] = [
        { key: "lastName", label: "Фамилия" },
        { key: "firstName", label: "Имя" },
        { key: "middleName", label: "Отчество" },
    ];

    const adminMainRows: RowDefinition[] = [
        { key: "city", label: "город" },
        { key: "birthday", label: "дата рождения", inputType: "date" },
    ];

    const adminWorkRows: RowDefinition[] = [
        { key: "position", label: "роль" },
        { key: "legalEntity", label: "юр. лицо" },
        { key: "department", label: "отдел" },
        { key: "team", label: "группа" },
        { key: "hireDate", label: "дата приёма", inputType: "date" },
    ];

    const adminContactRows: RowDefinition[] = [
        { key: "tg", label: "ник telegram" },
        { key: "phone", label: "телефон", inputType: "tel" },
        { key: "mattermost", label: "mattermost" },
        { key: "aboutMe", label: "обо мне", textarea: true },
    ];

    if (!adminMode) {
        return (
            <div className="user-personal-info-card user-personal-info-card--edit">
                {selfPrimaryRows.map(renderField)}

                <p className="user-personal-info-card__optional-note">Необязательно, но люди больше узнают о тебе</p>

                {selfOptionalRows.map(renderField)}

                <WorkerStatusSelectorRowInfo
                    status={editedUser.status}
                    onChange={(v) => update("status", v)}
                    disabled={disabled}
                />
            </div>
        );
    }

    return (
        <div className="user-personal-info-card user-personal-info-card--edit">
            {adminFioRows.map(renderField)}
            {adminMainRows.map(renderField)}

            <h3 className="user-personal-info-card__section-title">О работе</h3>
            {adminWorkRows.map(renderField)}

            <WorkerStatusSelectorRowInfo
                status={editedUser.status}
                onChange={(v) => update("status", v)}
                disabled={disabled}
            />

            <h3 className="user-personal-info-card__section-title">Контактные данные</h3>
            {adminContactRows.map(renderField)}
        </div>
    );
}
