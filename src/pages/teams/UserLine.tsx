import React from "react";
import "./teams.css";
import ProfileCircle from "../../shared/profileCircle/profileCircle";

type Props = {
  title: string;
  about: string[];
  depth: number;
  matched?: boolean;
};

export default function UserLine({title, about, depth, matched}: Props) {
  return (
    <div className="teams-row user-line" role="group" aria-label={title} style={{paddingLeft: 24 * depth, background: matched ? '#E5F6F3' : undefined}}>
      <ProfileCircle size={20}/>
      <div className="user-line-title">{title}</div>
      <div className="user-line-metrics">
        {about.map((item) => (
          <div className="user-line-metric" key={title + item}>{item}</div>
        ))}
      </div>
    </div>
  );
}
