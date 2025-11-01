import React from "react";

type Props = {
  name: string;
  onNameChange: (v: string) => void;
  role: string;
  onRoleChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  statuses: string[];
};

export default function EmployeesFilters({ name, onNameChange, role, onRoleChange, status, onStatusChange, statuses }: Props) {
  return (
    <div className="employees-filters">
      <div className="filter-column">
        <label htmlFor="search-name">По имени</label>
        <input id="search-name" type="text" value={name} onChange={e => onNameChange(e.target.value)} placeholder="имя..." />
      </div>
      <div className="filter-column">
        <label htmlFor="search-role">Роль</label>
        <input id="search-role" type="text" value={role} onChange={e => onRoleChange(e.target.value)} placeholder="роль..." />
      </div>
      <div className="filter-column">
        <label htmlFor="search-status">Статус</label>
        <select id="search-status" value={status} onChange={e => onStatusChange(e.target.value)}>
          <option value="">Все статусы</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

