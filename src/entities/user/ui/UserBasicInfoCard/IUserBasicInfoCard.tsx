import "./userBasicInfoCard.css"
import React from "react";
import RowInfo from "../../../../shared/RowInfo/RowInfo";
import {NavLink} from "react-router";
import {User} from "../../index";
import useCopyStatus from "../../../../shared/hooks/use-copy-status";
import CopyIcon from "../../../../shared/icons/copy-icon";
import { buildContactLink } from "../../../../shared/contactLink/contactLink";
import { parseTeam } from "../../lib/teamParts";

type IUserBasicInfoCard = {
    user: User;
    editPath?: string;
    showEditButton?: boolean;
}

function getPluralForm(value: number, forms: [string, string, string]) {
    const lastDigits = Math.abs(value) % 100;
    const lastDigit = lastDigits % 10;

    if (lastDigits > 10 && lastDigits < 20) return forms[2];
    if (lastDigit > 1 && lastDigit < 5) return forms[1];
    if (lastDigit === 1) return forms[0];

    return forms[2];
}

function formatExperience(value: number) {
    if (!Number.isFinite(value) || value <= 0) return `0 лет 0 месяцев`;

    const YEAR = 365, MONTH = 30;
    const years = Math.floor(value / YEAR);
    const months = Math.floor((value - years * YEAR) / MONTH);

    const yearsLabel = getPluralForm(years, ["год", "года", "лет"]);
    const monthsLabel = getPluralForm(months, ["месяц", "месяца", "месяцев"]);

    return `${years} ${yearsLabel} ${months} ${monthsLabel}`;
}

export default function UserBasicInfoCard({user, editPath, showEditButton = false}: IUserBasicInfoCard) {
    const parts = parseTeam(user.team);
    const email = (user as any).email || '-';
    const emailLink = email !== '-' ? buildContactLink("email", email) : null;
    const emailContent = emailLink ? (
        <a className="contact-link" href={emailLink.href}>{emailLink.label}</a>
    ) : (
        email
    );

    const rows: {
        key: string;
        label: string;
        content: React.ReactNode;
        copyValue?: string;
        contactKey?: "email";
    }[] = [
        {key: 'email', label: 'почта', content: emailContent, copyValue: email, contactKey: "email"},
        {key: 'experience', label: 'стаж', content: formatExperience(user.experience || 0)},
        {
            key: 'boss',
            label: 'руководитель',
            content: user.boss?.id && user.boss?.shortName ? (
                <NavLink
                    className="user-basic-info-card__boss-link"
                    to={`/profile/view/${user.boss.id}`}>
                    {user.boss.shortName}
                </NavLink>
            ) : '-'
        },
        {key: 'role', label: 'роль', content: user.position || '-'},
        { key: "domain", label: "домен", content: parts.domain || "-" },
        { key: "legalEntity", label: "юр.лицо", content: parts.legalEntity || "-" },
        { key: "department", label: "отдел", content: parts.department || "-" },
        { key: "group", label: "направление", content: parts.group || "-" },
    ];

    const {copiedKey, copy} = useCopyStatus(500);

    const renderRow = (r: typeof rows[number], isLast: boolean) => (
        <React.Fragment key={r.key}>
            <RowInfo label={r.label}>
                {r.copyValue && r.copyValue !== '-' ? (
                    <div className="row-copyable">
                        {(() => {
                            const contactLink = r.contactKey ? buildContactLink(r.contactKey, r.copyValue) : null;

                            return (
                                <span className="row-copyable__text">
                                            {contactLink ? (
                                                <a className="contact-link" href={contactLink.href}>{contactLink.label}</a>
                                            ) : (
                                                r.copyValue
                                            )}
                                        </span>
                            );
                        })()}
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
            {!isLast && <hr/>}
        </React.Fragment>
    );

    const headerRows = rows.slice(0, 2);
    const remainingRows = rows.slice(2);
    const showButton = Boolean(showEditButton && editPath);

    return (
        <div className="user-basic-info-card">
            <div className="user-basic-info-card__top">
                <div className="user-basic-info-card__top-rows">
                    {headerRows.map((r, idx) => renderRow(r, remainingRows.length === 0 && idx === headerRows.length - 1))}
                </div>
                {showButton && (
                    <NavLink to={editPath!} className="user-basic-info-card__edit-link">
                        <button className="user-basic-info-card__edit-button">
                            редактировать
                        </button>
                    </NavLink>
                )}
            </div>
            {remainingRows.map((r, idx) => renderRow(r, idx === remainingRows.length - 1))}
        </div>
    )
}
