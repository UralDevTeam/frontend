import React from "react";
import "./teams.css";

type Props = {
  title: string;
  about: string[]
};

export default function UserLine({title, about}: Props) {
  return (
    <div className="user-line-figma" role="group" aria-label={title}>
      <div className="user-line-title">{title}</div>
      <div className="user-line-metrics">
        {about.map((item) => (
          <div className="user-line-metric" key={title + item}>{item}</div>
        ))}
      </div>
      <div className="user-line-icons">
        <span className="user-line-icon"/>
        <span className="user-line-icon small"/>
      </div>
    </div>
  );
}

