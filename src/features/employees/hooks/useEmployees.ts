import { useEffect, useMemo, useState } from 'react';
import { usersStore, createUser } from '../../../entities/users';
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
  const [addMode, setAddMode] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newUser, setNewUser] = useState<Partial<EmployeeTableInfo & {email?: string, phone?: string}>>({});

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

  const startAdd = () => {
    setNewUser({ name: '', role: '', status: WorkerStatuses.active, department: '', mail: '' });
    setAddMode(true);
  };

  const cancelAdd = () => {
    setAddMode(false);
    setNewUser({});
  };

  const saveNewUser = async () => {
    setIsSavingNew(true);
    try {
      // Map newUser to backend UserDTO partial
      const payload: any = {
        fio: newUser.name ?? '',
        role: newUser.role ?? '',
        status: newUser.status ?? WorkerStatuses.active,
        city: newUser.department ?? '',
        email: (newUser as any).mail ?? '',
      };

      await createUser(payload);
      await usersStore.loadFromApi();
      setAddMode(false);
      setNewUser({});
    } catch (e) {
      console.error('Failed to create user', e);
      throw e;
    } finally {
      setIsSavingNew(false);
    }
  };

  // сгруппированные объекты для удобного экспорта
  const filters = {
    name: nameFilter,
    setName: setNameFilter,
    role: roleFilter,
    setRole: setRoleFilter,
    status: statusFilter,
    setStatus: setStatusFilter,
    department: departmentFilter,
    setDepartment: setDepartmentFilter,
  } as const;

  const options = {
    statuses: statusOptions,
    roles: roleOptions,
    departments: departmentOptions,
  } as const;

  const add = {
    addMode,
    startAdd,
    cancelAdd,
    saveNewUser,
    isSavingNew,
  } as const;

  const newUserState = {
    newUser,
    setNewUser,
  } as const;

  return {
    // старые поля для обратной совместимости
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
    // add user
    addMode,
    startAdd,
    cancelAdd,
    newUser,
    setNewUser,
    saveNewUser,
    isSavingNew,

    // сгруппированные объекты
    filters,
    options,
    add,
    newUserState,
  } as const;
}
