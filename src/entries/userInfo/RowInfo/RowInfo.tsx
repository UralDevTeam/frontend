import React from "react";
import "./rowInfo.css"

export default function RowInfo({label, children}: { label: string, children: React.ReactNode }) {
  return (
    <div className="row-info">
      <div className={"label"}>{label}</div>
      <div className={"value"}>{children}</div>
    </div>
  )
}