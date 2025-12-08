import React from "react";
import {observer} from 'mobx-react-lite';
import "./employees.css";
import EmployeesFilters from "./EmployeesFilters";
import {useEmployees} from "../../features/employees/hooks/useEmployees";
import EmployeesTable from "../../features/employees/ui/EmployeesTable";
import {userStore} from "../../entities/user";

function EmployeesComponent() {
    const {filters, options, add, newUserState, sortedData, sortConfig, handleSort} = useEmployees();

    const {
        name: nameFilter,
        setName: setNameFilter,
        position: positionFilter,
        setPosition: setPositionFilter,
        status: statusFilter,
        setStatus: setStatusFilter,
        department: departmentFilter,
        setDepartment: setDepartmentFilter,
        onlyAdmin,
        onOnlyAdminChange,

    } = filters;

    const {statuses: statusOptions, positions: positionOptions, departments: departmentOptions} = options;

    const {addMode, startAdd, cancelAdd, saveNewUser, isSavingNew} = add;

    const {newUser, setNewUser} = newUserState;

    return (
        <main className={"main"}>
            <h2 className="employees-title">Все сотрудники</h2>

            <EmployeesFilters
                onlyAdmin={onlyAdmin}
                onOnlyAdminChange={onOnlyAdminChange}
                name={nameFilter}
                onNameChange={setNameFilter}
                position={positionFilter}
                onPositionChange={setPositionFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                statuses={statusOptions}
                positions={positionOptions}
                department={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                departments={departmentOptions}
                showAddModeButton={userStore.user?.isAdmin}
                addMode={addMode}
                onStartAdd={startAdd}
                onSaveAdd={saveNewUser}
                onCancelAdd={cancelAdd}
                isSavingAdd={isSavingNew}
            />

            <EmployeesTable
                data={sortedData}
                addMode={addMode}
                newUser={newUser}
                setNewUser={setNewUser}
                sortConfig={sortConfig}
                onSort={handleSort}
            />
        </main>
    )
}

export default observer(EmployeesComponent);
