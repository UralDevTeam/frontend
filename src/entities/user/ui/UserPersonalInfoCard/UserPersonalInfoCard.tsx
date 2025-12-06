import React, {useEffect, useMemo, useState} from "react";
import WorkerStatusSelectorRowInfo from "../../../../shared/statuses/workerStatusSelectorRowInfo";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import {formatDateRussian} from "../../../../shared/date/formatDateRussian";
import "./userPersonalInfoCard.css"
import {User} from "../../index";
import CopyIcon from "../../../../shared/copy-icon/copy-icon";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";

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
}) {
    const {value, disabled, type = 'text', onChangeValue, textarea} = props;
    return (
        <div className="user-personal-info-card-item">
            {textarea ? (
                <textarea
                    value={value}
                    disabled={disabled}
                    onChange={e => onChangeValue(e.target.value)}
                />
            ) : (
                <input
                    value={value}
                    disabled={disabled}
                    type={type}
                    onChange={e => onChangeValue(e.target.value)}
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

    const rows: { key: keyof User; label: string; inputType?: string; textarea?: boolean }[] = [
        {key: "city", label: 'город'},
        {key: "birthday", label: 'дата рождения', inputType: 'date'},
        {key: "email", label: 'почта', inputType: 'email'},
        {key: "phone", label: 'телефон', inputType: 'tel'},
        {key: "mattermost", label: 'mattermost'},
        {key: "tg", label: 'ник telegram'},
        {key: "aboutMe", label: 'обо мне', textarea: true},
    ];

    const copyableFields = useMemo(
        () => new Set<keyof User>(["email", "phone", "mattermost", "tg"]),
        []
    );

    const {copiedKey, copy} = useCopyStatus(500);

    if (!isEdit) {
        return (
            <div className="user-personal-info-card">
                {rows.map((r, idx) => (
                    <React.Fragment key={String(r.key)}>
                        <RowInfo label={r.label}>
                            {(() => {
                                const rawValue = user[r.key];

                                if (r.key === "birthday") {
                                    const formatted = formatDateRussian(rawValue as Date | string | undefined);
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
                        {idx !== rows.length - 1 && <hr/>}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    return (
        <div className="user-personal-info-card">
            {rows.map((r) => (
                <React.Fragment key={String(r.key)}>
                    <RowInfo label={r.label}>
                        <Field
                            onChangeValue={v => update(r.key, v)}
                            value={(() => {
                                const val = editedUser[r.key] as any;
                                if (r.key === 'birthday') return val ? (val instanceof Date ? val.toISOString().slice(0, 10) : String(val)) : '';
                                return String(val ?? '');
                            })()}
                            disabled={!!disabled}
                            type={r.inputType || 'text'}
                            textarea={r.textarea}
                        />
                    </RowInfo>
                </React.Fragment>
            ))}
            <WorkerStatusSelectorRowInfo
                status={editedUser.status}
                onChange={v => update("status", v)}
                disabled={disabled}
            />
        </div>
    );
}
