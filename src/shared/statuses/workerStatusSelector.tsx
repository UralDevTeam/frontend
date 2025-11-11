import {WorkerStatuses} from "./workerStatuses";
import getWorkerStatusRussian from "./getWorkerStatusRussian";
import RowInfo from "../../entries/userInfo/RowInfo/RowInfo";
import React from "react";

interface Props {
  status: keyof typeof WorkerStatuses;
  onChange: (value: keyof typeof WorkerStatuses) => void;
    disabled?: boolean;
}

export default function WorkerStatusSelector({status, onChange, disabled}: Props) {
  return (
    <RowInfo label="текущий статус">
      <select
        id="status"
        className="styled-select"
        value={status}
        onChange={e=>onChange(e.target.value as keyof typeof WorkerStatuses)}
        disabled={disabled}
      >
        {Object.keys(WorkerStatuses).map((entry) => (
          <option key={entry} value={entry}>{getWorkerStatusRussian(entry)}</option>
        ))}
      </select>
    </RowInfo>
  )
}
