import React from "react";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import getWorkerStatusRussian from "../../shared/statuses/getWorkerStatusRussian";

type Props = {
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
};

export default function EmployeesFilters({
                                             name,
                                             onNameChange,
                                             role,
                                             onRoleChange,
                                             status,
                                             onStatusChange,
                                             statuses,
                                             roles,
                                             department,
                                             onDepartmentChange,
                                             departments
                                         }: Props) {
    return (
        <div className="employees-filters">
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
        </div>
    );
}

