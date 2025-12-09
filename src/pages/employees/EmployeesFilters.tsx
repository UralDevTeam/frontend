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
    onResetFilters: () => void;
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
        onResetFilters,
    }: Props) {

    const hasActiveFilters =
        onlyAdmin ||
        fullText ||
        position ||
        status ||
        department;

    return (
        <div className="employees-filters">
            <div className="filters-group">
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
                    <label htmlFor="search-name">По всем полям</label>
                    <input id="search-name" type="text" value={fullText} onChange={async (e) => {
                        const query = e.target.value;
                        fullTextChange(query);
                    }}
                           placeholder="поиск"/>
                </div>
                <div className="filter-column">
                    <label htmlFor="search-role">Роль</label>
                    <select id="search-role" value={position} onChange={e => onPositionChange(e.target.value)}>
                        <option value="all">Все роли</option>
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
                    <select id="search-department" value={department}
                            onChange={e => onDepartmentChange(e.target.value)}>
                        <option value="">Все подразделения</option>
                        {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="reset-filters-container">
                <button className="reset-filters-button" onClick={onResetFilters} disabled={!hasActiveFilters}>
                    Сбросить фильтры
                </button>
            </div>
        </div>
    );
}
