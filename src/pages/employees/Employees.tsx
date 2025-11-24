import React from "react";
import {observer} from 'mobx-react-lite';
import "./employees.css";
import EmployeesFilters from "./EmployeesFilters";
import {useEmployees} from "../../features/employees/hooks/useEmployees";
import EmployeesTable from "../../features/employees/ui/EmployeesTable";
import {userStore} from "../../entities/user";

function EmployeesComponent() {
  const { filters, options, add, newUserState, filteredData } = useEmployees();

  const {
    name: nameFilter,
    setName: setNameFilter,
    role: roleFilter,
    setRole: setRoleFilter,
    status: statusFilter,
    setStatus: setStatusFilter,
    department: departmentFilter,
    setDepartment: setDepartmentFilter,
  } = filters;

  const { statuses: statusOptions, roles: roleOptions, departments: departmentOptions } = options;

  const { addMode, startAdd, cancelAdd, saveNewUser, isSavingNew } = add;

  const { newUser, setNewUser } = newUserState;

  return (
    <main className={"main"}>
      <h2 className="employees-title">Все сотрудники</h2>

      <EmployeesFilters
        name={nameFilter}
        onNameChange={setNameFilter}
        role={roleFilter}
        onRoleChange={setRoleFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        statuses={statusOptions}
        roles={roleOptions}
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
        data={filteredData}
        addMode={addMode}
        newUser={newUser}
        setNewUser={setNewUser}
      />
    </main>
  )
}

export default observer(EmployeesComponent);
