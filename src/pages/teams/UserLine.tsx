import React from "react";
import "./teams.css";
import ProfileCircle from "../../shared/profileCircle/profileCircle";

type Props = {
  title: string;
  about: string[];
  depth: number;
};

export default function UserLine({title, about, depth}: Props) {
  return (
    <div className="user-line" role="group" aria-label={title} style={{paddingLeft: 24 * depth}}>
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

