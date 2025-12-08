import React from "react";
import "./rowInfo.css"

type RowInfoProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
};

export default function RowInfo({label, children, className}: RowInfoProps) {
    return (
    <div className={`row-info ${className ?? ""}`}>
      <div className={"label"}>{label}</div>
      <div className={"value"}>{children}</div>
    </div>
  )
}
