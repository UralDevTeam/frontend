import React, {useState, useEffect, useMemo} from "react";
import {Link} from "react-router";
import { observer } from 'mobx-react-lite';
import WorkerStatus from "../../shared/statuses/workerStatus";
import "./employees.css";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import EmployeesFilters from "./EmployeesFilters";
import { usersStore } from "../../entities/users";

type EmployeeTableInfo = {
  id: string;
  name: string;
  role: string;
  status: keyof typeof WorkerStatuses;
  department?: string;
  legalEntity?: string;
  mail?: string;
  team?: string;
};

function EmployeesComponent() {
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    // загружаем список сотрудников при монтировании, только если ещё нет данных
    if (!usersStore.users || usersStore.users.length === 0) {
      // если API доступен - загрузим, иначе оставим mock
      usersStore.loadFromApi();
    }
  }, []);

  const sourceUsers = usersStore.users;

  const tableData: EmployeeTableInfo[] = sourceUsers.map(u => ({
    id: u.id,
    name: u.fio,
    role: u.role || '—',
    status: (u as any).status as keyof typeof WorkerStatuses,
    department: (u as any).department || ((u as any).team ? ((u as any).team as string[]).join(' / ') : undefined),
    legalEntity: (u as any).legalEntity || (u as any).legalEntity,
    mail: (u as any).mail || (u as any).email || '',
    team: (u as any).team ? ((u as any).team as string[]).join(' / ') : undefined,
  }));

  // вычисляем опции для фильтров
  const statusOptions: Array<keyof typeof WorkerStatuses> = Array.from(
    new Set(tableData.map(t => t.status))
  ).filter(Boolean) as Array<keyof typeof WorkerStatuses>;

  const roleOptions: string[] = Array.from(new Set(tableData.map(t => t.role))).filter(Boolean).sort((a, b) => a.localeCompare(b));

  const departmentOptions: string[] = Array.from(new Set(tableData.map(t => t.department || ''))).filter(d => d).sort((a, b) => a.localeCompare(b));

  const filteredData = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    const role = roleFilter.trim();
    const dept = departmentFilter.trim();

    return tableData.filter(e => (
      (!name || e.name.toLowerCase().includes(name)) &&
      (!role || e.role === role) &&
      (!statusFilter || e.status === (statusFilter as keyof typeof WorkerStatuses)) &&
      (!dept || (e.department || '').toLowerCase() === dept.toLowerCase())
    ));
  }, [nameFilter, roleFilter, statusFilter, departmentFilter, tableData]);

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
          {filteredData.map(e => {
            const parts = e.name.split(' ');
            const displayName = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : e.name;
            return (
              <tr key={e.id} className={"employees-table-row"}>
                <td>
                  <Link to={`/profile/view/${e.id}`} className="employees-table-link">
                    <div className="employees-profile">
                      <span className="employees-avatar-placeholder" aria-hidden="true"/>
                      <span>{displayName}</span>
                    </div>
                  </Link>
                </td>
                <td>{e.role}</td>
                <td><WorkerStatus status={e.status}/></td>
                <td>{e.department || e.team || '—'}</td>
                <td>{e.legalEntity || '—'}</td>
                <td>{e.mail}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default observer(EmployeesComponent);
