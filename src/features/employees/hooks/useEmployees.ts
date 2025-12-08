import {useEffect, useMemo, useState} from 'react';
import {createUser, usersStore} from '../../../entities/users';
import {WorkerStatuses} from '../../../shared/statuses/workerStatuses';

export type EmployeeTableInfo = {
    id: string;
    isAdmin: boolean;
    name: string;
    position: string;
    status: keyof typeof WorkerStatuses;
    department?: string;
    legalEntity?: string;
    mail?: string;
    team?: string;
};

export interface SortConfig {
    key: keyof EmployeeTableInfo;
    direction: 'asc' | 'desc';
}

export function useEmployees() {
    const [onlyAdminFilter, setOnlyAdminFilter] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [addMode, setAddMode] = useState(false);
    const [isSavingNew, setIsSavingNew] = useState(false);
    const [newUser, setNewUser] = useState<Partial<EmployeeTableInfo & { email?: string, phone?: string }>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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
        position: u.position || '—',
        status: u.status as keyof typeof WorkerStatuses,
        department: u.department || ((u as any).team ? ((u as any).team as string[]).join(' / ') : undefined),
        legalEntity: u.legalEntity || u.legalEntity,
        mail: (u as any).mail || (u as any).email || '',
        team: (u as any).team ? ((u as any).team as string[]).join(' / ') : undefined,
    })), [sourceUsers]);

    const statusOptions: Array<keyof typeof WorkerStatuses> = useMemo(() =>
            Array.from(new Set(tableData.map(t => t.status))).filter(Boolean) as Array<keyof typeof WorkerStatuses>
        , [tableData]);

    const positionOptions: string[] = useMemo(() => Array.from(new Set(tableData.map(t =>
        t.position))).filter(Boolean).sort((a, b) => a.localeCompare(b)), [tableData]);

    const departmentOptions: string[] = useMemo(() =>
            Array.from(new Set(tableData.map(t => t.department || ''))).filter(d => d).sort((a, b) => a.localeCompare(b)),
        [tableData]
    );

    const handleSort = (key: SortConfig['key']) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            setSortConfig(null);
            return;
        }

        setSortConfig({key, direction});
    };

    const sortedAndFilteredData = useMemo(() => {
        const name = nameFilter.trim().toLowerCase();
        const position = positionFilter.trim();
        const dept = departmentFilter.trim();

        let result = tableData.filter(e => (
            (!onlyAdminFilter || e.isAdmin === onlyAdminFilter) &&
            (!name || e.name.toLowerCase().includes(name)) &&
            (!position || e.position === position) &&
            (!statusFilter || e.status === (statusFilter as keyof typeof WorkerStatuses)) &&
            (!dept || (e.department || '').toLowerCase() === dept.toLowerCase())
        ));

        console.log(result);
        if (sortConfig) {
            result.sort((a: EmployeeTableInfo, b: EmployeeTableInfo) => {
                const aValue: string | boolean | undefined = a[sortConfig.key];
                const bValue: string | boolean | undefined = b[sortConfig.key];

                // Проверяем на null/undefined
                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    if (sortConfig.direction === 'asc') {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                }
                return 0;
            })
        }
        return result;

    }, [onlyAdminFilter, nameFilter, positionFilter, statusFilter, departmentFilter, tableData, sortConfig]);

    const startAdd = () => {
        setNewUser({name: '', position: '', status: WorkerStatuses.active, department: '', mail: ''});
        setAddMode(true);
    };

    const cancelAdd = () => {
        setAddMode(false);
        setNewUser({});
    };

    const saveNewUser = async () => {
        setIsSavingNew(true);
        try {
            const payload: any = {
                fio: newUser.name ?? '',
                position: newUser.position ?? '',
                status: newUser.status ?? WorkerStatuses.active,
                department: newUser.department ?? '',
                email: newUser.email ?? '',
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
        onlyAdmin: onlyAdminFilter,
        onOnlyAdminChange: setOnlyAdminFilter,
        name: nameFilter,
        setName: setNameFilter,
        position: positionFilter,
        setPosition: setPositionFilter,
        status: statusFilter,
        setStatus: setStatusFilter,
        department: departmentFilter,
        setDepartment: setDepartmentFilter,
    } as const;

    const options = {
        statuses: statusOptions,
        positions: positionOptions,
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
        positionFilter,
        setPositionFilter,
        statusFilter,
        setStatusFilter,
        departmentFilter,
        setDepartmentFilter,
        // data
        tableData,
        statusOptions,
        positionOptions,
        departmentOptions,
        // add user
        addMode,
        startAdd,
        cancelAdd,
        newUser,
        setNewUser,
        saveNewUser,
        isSavingNew,
        // sorting
        sortedData: sortedAndFilteredData,
        sortConfig,
        handleSort,

        // сгруппированные объекты
        filters,
        options,
        add,
        newUserState,
    } as const;
}
