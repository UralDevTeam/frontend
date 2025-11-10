import "./userBasicInfoCard.css"
import {User} from "../../user";
import React from "react";
import RowInfo from "../RowInfo/RowInfo";
import {NavLink} from "react-router";

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

    const rows = [
        {label: 'почта', content: user.mail || '-'},
        {label: 'стаж', content: parseDays(user.experience || 0)},
        {
            label: 'руководитель',
            content: user.boss ? (
                <NavLink
                    style={{textDecoration: "underline", color: "var(--color-primary-mint)"}}
                    to={`/profile/view/${user.boss.id}`}
                >
                    {user.boss.shortName}
                </NavLink>
            ) : '-',
        },
        {label: 'роль', content: user.role || '-'},
        {label: 'юр.лицо', content: user.legalEntity || '-'},
        {label: 'подразделение', content: user.department || '-'},
        {label: 'команда', content: user.formatTeam || '-'},
    ];

    return (
        <div className="user-basic-info-card">
            {rows.map((r, idx) => (
                <React.Fragment key={r.label}>
                    <RowInfo label={r.label}>{r.content}</RowInfo>
                    {idx !== rows.length - 1 && <hr/>}
                </React.Fragment>
            ))}
        </div>
    )
}

