import React, {useMemo, useState, useEffect} from "react";
import WorkerStatus from "../../shared/statuses/workerStatus";
import "./employees.css";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import EmployeesFilters from "./EmployeesFilters";
import { observer } from 'mobx-react-lite';
import { usersStore } from "../../entities/users";

type EmployeeTableInfo = {
  id: string;
  name: string;
  role: string;
  status: keyof typeof WorkerStatuses;
  team: string;
  mail: string;
};

function EmployeesComponent() {
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    // загружаем список сотрудников при монтировании
    usersStore.loadFromApi();
  }, []);

  // конвертация usersStore.users в удобный для таблицы формат
  const sampleData: EmployeeTableInfo[] = usersStore.users.map(u => ({
    id: u.id,
    name: u.fio,
    role: u.role || '—',
    status: u.status as keyof typeof WorkerStatuses,
    team: u.team.join(' / '),
    mail: u.mail || ''
  }));

  const filteredData = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    const role = roleFilter.trim().toLowerCase();
    return sampleData.filter(e => (
      (!name || e.name.toLowerCase().includes(name)) &&
      (!role || e.role.toLowerCase().includes(role)) &&
      (!statusFilter || e.status === (statusFilter as keyof typeof WorkerStatuses))
    ));
  }, [nameFilter, roleFilter, statusFilter]);

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
        statuses={Object.keys(WorkerStatuses)}
      />

      <div className={"simple-border-card"} style={{marginTop: 16}}>

        <table className="employees-table">
          <thead className="employees-table-head">
          <tr>
            <th>Имя</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Команда</th>
            <th>Почта</th>
          </tr>
          </thead>
          <tbody>
          {filteredData.map(e => (
            <tr key={e.id} className={"employees-table-row"}>
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td><WorkerStatus status={e.status}/></td>
              <td>{e.team}</td>
              <td>{e.mail}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default observer(EmployeesComponent);
