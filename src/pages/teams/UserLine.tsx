import React from "react";
import {Link} from "react-router";
import "./teams.css";
import ProfileCircle from "../../shared/profileCircle/profileCircle";

type Props = {
  id: string;
  isAdmin: boolean;
  title: string;
  about: string;
  depth: number;
  matched?: boolean;
};

export default function UserLine({id, title, about, depth, matched, isAdmin}: Props) {
  return (
    <Link
      to={`/profile/view/${id}`}
      className="teams-row user-line"
      role="group"
      aria-label={title}
      style={{paddingLeft: 24 * depth, background: matched ? '#E5F6F3' : undefined}}
    >
      <ProfileCircle size={20} toSelf={false} isAdmin={isAdmin} userId={id}/>
      <div className="user-line-title">{title}</div>
      <div className="user-line-metrics">
        <div className="user-line-metric">{about}</div>
      </div>
    </Link>
  );
}
