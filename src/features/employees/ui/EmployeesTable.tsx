import React from 'react';
import { Link } from 'react-router';
import ProfileCircle from '../../../shared/profileCircle/profileCircle';
import WorkerStatus from '../../../shared/statuses/workerStatus';
import { EmployeeTableInfo } from '../hooks/useEmployees';

type Props = {
  data: EmployeeTableInfo[];
};

export default function EmployeesTable({ data }: Props) {
  return (
    <div className={"simple-border-card"} style={{ marginTop: 16 }}>
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
          {data.map(e => {
            const parts = e.name.split(' ');
            const displayName = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : e.name;
            return (
              <tr key={e.id} className={"employees-table-row"}>
                <td>
                  <Link to={`/profile/view/${e.id}`} className="employees-table-link">
                    <div className="employees-profile">
                      <ProfileCircle size={32} toSelf={false} isAdmin={e.isAdmin} />
                      <span>{displayName}</span>
                    </div>
                  </Link>
                </td>
                <td>{e.role}</td>
                <td><WorkerStatus status={e.status} /></td>
                <td>{e.department || e.team || '—'}</td>
                <td>{e.legalEntity || '—'}</td>
                <td>{e.mail}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

