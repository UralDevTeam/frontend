import React from "react";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";

type Props = {
  onlyAdmin: boolean
  onOnlyAdminChange: (v: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  role: string;
  onRoleChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  statuses: Array<keyof typeof WorkerStatuses>;
  roles: string[];
  department: string;
  onDepartmentChange: (v: string) => void;
  departments: string[];
  // add user controls
  showAddModeButton?: boolean;
  addMode?: boolean;
  onStartAdd?: () => void;
  onSaveAdd?: () => void;
  onCancelAdd?: () => void;
  isSavingAdd?: boolean;
};

export default function EmployeesFilters(
  {
    onlyAdmin, onOnlyAdminChange,
    name, onNameChange,
    role, onRoleChange,
    status, onStatusChange,
    statuses,
    roles,
    department, onDepartmentChange,
    departments,
    showAddModeButton = false,
    addMode = false,
    onStartAdd,
    onSaveAdd,
    onCancelAdd,
    isSavingAdd = false,
  }: Props) {
  return (
    <div className="employees-filters" style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div className="filter-column">
        <label htmlFor="only-admin" style={{display: 'flex'}} className={"filter-column-checkbox__label"}>
          <img
            src={"/icons/Star.svg"} width={16} height={16} alt={"is admin"}
            className={onlyAdmin ? "" : "filter-column-checkbox-star-gray"}
          />
        </label>
        <input
          id="only-admin" type="checkbox"
          checked={onlyAdmin} onChange={e => onOnlyAdminChange(e.target.checked)}
        />
      </div>
      <div className="filter-column">
        <label htmlFor="search-name">По имени</label>
        <input id="search-name" type="text" value={name} onChange={e => onNameChange(e.target.value)}
               placeholder="имя..."/>
      </div>
      <div className="filter-column">
        <label htmlFor="search-role">Роль</label>
        <select id="search-role" value={role} onChange={e => onRoleChange(e.target.value)}>
          <option value="">Все роли</option>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="filter-column">
        <label htmlFor="search-status">Статус</label>
        <select id="search-status" value={status} onChange={e => onStatusChange(e.target.value)}>
          <option value="">Все статусы</option>
          {statuses.map(s => (
            <option key={s} value={s}>{getWorkerStatusRussian(s)}</option>
          ))}
        </select>
      </div>
      <div className="filter-column">
        <label htmlFor="search-department">Подразделение</label>
        <select id="search-department" value={department} onChange={e => onDepartmentChange(e.target.value)}>
          <option value="">Все подразделения</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      {showAddModeButton &&
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>
          {!addMode && (
            <button className="edit-mode-button" onClick={onStartAdd} title="Добавить пользователя">+</button>
          )}
          {addMode && (
            <>
              <button className="edit-mode-button" onClick={onSaveAdd} disabled={isSavingAdd}>сохранить</button>
              <button className="undo-edit-button" onClick={onCancelAdd} disabled={isSavingAdd}>отменить</button>
            </>
          )}
        </div>
      }
    </div>
  );
}
