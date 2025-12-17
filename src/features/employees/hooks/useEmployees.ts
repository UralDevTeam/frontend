import { useEffect, useMemo, useState } from "react";
import { usersStore } from "../../../entities/users";
import { WorkerStatuses } from "../../../shared/statuses/workerStatuses";

const safeTeam = (t: unknown): string[] =>
    Array.isArray(t) ? t.map(String).map((s) => s.trim()).filter(Boolean) : [];

const teamPart = (team: string[], idx: number) => team[idx] ?? "";

const teamGroup = (team: string[]) => team.slice(3).join(" / ");

export type EmployeeTableInfo = {
  id: string;
  isAdmin: boolean;
  name: string;
  position: string;
  status: keyof typeof WorkerStatuses;
  mail?: string;

  domain: string;
  legalEntity: string;
  department: string;
  group: string;

  team: string[];
};

export interface SortConfig {
  key: keyof EmployeeTableInfo;
  direction: 'asc' | 'desc';
}

export function useEmployees() {
  const [onlyAdminFilter, setOnlyAdminFilter] = useState(false);
  const [fullTextFilter, setFullTextFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!usersStore.users || usersStore.users.length === 0) {
      usersStore.loadFromApi();
    }
  }, []);

  const sourceUsers = useMemo(() => {
    if (!fullTextFilter) return usersStore.users;
    return usersStore.fullTextSearch(fullTextFilter);
  }, [fullTextFilter, usersStore.users]);

  const tableData: EmployeeTableInfo[] = useMemo(() => {
    return sourceUsers.map((u) => {
      const team = safeTeam((u as any).team);

      return {
        id: u.id,
        isAdmin: u.isAdmin,
        name: u.fio,
        position: u.position || "—",
        status: u.status as keyof typeof WorkerStatuses,
        mail: (u as any).mail || (u as any).email || "",

        domain: teamPart(team, 0) || "—",
        legalEntity: teamPart(team, 1) || "—",
        department: teamPart(team, 2) || "—",
        group: teamGroup(team) || "—",

        team,
      };
    });
  }, [sourceUsers]);

  const statusOptions: Array<keyof typeof WorkerStatuses> = useMemo(
      () =>
          Array.from(new Set(tableData.map((t) => t.status))).filter(Boolean) as Array<
              keyof typeof WorkerStatuses
          >,
      [tableData]
  );

  const positionOptions: string[] = useMemo(
      () =>
          Array.from(new Set(tableData.map((t) => t.position)))
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b)),
      [tableData]
  );

  const departmentOptions: string[] = useMemo(
      () =>
          Array.from(new Set(tableData.map((t) => t.department)))
              .filter((d) => d && d !== "—")
              .sort((a, b) => a.localeCompare(b)),
      [tableData]
  );

  const handleSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      setSortConfig(null);
      return;
    }

    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = useMemo(() => {
    const position = positionFilter.trim();
    const dept = departmentFilter.trim();

    let result = tableData.filter((e) => {
      return ((!onlyAdminFilter || e.isAdmin) && (!position || e.position === position) && (!statusFilter || e.status === (statusFilter as keyof typeof WorkerStatuses)) && (!dept || e.department.toLowerCase() === dept.toLowerCase()));
    });

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortConfig.direction === "asc"
              ? Number(aValue) - Number(bValue)
              : Number(bValue) - Number(aValue);
        }

        const as = String(aValue ?? "");
        const bs = String(bValue ?? "");

        return sortConfig.direction === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
      });
    }

    return result;
  }, [onlyAdminFilter, fullTextFilter, positionFilter, statusFilter, departmentFilter, tableData, sortConfig]);

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const exists = prev.includes(id);
      if (checked && !exists) return [...prev, id];
      if (!checked && exists) return prev.filter(x => x !== id);
      return prev;
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const filters = {
    onlyAdmin: onlyAdminFilter,
    onOnlyAdminChange: setOnlyAdminFilter,
    fullText: fullTextFilter,
    setFullText: setFullTextFilter,
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

  return {
    fullTextFilter,
    setFullTextFilter,
    positionFilter,
    setPositionFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,

    tableData,
    statusOptions,
    positionOptions,
    departmentOptions,

    sortedData: sortedAndFilteredData,
    sortConfig,
    handleSort,

    selectedIds,
    toggleSelect,
    clearSelection,

    filters,
    options,
  } as const;
}
