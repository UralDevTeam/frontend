import React from "react";
import {observer} from 'mobx-react-lite';
import "./employees.css";
import EmployeesFilters from "./EmployeesFilters";
import {useEmployees} from "../../features/employees/hooks/useEmployees";
import EmployeesTable from "../../features/employees/ui/EmployeesTable";
import {userStore} from "../../entities/user";
import onUpdateAD from "../../shared/AD/updateAD" ;

function EmployeesComponent() {
  const {filters, options, add, newUserState, sortedData, sortConfig, handleSort} = useEmployees();

  const {
    fullText: fullTextFilter,
    setFullText: setFullTextFilter,
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
        adminMode={userStore.user?.isAdmin}
        addMode={addMode}
        onStartAdd={startAdd}
        onSaveAdd={saveNewUser}
        onCancelAdd={cancelAdd}
        isSavingAdd={isSavingNew}
        onUpdateAD={onUpdateAD}
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
