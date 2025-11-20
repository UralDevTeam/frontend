import { useEffect, useMemo, useState } from 'react';
import { usersStore } from '../../../entities/users';
import { WorkerStatuses } from '../../../shared/statuses/workerStatuses';

export type EmployeeTableInfo = {
  id: string;
  isAdmin: boolean;
  name: string;
  role: string;
  status: keyof typeof WorkerStatuses;
  department?: string;
  legalEntity?: string;
  mail?: string;
  team?: string;
};

export function useEmployees() {
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    if (!usersStore.users || usersStore.users.length === 0) {
      usersStore.loadFromApi();
    }
  }, []);

  const sourceUsers = usersStore.users;

  const tableData: EmployeeTableInfo[] = useMemo(() => sourceUsers.map(u => ({
    id: u.id,
    isAdmin: u.isAdmin,
    name: u.fio,
    role: u.role || '—',
    status: u.status as keyof typeof WorkerStatuses,
    department: u.department || ((u as any).team ? ((u as any).team as string[]).join(' / ') : undefined),
    legalEntity: u.legalEntity || u.legalEntity,
    mail: (u as any).mail || (u as any).email || '',
    team: (u as any).team ? ((u as any).team as string[]).join(' / ') : undefined,
  })), [sourceUsers]);

  const statusOptions: Array<keyof typeof WorkerStatuses> = useMemo(() =>
    Array.from(new Set(tableData.map(t => t.status))).filter(Boolean) as Array<keyof typeof WorkerStatuses>
  , [tableData]);

  const roleOptions: string[] = useMemo(() => Array.from(new Set(tableData.map(t => t.role))).filter(Boolean).sort((a, b) => a.localeCompare(b)), [tableData]);

  const departmentOptions: string[] = useMemo(() => Array.from(new Set(tableData.map(t => t.department || ''))).filter(d => d).sort((a, b) => a.localeCompare(b)), [tableData]);

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

  return {
    // filters
    nameFilter,
    setNameFilter,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    // data
    tableData,
    filteredData,
    statusOptions,
    roleOptions,
    departmentOptions,
  } as const;
}

