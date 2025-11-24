import React from 'react';
import {Link} from 'react-router';
import ProfileCircle from '../../../shared/profileCircle/profileCircle';
import WorkerStatus from '../../../shared/statuses/workerStatus';
import {EmployeeTableInfo} from '../hooks/useEmployees';
import {WorkerStatusSelector} from "../../../shared/statuses/workerStatusSelectorRowInfo";

type Props = {
  data: EmployeeTableInfo[];
  addMode?: boolean;
  newUser?: Partial<EmployeeTableInfo & { mail?: string }>;
  setNewUser?: (user: Partial<EmployeeTableInfo & { mail?: string }>) => void;
};

type NewUserInputProps = {
  newUser: Partial<EmployeeTableInfo & { mail?: string }>;
  setNewUser: (user: Partial<EmployeeTableInfo & { mail?: string }>) => void;
};


const NewUserInputRow: React.FC<NewUserInputProps> = ({newUser, setNewUser}) => {
  const handleInputChange = (field: keyof typeof newUser, value: string) => {
    setNewUser({...newUser, [field]: value});
  };

  const inputFields = [
    {
      field: 'name' as const,
      type: 'text',
      placeholder: 'Имя'
    },
    {
      field: 'role' as const,
      type: 'text',
      placeholder: 'Роль'
    },
    {
      field: 'status' as const,
      type: 'select',
      placeholder: 'Статус'
    },
    {
      field: 'department' as const,
      type: 'text',
      placeholder: 'Подразделение'
    },
    {
      field: 'legalEntity' as const,
      type: 'text',
      placeholder: 'Юр. лицо'
    },
    {
      field: 'mail' as const,
      type: 'email',
      placeholder: 'Почта'
    }
  ];

  return (
    <tr className="employees-table-row add-row">
      {inputFields.map(({field, type, placeholder}) => {
        if (type === 'select') {
          return (
            <td key={field}>
              <WorkerStatusSelector
                onChange={(status) => handleInputChange('status', status)}
                status={newUser['status'] ?? "active"}
              />
            </td>
          );
        }

        return (
          <td key={field}>
            <input
              type={type}
              value={newUser[field] ?? ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={placeholder}
              className="employees-table-input"
            />
          </td>
        );
      })}
    </tr>
  );
};

type EmployeeRowProps = {
  employee: EmployeeTableInfo;
};

const EmployeeRow: React.FC<EmployeeRowProps> = ({employee}) => {
  const getDisplayName = (fullName: string): string => {
    const parts = fullName.split(' ');
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : fullName;
  };

  const getDepartmentDisplay = (employee: EmployeeTableInfo): string => {
    return employee.department || employee.team || '—';
  };

  const getLegalEntityDisplay = (employee: EmployeeTableInfo): string => {
    return employee.legalEntity || '—';
  };

  return (
    <tr key={employee.id} className="employees-table-row">
      <td>
        <Link to={`/profile/view/${employee.id}`} className="employees-table-link">
          <div className="employees-profile">
            <ProfileCircle size={32} toSelf={false} isAdmin={employee.isAdmin}/>
            <span>{getDisplayName(employee.name)}</span>
          </div>
        </Link>
      </td>
      <td>{employee.role}</td>
      <td>
        <WorkerStatus status={employee.status}/>
      </td>
      <td>{getDepartmentDisplay(employee)}</td>
      <td>{getLegalEntityDisplay(employee)}</td>
      <td>{employee.mail}</td>
    </tr>
  );
};

const TableHeader: React.FC = () => (
  <thead className="employees-table-head">
  <tr>
    <th>Имя</th>
    <th>Роль</th>
    <th>Статус</th>
    <th>Подразделение</th>
    <th>Юр. лицо</th>
    <th>Почта</th>
  </tr>
  </thead>
);

export default function EmployeesTable(
  {
    data,
    addMode = false,
    newUser = {},
    setNewUser
  }: Props) {
  return (
    <div className="simple-border-card" style={{marginTop: 16}}>
      <table className="employees-table">
        <TableHeader/>
        <tbody>
        {addMode && setNewUser && (
          <NewUserInputRow newUser={newUser} setNewUser={setNewUser}/>
        )}
        {data.map((employee) => (
          <EmployeeRow key={employee.id} employee={employee}/>
        ))}
        </tbody>
      </table>
    </div>
  );
}