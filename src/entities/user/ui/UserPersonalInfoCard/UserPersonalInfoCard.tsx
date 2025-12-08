import React, {useEffect, useMemo, useState} from "react";
import WorkerStatusSelectorRowInfo from "../../../../shared/statuses/workerStatusSelectorRowInfo";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import {formatDateRussian} from "../../../../shared/date/formatDateRussian";
import "./userPersonalInfoCard.css"
import {User} from "../../index";
import CopyIcon from "../../../../shared/icons/copy-icon";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";
import EyeIcon from "../../../../shared/icons/eye-icon";
import EyeCloseIcon from "../../../../shared/icons/yey-close-icon";

type IUserPersonalInfoCard = {
    user: User,
    isEdit: boolean,
    onChange?: (user: User) => void,
    disabled?: boolean,
}

function Field(props: {
    value: string;
    disabled: boolean;
    type?: string;
    onChangeValue: (v: string) => void;
    textarea?: boolean;
    className?: string;
    inputClassName?: string;
}) {
    const {value, disabled, type = 'text', onChangeValue, textarea, className, inputClassName} = props;
    const wrapperClass = ["user-personal-info-card-item", className].filter(Boolean).join(" ");
    return (
        <div className={wrapperClass}>
            {textarea ? (
                <textarea
                    value={value}
                    disabled={disabled}
                    onChange={e => onChangeValue(e.target.value)}
                    className={inputClassName}
                />
            ) : (
                <input
                    value={value}
                    disabled={disabled}
                    type={type}
                    onChange={e => onChangeValue(e.target.value)}
                    className={inputClassName}
                />
            )}
        </div>
    )
}


export default function UserPersonalInfoCard({user, isEdit, onChange, disabled}: IUserPersonalInfoCard) {
    const [editedUser, setEditedUser] = useState<User>(user);

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    const update = (key: keyof User, value: any) => {
        if (disabled) return;

        const newUser = {...editedUser} as any;
        if (key === 'birthday') {
            newUser[key] = value ? new Date(value) : undefined;
        } else {
            newUser[key] = value;
        }
        setEditedUser(newUser);
        if (onChange) onChange(newUser);
    };

    const primaryRows: { key: keyof User; label: string; inputType?: string; textarea?: boolean }[] = [
        {key: "city", label: "город"},
        {key: "birthday", label: 'дата рождения', inputType: 'date'},
        {key: "mattermost", label: 'mattermost'},
    ];

    const optionalRows: { key: keyof User; label: string; inputType?: string; textarea?: boolean }[] = [
        {key: "tg", label: 'ник telegram'},
        {key: "phone", label: 'телефон', inputType: 'tel'},
        {key: "aboutMe", label: 'обо мне', textarea: true},
    ];

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

    const allRows = [...primaryRows, ...optionalRows];

    const copyableFields = useMemo(
        () => new Set<keyof User>(["phone", "mattermost", "tg"]),
        []
    );

    const {copiedKey, copy} = useCopyStatus(500);

    if (!isEdit) {
        return (
            <div className="user-personal-info-card user-personal-info-card--view">
                {allRows.map((r, idx) => (
                    <React.Fragment key={String(r.key)}>
                        <RowInfo
                            label={r.label}
                            className={r.key === 'aboutMe' ? 'row-info--align-start' : undefined}
                        >
                            {(() => {
                                const rawValue = user[r.key];

                                if (r.key === "birthday") {
                                    const formatted = formatDateRussian(rawValue as Date | string | undefined, {
                                        hideYear: !user.isBirthyearVisible,
                                    });
                                    return formatted || "-";
                                }

                                const value = String(rawValue ?? "-");
                                const keyStr = String(r.key);

                                if (copyableFields.has(r.key) && value !== "-") {
                                    return (
                                        <div className="row-copyable">
                                            <span className="row-copyable__text">{value}</span>
                                            <div className="copy-controls">
                                                <button
                                                    className="copy-button"
                                                    onClick={() => copy(value, keyStr)}
                                                    aria-label={`Скопировать ${r.label}`}
                                                    title={`Скопировать ${r.label}`}
                                                >
                                                    <CopyIcon className="copy-button-icon"/>
                                                </button>
                                                {copiedKey === keyStr && (
                                                    <span className="copy-status">скопировано</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                return value;
                            })()}
                        </RowInfo>
                        {idx !== allRows.length - 1 && <hr/>}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    const renderField = (r: { key: keyof User; label: string; inputType?: string; textarea?: boolean }) => {
        const prefix = prefixedInputs[r.key];
        const baseValue = (() => {
            const val = editedUser[r.key] as any;
            if (r.key === 'birthday') return val ? (val instanceof Date ? val.toISOString().slice(0, 10) : String(val)) : '';
            return String(val ?? '');
        })();

        const displayValue = prefix ? ensurePrefixed(baseValue, prefix) || prefix : baseValue;
        const isPlaceholderOnly = prefix && (!baseValue || baseValue === prefix);

        const inputClassNames = [
            isPlaceholderOnly ? 'user-personal-info-card-item__placeholder-value' : '',
            r.key === 'birthday' && !editedUser.isBirthyearVisible
                ? 'birthday-field__input-control--hidden-year'
                : ''
        ].filter(Boolean).join(' ');

        const handleChange = (nextValue: string) => {
            const normalized = prefix ? normalizePrefixedInput(nextValue, prefix) : nextValue;
            const sanitized = prefix && normalized === prefix ? '' : normalized;
            update(r.key, sanitized);
        };

        const field = (
            <Field
                onChangeValue={handleChange}
                value={displayValue}
                disabled={!!disabled}
                type={r.inputType || 'text'}
                textarea={r.textarea}
                className={prefix ? 'user-personal-info-card-item--with-prefix' : undefined}
                inputClassName={inputClassNames}
            />
        );

        if (r.key === 'birthday') {
            return (
                <React.Fragment key={String(r.key)}>
                    <RowInfo label={r.label}>
                        <div className="birthday-field">
                            {field}
                            {editedUser.isBirthyearVisible ? (
                                <EyeIcon
                                    className="birthday-field__icon"
                                    onClick={() => update('isBirthyearVisible', false)}
                                />

                            ) : (
                                <EyeCloseIcon
                                    className="birthday-field__icon eye-closed"
                                    onClick={() => update('isBirthyearVisible', true)}
                                />
                            )}
                        </div>
                    </RowInfo>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment key={String(r.key)}>
                <RowInfo label={r.label} className={r.textarea ? 'row-info--align-start' : undefined}>
                    {field}
                </RowInfo>
            </React.Fragment>
        );
    };

    return (
        <div className="user-personal-info-card user-personal-info-card--edit">
            {primaryRows.map(renderField)}
            <p className="user-personal-info-card__optional-note">Необязательно, но люди больше узнают о тебе</p>
            {optionalRows.map(renderField)}
            <WorkerStatusSelectorRowInfo
                status={editedUser.status}
                onChange={v => update("status", v)}
                disabled={disabled}
            />
        </div>
    );
}
