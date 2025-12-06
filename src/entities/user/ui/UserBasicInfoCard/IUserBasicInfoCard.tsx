import "./userBasicInfoCard.css"
import React from "react";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import {NavLink} from "react-router";
import {User} from "../../index";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";
import CopyIcon from "../../../../shared/copy-icon/copy-icon";

type IUserBasicInfoCard = {
    user: User;
}

function parseDays(value: number) {
    if (!Number.isFinite(value) || value <= 0) return `0 г. 0 м. 0 д.`;
    const YEAR = 365, MONTH = 30;
    let year = Math.floor(value / YEAR);
    let rest = value - year * YEAR;
    let months = Math.floor(rest / MONTH);
    let days = rest - months * MONTH;

    return `${year} г. ${months} м. ${days} д.`;
}

export default function UserBasicInfoCard({user}: IUserBasicInfoCard) {
    const email = (user as any).email || '-';

    const rows: {
        key: string;
        label: string;
        content: React.ReactNode;
        copyValue?: string;
    }[] = [
        {key: 'mail', label: 'почта', content: email, copyValue: email},
        {key: 'experience', label: 'стаж', content: parseDays(user.experience || 0)},
        {
            key: 'boss',
            label: 'руководитель',
            content: user.boss ? (
                <NavLink
                    className="user-basic-info-card__boss-link"
                    to={`/profile/view/${user.boss.id}`}>
                    {user.boss.shortName}
                </NavLink>
            ) : '-'
        },
        {key: 'role', label: 'роль', content: user.role || '-'},
        {key: 'legalEntity', label: 'юр.лицо', content: (user as any).legalEntity || '-'},
        {key: 'department', label: 'подразделение', content: (user as any).department || '-'},
        {key: 'formatTeam', label: 'группа', content: (user as any).formatTeam || '-'},
    ];

    const {copiedKey, copy} = useCopyStatus(500);

    return (
        <div className="user-basic-info-card">
            {rows.map((r, idx) => (
                <React.Fragment key={r.key}>
                    <RowInfo label={r.label}>
                        {r.copyValue && r.copyValue !== '-' ? (
                            <div className="row-copyable">
                                <span className="row-copyable__text">{r.copyValue}</span>
                                <div className="copy-controls">
                                    <button
                                        className="copy-button"
                                        onClick={() => copy(r.copyValue!, r.key)}
                                        aria-label={`Скопировать ${r.label}`}
                                        title={`Скопировать ${r.label}`}
                                    >
                                        <CopyIcon className="copy-button-icon"/>
                                    </button>
                                    {copiedKey === r.key && (
                                        <span className="copy-status">скопировано</span>
                                    )}
                                </div>
                            </div>
                        ) : r.content}
                    </RowInfo>
                    {idx !== rows.length - 1 && <hr/>}
                </React.Fragment>
            ))}
        </div>
    )
}
