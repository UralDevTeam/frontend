import React from "react";
import {observer} from 'mobx-react-lite';
import "./employees.css";
import EmployeesFilters from "./EmployeesFilters";
import {useEmployees} from "../../features/employees/hooks/useEmployees";
import EmployeesTable from "../../features/employees/ui/EmployeesTable";
import {userStore} from "../../entities/user";
import onUpdateAD from "../../shared/AD/updateAD" ;

function EmployeesComponent() {
    const {filters, options, sortedData, sortConfig, handleSort, selectedIds, toggleSelect, clearSelection} = useEmployees();

    const {
        onlyAdmin,
        onOnlyAdminChange,
        fullText: fullTextFilter,
        setFullText: setFullTextFilter,
        position: positionFilter,
        setPosition: setPositionFilter,
        status: statusFilter,
        setStatus: setStatusFilter,
        department: departmentFilter,
        setDepartment: setDepartmentFilter,
    } = filters;

    const {statuses: statusOptions, positions: positionOptions, departments: departmentOptions} = options;

    const adminMode = userStore.user?.isAdmin;

    const resetFilters = () => {
        onOnlyAdminChange(false);
        setFullTextFilter('');
        setPositionFilter('');
        setStatusFilter('');
        setDepartmentFilter('');
    };

    return (
        <main className={"main"}>
            <div className="employees-header">
                <h2 className="employees-title">Все сотрудники</h2>

                {adminMode && (
                    <div className="admin-controls">
                        <button className="AD-sync-button" onClick={onUpdateAD}>
                            AD выгрузка <img src="/icons/dowland.svg" alt="dowland icon"/>
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                className="delete-users-button"
                                onClick={() => {
                                    console.log('Удаление выбранных сотрудников:', selectedIds);
                                    clearSelection();
                                }}
                                title="Удалить выбранных"
                            >
                                <img src="/icons/TrashCan.svg" alt="TrashCan icon"/>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <EmployeesFilters
                onlyAdmin={onlyAdmin}
                onOnlyAdminChange={onOnlyAdminChange}
                fullText={fullTextFilter}
                fullTextChange={setFullTextFilter}
                position={positionFilter}
                onPositionChange={setPositionFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                statuses={statusOptions}
                positions={positionOptions}
                department={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                departments={departmentOptions}
                onResetFilters={resetFilters}
            />

            <EmployeesTable
                data={sortedData}
                sortConfig={sortConfig}
                onSort={handleSort}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
            />
        </main>
    )
}

export default observer(EmployeesComponent);
