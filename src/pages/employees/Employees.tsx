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

  const adminMode = userStore.user?.isAdmin;

  return (
    <main className={"main"}>
      <div className="employees-header">
        <h2 className="employees-title">Все сотрудники</h2>

        {adminMode && (
          <div className="admin-controls">
            <button className="AD-sync-button" onClick={onUpdateAD}>
              AD выгрузка <img src="/icons/dowland.svg" alt="dowland icon"/>
            </button>
            {!addMode && (
              <button className="edit-mode-button" onClick={startAdd} title="Добавить пользователя">
                <img src="/icons/PlusInCircle.svg" alt="PlusInCircle icon"/>
              </button>
            )}
            {addMode && (
              <>
                <button className="edit-mode-button" onClick={saveNewUser} disabled={isSavingNew}>
                  сохранить
                </button>
                <button className="undo-edit-button" onClick={cancelAdd} disabled={isSavingNew}>
                  отменить
                </button>
              </>
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