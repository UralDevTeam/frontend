import React, {useEffect, useRef, useState} from "react";
import {observer} from 'mobx-react-lite';
import "./employees.css";
import EmployeesFilters from "./EmployeesFilters";
import {useEmployees} from "../../features/employees/hooks/useEmployees";
import EmployeesTable from "../../features/employees/ui/EmployeesTable";
import {userStore} from "../../entities/user";
import onUpdateAD from "../../shared/AD/updateAD";
import {deleteUser} from "../../entities/user/fetcher";
import {notificationsStore} from "../../features/notifications";

function EmployeesComponent() {
  const {
    filters,
    options,
    sortedData,
    sortConfig,
    handleSort,
    loading,
    error,
    reload,
    selectedIds,
    toggleSelect,
    clearSelection,
  } = useEmployees();

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

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteConfirmRef = useRef<HTMLDivElement | null>(null);

  const handleOpenDeleteConfirm = () => setIsDeleteConfirmOpen(true);

  const handleCloseDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const getEmployeesCountText = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return 'сотрудника';
    }

    return 'сотрудников';
  };


  const getEmployeeNamesByIds = (ids: string[]) =>
      ids.map((id) => sortedData.find((employee) => employee.id === id)?.name ?? id);

  const deleteEmployees = async (ids: string[]) => {
    const results = await Promise.allSettled(ids.map(id => deleteUser(id)));
    const failedIds = results.reduce<string[]>((acc, result, index) => {
      if (result.status === 'rejected') {
        acc.push(ids[index]);
      }
      return acc;
    }, []);

    if (failedIds.length) {
      const names = getEmployeeNamesByIds(failedIds).join(', ');
      notificationsStore.error(`Не удалось удалить сотрудника(ов): ${names}, потому что в дочерних командах еще есть сотрудники`);
    }

    await reload();
  };
  const handleConfirmDelete = async () => {
    await deleteEmployees(selectedIds);
    clearSelection();
    handleCloseDeleteConfirm();
  };

  useEffect(() => {
    if (selectedIds.length === 0) {
      handleCloseDeleteConfirm();
    }
  }, [selectedIds]);

  useEffect(() => {
    if (!isDeleteConfirmOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!deleteConfirmRef.current) {
        return;
      }

      if (!deleteConfirmRef.current.contains(event.target as Node)) {
        handleCloseDeleteConfirm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeleteConfirmOpen]);

  const renderState = () => {
    if (loading) {
      return <div className="employees-state">Загрузка сотрудников…</div>;
    }

    if (error) {
      return (
        <div className="employees-state employees-state--error">
          <p>Не удалось загрузить список сотрудников.</p>
          <p className="employees-state__details">{error}</p>
          <button className="employees-retry-button" onClick={reload}>
            Попробовать снова
          </button>
        </div>
      );
    }

    if (!sortedData.length) {
      const hasQuery = fullTextFilter.trim().length > 0;
      return (
        <div className="employees-state">
          {hasQuery
            ? 'По вашему запросу ничего не найдено. Измените параметры поиска и попробуйте снова.'
            : 'Нет сотрудников, соответствующих выбранным фильтрам.'}
        </div>
      );
    }

    return (
      <EmployeesTable
        data={sortedData}
        adminMode={!!adminMode}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />
    );
  };

  return (
    <>
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
                onClick={handleOpenDeleteConfirm}
                title="Удалить выбранных"
              >
                <img src="/icons/TrashCan.svg" alt="TrashCan icon"/>
              </button>
            )}

            {isDeleteConfirmOpen && (
                <div className="delete-confirm" ref={deleteConfirmRef}>
                  <p className="delete-confirm__text">
                    Вы хотите сейчас удалить {selectedIds.length} {getEmployeesCountText(selectedIds.length)}?
                  </p>
                  <div className="delete-confirm__actions">
                    <button type="button" className="delete-confirm__button" onClick={handleConfirmDelete}>
                      да
                    </button>
                    <button
                        type="button"
                        className="delete-confirm__button delete-confirm__button--secondary"
                        onClick={handleCloseDeleteConfirm}
                    >
                      нет
                    </button>
                  </div>
                </div>
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

      {renderState()}
    </>
  )
}

export default observer(EmployeesComponent);
