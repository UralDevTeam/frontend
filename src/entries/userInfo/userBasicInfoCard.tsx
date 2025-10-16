import "./userBasicInfoCard.css"
import {User} from "../user";

type UserBasicInfoCard = {
    user: User;
}

function parseDays (value: number) {
    const YEAR = 365, MONTH = 30;
    let year, months, days: number;

    year = value >= YEAR ? Math.floor(value / YEAR) : 0;
    value = year ? value - (year * YEAR) : value;

    months = value >= MONTH ? Math.floor((value % YEAR) / MONTH) : 0;
    value = months ? value - (months * MONTH) : value;

    days = value;

    return `${year} г. ${months} м. ${days} д.`;
}

export default function UserBasicInfoCard({user}: UserBasicInfoCard) {
    return (
        <div className="simple-border-card user-basic-info-card">
            <div className="user-basic-info-card-line">
                <div>фио</div>
                <div>{user.fio}</div>
            </div>
            <hr/>
            <div className="user-basic-info-card-line">
                <div>почта</div>
                <div>{user.mail}</div>
            </div>
            <hr/>
            <div className="user-basic-info-card-line">
                <div>команда</div>
                <div>{user.formatTeam}</div>
            </div>
            <hr/>
            <div className="user-basic-info-card-line">
                <div>руководитель</div>
                <div><a style={{textDecoration: "underline", color: "var(--color-primary-mint)"}} href={user.boss.id}>{user.boss.shortName}</a></div>
            </div>
            <hr/>
            <div className="user-basic-info-card-line">
                <div>роль</div>
                <div>{user.role}</div>
            </div>
            <hr/>
            <div className="user-basic-info-card-line">
                <div>стаж</div>
                <div>{parseDays(user.experience)}</div>
            </div>
        </div>
    )
}