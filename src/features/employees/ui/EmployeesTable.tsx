import React from 'react';
import {Link} from 'react-router';
import ProfileCircle from '../../../shared/profileCircle/profileCircle';
import WorkerStatus from '../../../shared/statuses/workerStatus';
import {EmployeeTableInfo, SortConfig} from '../hooks/useEmployees';

type Props = {
  data: EmployeeTableInfo[];
  addMode?: boolean;
  newUser?: Partial<EmployeeTableInfo & { mail?: string }>;
  setNewUser?: (user: Partial<EmployeeTableInfo & { mail?: string }>) => void;
  sortConfig?: SortConfig | null;
  onSort?: (key: SortConfig['key']) => void;
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
      placeholder: 'имя'
    },
    {
      field: 'position' as const,
      type: 'text',
      placeholder: 'роль'
    },
    {
      field: 'status' as const,
      type: 'select',
      placeholder: 'статус'
    },
    {
      field: 'department' as const,
      type: 'text',
      placeholder: 'подразделение'
    },
    {
      field: 'legalEntity' as const,
      type: 'text',
      placeholder: 'юр. лицо'
    },
    {
      field: 'mail' as const,
      type: 'email',
      placeholder: 'почта'
    }
  ];

  return (
    <tr className="employees-table-row add-row">
      <td></td>
      {/*isAdmin column*/}
      {inputFields.map(({field, type, placeholder}) => {
        if (type === 'select') {
          return (
            <td key={field}>
              <WorkerStatus status={"active"}/>
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
        <img style={{display: employee.isAdmin ? "block" : "none"}}
             src={"/icons/Star.svg"} width={20} height={20} alt={"is admin"}
        />
      </td>
      <td>
        <Link to={`/profile/view/${employee.id}`} className="employees-table-link">
          <div className="employees-profile">
              <ProfileCircle size={32} toSelf={false} isAdmin={employee.isAdmin} userId={employee.id} variant={"small"}/>
              <span>{getDisplayName(employee.name)}</span>
          </div>
        </Link>
      </td>
      <td>{employee.position}</td>
      <td>
        <WorkerStatus status={employee.status}/>
      </td>
      <td>{getDepartmentDisplay(employee)}</td>
      <td>{getLegalEntityDisplay(employee)}</td>
      <td>{employee.mail}</td>
    </tr>
  );
};

const TableHeader = ({sortConfig, onSort}: {
  sortConfig?: SortConfig | null;
  onSort?: (key: SortConfig['key']) => void;
}) => {
  const getSortIcon = (key: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <img src={"icons/column-sorting.svg"}/>;
    }
    if (sortConfig.direction === 'asc') {
      return <img src={"icons/column-sorting-down.svg"}/>
    }
    return <img src={"icons/column-sorting-up.svg"}/>
  };
  return (
    <thead className="employees-table-head">
    <tr>
      <th></th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("name")}>
        <div><p>Имя</p> {getSortIcon("name")}</div>
      </th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("position")}>
        <div><p>Роль</p> {getSortIcon("position")}</div>
      </th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("status")}>
        <div><p>Статус</p> {getSortIcon("status")}</div>
      </th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("department")}>
        <div><p>Подразделение</p> {getSortIcon("department")}</div>
      </th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("legalEntity")}>
        <div><p>Юр. лицо</p> {getSortIcon("legalEntity")}</div>
      </th>
      <th className={"employees-table-head__column_label"} onClick={() => onSort && onSort("mail")}>
        <div><p>Почта</p> {getSortIcon("mail")}</div>
      </th>
    </tr>
    </thead>
  );
};

export default function EmployeesTable(
  {
    data,
    addMode = false,
    newUser = {},
    setNewUser,
    sortConfig,
    onSort
  }: Props) {
  return (
    <div className="" style={{marginTop: 16}}>
      <table className="employees-table">
        <TableHeader sortConfig={sortConfig} onSort={onSort}/>
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
