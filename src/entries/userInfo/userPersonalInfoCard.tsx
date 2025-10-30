import {User} from "../user";
import "./userPersonalInfoCard.css"
import React, {useEffect, useState} from "react";
import RowInfo from "./RowInfo";
import WorkerStatusSelector from "../../shared/statuses/workerStatusSelector";

type IUserPersonalInfoCard = {
  user: User,
  isEdit: boolean,
  onChange?: (user: User) => void,
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


export default function UserPersonalInfoCard({user, isEdit, onChange}: IUserPersonalInfoCard) {

  const [editedUser, setEditedUser] = useState<User>(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user])

  const update = (key: keyof User, value: any) => {
    const newUser = {...editedUser} as any;
    if (key === 'birthday') {
      newUser[key] = value ? new Date(value) : undefined;
    } else {
      newUser[key] = value;
    }
    setEditedUser(newUser);
    if (onChange) onChange(newUser);
  }

  const rows: { key: keyof User; label: string; inputType?: string; textarea?: boolean }[] = [
    {key: "city", label: 'город'},
    {key: "birthday", label: 'дата рождения', inputType: 'date'},
    {key: "phone", label: 'телефон', inputType: 'tel'},
    {key: "mattermost", label: 'mattermost'},
    {key: "tg", label: 'ник tg'},
    {key: "aboutMe", label: 'о себе', textarea: true},
  ];

  if (!isEdit) {
    return (
      <div className="user-personal-info-card">
        {rows.map((r, idx) => (
          <React.Fragment key={String(r.key)}>
            <RowInfo label={r.label}>
              {String(user[r.key] || '-')}
            </RowInfo>
            {idx !== rows.length - 1 && <hr/>}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className="user-personal-info-card">
      {rows.map((r, idx) => (
        <React.Fragment key={String(r.key)}>
          <RowInfo label={r.label}>
            <Field
              onChangeValue={v => update(r.key, v)}
              value={(() => {
                const val = editedUser[r.key] as any;
                if (r.key === 'birthday') return val ? (val instanceof Date ? val.toISOString().slice(0, 10) : String(val)) : '';
                return String(val ?? '');
              })()}
              disabled={false}
              type={r.inputType || 'text'}
              textarea={r.textarea}
            />
          </RowInfo>
        </React.Fragment>
      ))}
      <WorkerStatusSelector status={user.status} onChange={v => update("status", v)}/>
    </div>
  )
}