import React, {useMemo, useState} from "react";
import WorkerStatus from "../../shared/statuses/workerStatus";
import "./employees.css";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import EmployeesFilters from "./EmployeesFilters";

type EmployeeTableInfo = {
  id: string;
  name: string;
  role: string;
  status: keyof typeof WorkerStatuses;
  team: string;
  mail: string;
};

function generateSampleData(count: number = 3): EmployeeTableInfo[] {
  const firstNames = ['Иван', 'Пётр', 'Анна', 'Ольга', 'Сергей', 'Мария'];
  const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецова', 'Смирнов', 'Ковалёв'];
  const roles = ['Разработчик', 'Тестировщик', 'Дизайнер', 'Менеджер', 'Аналитик'];
  const teams = ['Team A', 'Team B', 'Design', 'Platform', 'Mobile'];
  const statuses = Object.keys(WorkerStatuses) as Array<keyof typeof WorkerStatuses>;

  const result: EmployeeTableInfo[] = [];
  for (let i = 0; i < count; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[(i * 3) % lastNames.length];
    const name = `${last} ${first}`;
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];
    const team = teams[i % teams.length];
    const mail = `${first.toLowerCase()}.${last.toLowerCase().replace(/ё/g, 'e')}@example.com`;
    result.push({ id: String(i + 1), name, role, status, team, mail });
  }
  return result;
}

const sampleData: EmployeeTableInfo[] = generateSampleData(100);

export default function Employees() {
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

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
