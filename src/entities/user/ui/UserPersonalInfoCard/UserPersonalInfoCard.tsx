import React, {useMemo} from "react";
import WorkerStatusSelectorRowInfo from "../../../../shared/statuses/workerStatusSelectorRowInfo";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import {formatDateRussian} from "../../../../shared/date/formatDateRussian";
import "./userPersonalInfoCard.css"
import CopyIcon from "../../../../shared/icons/copy-icon";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";
import EyeIcon from "../../../../shared/icons/eye-icon";
import EyeCloseIcon from "../../../../shared/icons/yey-close-icon";
import {EditableUser} from "../userEditable";

type IUserPersonalInfoCard = {
    user: EditableUser,
    isEdit: boolean,
    onChange?: (user: EditableUser) => void,
    disabled?: boolean,
    adminMode?: boolean,
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

type RowDefinition = {
    key: keyof EditableUser,
    label: string,
    inputType?: string,
    textarea?: boolean,
    tooltipContent?: React.ReactNode,
};

export default function UserPersonalInfoCard({user, isEdit, onChange, disabled, adminMode = false}: IUserPersonalInfoCard) {
    const editedUser = user as EditableUser;

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

    const update = (key: keyof EditableUser, value: any) => {
        if (disabled) return;

        const newUser = {...editedUser} as any;
        if (key === 'birthday' || key === 'hireDate') {
            newUser[key] = value ? new Date(value) : undefined;
        } else {
            newUser[key] = value;
        }
        if (onChange) onChange(newUser);
    };

    const prefixedInputs: Partial<Record<keyof EditableUser, string>> = {
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

    const formatTeam = (value?: string[] | null) => (Array.isArray(value) && value.length ? value.join(" / ") : "");

    const copyableFields = useMemo(
        () => new Set<keyof EditableUser>(adminMode ? ["phone", "mattermost", "tg", "email"] : ["phone", "mattermost", "tg"]),
        [adminMode]
    );

    const {copiedKey, copy} = useCopyStatus(500);

    const renderViewValue = (r: RowDefinition, currentUser: EditableUser) => {
        const rawValue = currentUser[r.key];

        if (r.key === "birthday") {
            const formatted = formatDateRussian(rawValue as Date | string | undefined, {
                hideYear: !currentUser.isBirthyearVisible,
            });
            return formatted || "-";
        }

        if (r.key === "team") {
            const formattedTeam = formatTeam(rawValue as string[] | undefined);
            return formattedTeam || "-";
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

        return value || "-";
    };

    const renderField = (r: RowDefinition) => {
        const prefix = prefixedInputs[r.key];
        const baseValue = (() => {
            const val = editedUser[r.key] as any;
            if (r.key === 'birthday' || r.key === 'hireDate') return val ? (val instanceof Date ? val.toISOString().slice(0, 10) : String(val)) : '';
            if (r.key === 'team') return formatTeam(val);
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
            if (r.key === 'team') {
                const parts = nextValue.split('/').map((part) => part.trim()).filter(Boolean);
                update('team', parts);
                return;
            }

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

        if (r.key === 'birthday' && !adminMode) {
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

        if (r.key === 'birthday' && adminMode) {
            return (
                <React.Fragment key={String(r.key)}>
                    <RowInfo label={r.label}>
                        <div className="birthday-field">
                            {field}
                            <button
                                type="button"
                                className="birthday-field__toggle"
                                onClick={() => update('isBirthyearVisible', !editedUser.isBirthyearVisible)}
                                disabled={!!disabled}
                            >
                                {editedUser.isBirthyearVisible ? 'Скрыть год рождения' : 'Показать год рождения'}
                            </button>
                        </div>
                    </RowInfo>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment key={String(r.key)}>
                <RowInfo label={r.label} className={r.textarea ? 'row-info--align-start' : undefined}
                         tooltipContent={r.tooltipContent}>
                    {field}
                </RowInfo>
            </React.Fragment>
        );
    };

    if (!adminMode) {
        const primaryRows: RowDefinition[] = [
            {key: "city", label: "город"},
            {key: "birthday", label: 'дата рождения', inputType: 'date'},
            {key: "mattermost", label: 'mattermost', tooltipContent: mattermostTooltip},
        ];

        const optionalRows: RowDefinition[] = [
            {key: "tg", label: 'ник telegram'},
            {key: "phone", label: 'телефон', inputType: 'tel'},
            {key: "aboutMe", label: 'обо мне', textarea: true},
        ];

        const allRows = [...primaryRows, ...optionalRows];

        if (!isEdit) {
            return (
                <div className="user-personal-info-card user-personal-info-card--view">
                    {allRows.map((r, idx) => (
                        <React.Fragment key={String(r.key)}>
                            <RowInfo
                                label={r.label}
                                className={r.key === 'aboutMe' ? 'row-info--align-start' : undefined}
                                tooltipContent={r.tooltipContent}
                                showTooltipTrigger={false}
                            >
                                {renderViewValue(r, user)}
                            </RowInfo>
                            {idx !== allRows.length - 1 && <hr/>}
                        </React.Fragment>
                    ))}
                </div>
            );
        }

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

    const personalRows: RowDefinition[] = [
        {key: "lastName", label: "фамилия"},
        {key: "firstName", label: "имя"},
        {key: "middleName", label: "отчество"},
        {key: "city", label: "город"},
        {key: "birthday", label: 'дата рождения', inputType: 'date'},
    ];

    const workRows: RowDefinition[] = [
        {key: "position", label: "должность"},
        {key: "legalEntity", label: "юр лицо"},
        {key: "department", label: "подразделение"},
        {key: "team", label: "группа"},
        {key: "hireDate", label: "дата выхода на работу", inputType: 'date'},
    ];

    const contactRows: RowDefinition[] = [
        {key: "email", label: 'почта', inputType: 'email'},
        {key: "tg", label: 'ник telegram'},
        {key: "phone", label: 'телефон', inputType: 'tel'},
        {key: "mattermost", label: 'mattermost', tooltipContent: mattermostTooltip},
    ];

    const aboutRows: RowDefinition[] = [
        {key: "aboutMe", label: 'о себе', textarea: true},
    ];

    const Section = ({title, children}: { title: string, children: React.ReactNode }) => (
        <div className="user-personal-info-card__section">
            <p className="user-personal-info-card__section-title">{title}</p>
            <div className="user-personal-info-card__rows">{children}</div>
        </div>
    );

    const renderSectionRows = (rows: RowDefinition[]) => rows.map((row, idx) => (
        <React.Fragment key={String(row.key)}>
            {renderField(row)}
            {idx !== rows.length - 1 && <hr/>}
        </React.Fragment>
    ));

    if (!isEdit) {
        const viewRows: RowDefinition[] = [...personalRows, ...workRows, ...contactRows, ...aboutRows];
        return (
            <div className="user-personal-info-card user-personal-info-card--view">
                {viewRows.map((r, idx) => (
                    <React.Fragment key={String(r.key)}>
                        <RowInfo
                            label={r.label}
                            className={r.key === 'aboutMe' ? 'row-info--align-start' : undefined}
                            tooltipContent={r.tooltipContent}
                            showTooltipTrigger={false}
                        >
                            {renderViewValue(r, user)}
                        </RowInfo>
                        {idx !== viewRows.length - 1 && <hr/>}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    return (
        <div className="user-personal-info-card user-personal-info-card--edit">
            <Section title="Личные данные">
                {renderSectionRows(personalRows)}
            </Section>
            <Section title="О работе">
                {renderSectionRows(workRows)}
                <WorkerStatusSelectorRowInfo
                    status={editedUser.status}
                    onChange={v => update("status", v)}
                    disabled={disabled}
                />
            </Section>
            <Section title="Контактные данные">
                {renderSectionRows(contactRows)}
            </Section>
            <Section title="О себе">
                {renderSectionRows(aboutRows)}
            </Section>
        </div>
    );
}
