import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import WorkerStatus from "../../shared/statuses/workerStatus";
import "./employees.css";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import EmployeesFilters from "./EmployeesFilters";
import {mockUsers} from "../../mocks/users";

type EmployeeTableInfo = {
    id: string;
    name: string;
    role: string;
    status: keyof typeof WorkerStatuses;
    department: string;
    legalEntity: string;
    mail: string;
};

const employees: EmployeeTableInfo[] = mockUsers.map(user => ({
    id: user.id,
    name: user.fio,
    role: user.role,
    status: user.status,
    department: user.department,
    legalEntity: user.legalEntity,
    mail: user.mail,
}));

const statusOptions: Array<keyof typeof WorkerStatuses> = Array.from(
    new Set(employees.map(e => e.status))
);

const roleOptions: string[] = Array.from(new Set(employees.map(e => e.role))).sort((a, b) => a.localeCompare(b));

const departmentOptions: string[] = Array.from(new Set(employees.map(e => e.department))).sort((a, b) => a.localeCompare(b));

export default function Employees() {
    const [nameFilter, setNameFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [departmentFilter, setDepartmentFilter] = useState("");

    const filteredData = useMemo(() => {
        const name = nameFilter.trim().toLowerCase();
        return employees.filter(e => (
            (!name || e.name.toLowerCase().includes(name)) &&
            (!roleFilter || e.role === roleFilter) &&
            (!statusFilter || e.status === (statusFilter as keyof typeof WorkerStatuses)) &&
            (!departmentFilter || e.department === departmentFilter)
        ));
    }, [nameFilter, roleFilter, statusFilter, departmentFilter]);

    return (
        <main className={"main"}>
            <h2 className="employees-title">Все сотрудники</h2>

            <EmployeesFilters
                name={nameFilter}
                onNameChange={setNameFilter}
                role={roleFilter}
                onRoleChange={setRoleFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                statuses={statusOptions}
                roles={roleOptions}
                department={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                departments={departmentOptions}
            />

            <div className={"simple-border-card"} style={{marginTop: 16}}>

                <table className="employees-table">
                    <thead className="employees-table-head">
                    <tr>
                        <th>имя</th>
                        <th>роль</th>
                        <th>статус</th>
                        <th>подразделение</th>
                        <th>юр. лицо</th>
                        <th>почта</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map(e => (
                        <tr key={e.id} className={"employees-table-row"}>
                            <td>
                                <Link to={`/profile/view/${e.id}`} className="employees-table-link">
                                    <div className="employees-profile">
                                        <span className="employees-avatar-placeholder" aria-hidden="true"/>
                                        <span>{e.name.split(' ')[0]} {e.name.split(' ')[1]}</span>
                                    </div>
                                </Link>
                            </td>
                            <td>{e.role}</td>
                            <td><WorkerStatus status={e.status}/></td>
                            <td>{e.department}</td>
                            <td>{e.legalEntity}</td>
                            <td>{e.mail}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
