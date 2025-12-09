import React from "react";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";

type Props = {
  onlyAdmin: boolean
  onOnlyAdminChange: (v: boolean) => void;
  fullText: string;
  fullTextChange: (v: string) => void;
  position: string;
  onPositionChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  statuses: Array<keyof typeof WorkerStatuses>;
  positions: string[];
  department: string;
  onDepartmentChange: (v: string) => void;
  departments: string[];
  // add user controls
  adminMode?: boolean;
  addMode?: boolean;
  onStartAdd?: () => void;
  onSaveAdd?: () => void;
  onCancelAdd?: () => void;
  isSavingAdd?: boolean;
  onUpdateAD: () => void;
};

export default function EmployeesFilters(
  {
    onlyAdmin, onOnlyAdminChange,
    fullText, fullTextChange,
    position, onPositionChange,
    status, onStatusChange,
    statuses,
    positions,
    department, onDepartmentChange,
    departments,
    adminMode = false,
    addMode = false,
    onStartAdd,
    onSaveAdd,
    onCancelAdd,
    isSavingAdd = false,
    onUpdateAD
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
        <label htmlFor="search-name">По всеем полям</label>
        <input id="search-name" type="text" value={fullText} onChange={async (e) => {
          const query = e.target.value;
          fullTextChange(query);
        }}
               placeholder=""/>
      </div>
      <div className="filter-column">
        <label htmlFor="search-role">Роль</label>
        <select id="search-role" value={position} onChange={e => onPositionChange(e.target.value)}>
          <option value="">Все роли</option>
          {positions.map(r => (
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
      {adminMode &&
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16}}>
          <button className="AD-sync-button" onClick={onUpdateAD}>
            AD выгрузка <img src="/icons/dowland.svg" alt="dowland icon"/>
          </button>
          {!addMode && (
            <button className="edit-mode-button" onClick={onStartAdd} title="Добавить пользователя">
              <img src="/icons/PlusInCircle.svg" alt="PlusInCircle icon"/>
            </button>
          )}
          {addMode && (
            <>
              <button className="edit-mode-button" onClick={onSaveAdd} disabled={isSavingAdd}>
                сохранить
              </button>
              <button className="undo-edit-button" onClick={onCancelAdd} disabled={isSavingAdd}>
                отменить
              </button>
            </>
          )}
        </div>
      }
    </div>
  );
}
