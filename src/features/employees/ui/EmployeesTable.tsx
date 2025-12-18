import React from 'react';
import {Link} from 'react-router';
import ProfileCircle from '../../../shared/profileCircle/profileCircle';
import WorkerStatus from '../../../shared/statuses/workerStatus';
import {EmployeeTableInfo, SortConfig} from '../hooks/useEmployees';
import {parseTeam} from '../../../entities/user/lib/teamParts';

type Props = {
    data: EmployeeTableInfo[];
    adminMode?: boolean;
    addMode?: boolean;
    newUser?: Partial<EmployeeTableInfo & { mail?: string }>;
    setNewUser?: (user: Partial<EmployeeTableInfo & { mail?: string }>) => void;
    sortConfig?: SortConfig | null;
    onSort?: (key: SortConfig['key']) => void;
    selectedIds?: string[];
    onToggleSelect?: (id: string, checked: boolean) => void;
};

type EmployeeRowProps = {
    employee: EmployeeTableInfo;
    adminMode: boolean;
    selected?: boolean;
    onToggleSelect?: (id: string, checked: boolean) => void;
};

const EmployeeRow: React.FC<EmployeeRowProps> = ({employee, adminMode, selected = false, onToggleSelect}) => {
    const parts = parseTeam(employee.team);
    const getDisplayName = (fullName: string): string => {
        const parts = fullName.split(' ');
        return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : fullName;
    };

    return (
        <tr key={employee.id} className="employees-table-row">
            <td>
                {adminMode ? (
                    <input
                        type="checkbox"
                        aria-label="select admin"
                        checked={selected}
                        onChange={(e) => onToggleSelect && onToggleSelect(employee.id, e.target.checked)}
                    />
                ) : (
                    <img style={{display: employee.isAdmin ? "block" : "none"}}
                         src={"/icons/Star.svg"} width={20} height={20} alt={"is admin"}
                    />
                )}
            </td>
            <td>
                <Link to={`/profile/view/${employee.id}`} className="employees-table-link">
                    <div className="employees-profile">
                        <ProfileCircle size={32} toSelf={false} isAdmin={employee.isAdmin} userId={employee.id}
                                       variant={"small"}/>
                        <span>{getDisplayName(employee.name)}</span>
                    </div>
                </Link>
            </td>
            <td>{employee.position}</td>
            <td>
                <WorkerStatus status={employee.status}/>
            </td>
            <td>{parts.department || '—'}</td>
            <td>{parts.legalEntity || '—'}</td>
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
            return <img src={"icons/column-sorting.svg"} alt={'column-sorting-icon'}/>;
        }
        if (sortConfig.direction === 'asc') {
            return <img src={"icons/column-sorting-down.svg"} alt={'column-sorting-down-icon'}/>
        }
        return <img src={"icons/column-sorting-up.svg"} alt={'column-sorting-up-icon'}/>
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
                <div><p>Отдел</p> {getSortIcon("department")}</div>
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

export default function EmployeesTable({
                                           data,
                                           adminMode = false,
                                           sortConfig,
                                           onSort,
                                           selectedIds = [],
                                           onToggleSelect,
                                       }: Props) {
    return (
        <div className="" style={{marginTop: 16}}>
            <table className="employees-table">
                <TableHeader sortConfig={sortConfig} onSort={onSort}/>
                <tbody>
                {data.map((employee) => (
                    <EmployeeRow
                        key={employee.id}
                        employee={employee}
                        adminMode={adminMode}
                        selected={selectedIds.includes(employee.id)}
                        onToggleSelect={onToggleSelect}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
