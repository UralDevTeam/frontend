import "./userBasicInfoCard.css"
import {User} from "../user";
import React from "react";
import RowInfo from "./RowInfo";

type UserBasicInfoCard = {
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

export default function UserBasicInfoCard({user}: UserBasicInfoCard) {

  const rows = [
    {label: 'почта', content: user.mail || '-'},
    {label: 'стаж', content: parseDays(user.experience || 0)},
    {
      label: 'руководитель', content: (
        <a style={{textDecoration: "underline", color: "var(--color-primary-mint)"}} href={user.boss?.id || '#'}>
          {user.boss?.shortName || '-'}
        </a>
      )
    },
    {label: 'роль', content: user.role || '-'},
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