import WorkerStatus from "../../shared/statuses/workerStatus";
import "./employees.css";

type Employee = {
  id: string;
  name: string;
  role: string;
  status: keyof typeof import('../../shared/statuses/workerStatuses').WorkerStatuses;
  team: string;
  mail: string;
};

const sampleData: Employee[] = [
  {id: '1', name: 'Иванов Иван', role: 'Разработчик', status: 'work', team: 'Team A', mail: 'ivanov@example.com'},
  {id: '2', name: 'Петров Петр', role: 'Тестировщик', status: 'work', team: 'Team B', mail: 'petrov@example.com'},
  {id: '3', name: 'Сидорова Анна', role: 'Дизайнер', status: 'work', team: 'Design', mail: 'sidorova@example.com'},
];

export default function Employees() {
  return (
    <main className={"main"}>
      <h2 className="employees-title">Все сотрудники</h2>
      <table className="employees-table">
        <thead>
        <tr>
          <th>Имя</th>
          <th>Роль</th>
          <th>Статус</th>
          <th>Команда</th>
          <th>Почта</th>
        </tr>
        </thead>
        <tbody>
        {sampleData.map(e => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.role}</td>
            <td><WorkerStatus status={e.status}/></td>
            <td>{e.team}</td>
            <td>{e.mail}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </main>
  )
}

