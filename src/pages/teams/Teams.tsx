import React, {useEffect, useState} from "react";
import "./teams.css";
import {UDV_ROOT_ID, useTeams} from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "../../features/teams/components/UserLine";
import {useDebounce} from "../../shared/helper/debounce";
import {usersStore} from "../../entities/users";
import AddTeamRow from "../../features/teams/components/AddTeamRow";
import {DraggableUserWrapper} from "../../features/teams/components/DraggableUserWrapper";
import {DroppableFolderWrapper} from "../../features/teams/components/DroppableFolderWrapper";
import {userStore} from "../../entities/user";
import onUpdateAD from "../../shared/AD/updateAD";
import {notificationsStore} from "../../features/notifications";

export default function Teams() {
  const {
    loading,
    error,
    flatList,
    aggregates,
    expanded,
    toggle,
    isVisible,
    setSearchTerm,
    matchedIds,
    getNodesAtDepthFromFlat,
    createFolder,
    moveUser,
    nodesById,
    reload
  } = useTeams();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [addMode, setAddMode] = useState(false);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    userId?: string;
    userName?: string;
    userRole?: string;
  }>({isDragging: false});

  const onStartAdd = () => {
    setAddMode(true);
  };

  const onCancelAdd = () => {
    setAddMode(false);
  };
  const onFinishEnd = onCancelAdd;

  useEffect(() => {
    if (!usersStore.users || usersStore.users.length === 0) {
      usersStore.loadFromApi();
    }
    const notificationsIds = [
      notificationsStore.info("Для изменения оргструктуры используйте перетаскивание сотрудников в папки."),
      notificationsStore.info("Папка удалиться сама только если в ней нет сотрудников и вложенных папок.")
    ];

    return () => {
      notificationsIds.forEach(id => notificationsStore.removeNotification(id));
    }
  }, []);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const handleUserDragStart = (userId: string, userName: string, userRole?: string) => {
    setDragState({
      isDragging: true,
      userId,
      userName,
      userRole
    });
  };

  const handleUserDragEnd = () => {
    setDragState({isDragging: false});
  };

  const handleFolderDrop = (folderId: string, folderName: string) => {
    if (dragState.userId && dragState.userId !== folderId) {
      const folder = nodesById.get(folderId);
      if (folder) {
        if (window.confirm(`Переместить ${dragState.userName} в папку "${folderName}"?`)) {
          moveUser(dragState.userId, folder);
          console.log(`Пользователь ${dragState.userName} перемещен в ${folderName}`);
        }
      }
    }
  };

  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const hasMatches = Object.keys(matchedIds).length > 0;
  const hasStructure = flatList.some(
    (item) => item.type === "user" || (item.type === "folder" && item.id !== UDV_ROOT_ID)
  );

  const renderContent = () => {
    if (loading) {
      return <div className="teams-state">Загрузка оргструктуры…</div>;
    }

    if (error) {
      return (
        <div className="teams-state teams-state--error">
          <p>Не удалось загрузить оргструктуру.</p>
          <p className="teams-state__details">{error}</p>
          <button className="teams-retry-button" onClick={reload}>
            Попробовать снова
          </button>
        </div>
      );
    }

    if (hasSearchTerm && !hasMatches) {
      return (
        <div className="teams-state">
          По вашему запросу ничего не найдено. Измените параметры поиска и попробуйте снова.
        </div>
      );
    }

    if (!hasStructure) {
      return <div className="teams-state">Нет данных об оргструктуре.</div>;
    }

    return (
      <div className="teams-layout">
        <div className="teams-tree-card">
          <div className="teams-list">

            <div className="teams-row">
              <div className="teams-row-left">
                <span className="teams-tree-name">Название</span>
              </div>

              <div className="teams-row-right">
                <span className="teams-row-head" style={{textAlign: "left", width: 128}}>Роль</span>
                <span className="teams-row-head">Сотруд.</span>
                <span className="teams-row-head">Группы</span>
                <span className="teams-row-head">Отделы</span>
                <span className="teams-row-head">Юр. лиц</span>
                <span className="teams-row-head">Домен</span>
              </div>
            </div>

            {addMode && <AddTeamRow
              getNodesAtDepthFromFlat={getNodesAtDepthFromFlat}
              createFolder={createFolder}
              onFinish={onFinishEnd}/>}

            {flatList.map(item => {
              if (!isVisible(item.ancestors)) return null;

              if (item.type === "folder") {
                const agg = aggregates[item.id] || {
                  employees: 0,
                  groups: 0,
                  departments: 0,
                  legalEntities: 0,
                  domains: 0
                };
                return (
                  <DroppableFolderWrapper
                    key={item.id}
                    folderId={item.id}
                    folderName={item.name}
                    onDrop={handleFolderDrop}
                    disabled={dragState.userId === item.id} // Нельзя перемещать в себя
                  >
                    <TeamRow
                      item={item}
                      agg={agg}
                      expanded={expanded}
                      toggle={toggle}
                      matched={matchedIds[item.id]}
                    />
                  </DroppableFolderWrapper>
                );
              }

              // Для пользователей
              const node = nodesById.get(item.ancestors[item.ancestors.length - 1]);
              const isInLocalFolder = node?.isLocal;

              return (
                <DraggableUserWrapper
                  key={item.id}
                  userId={item.id}
                  userName={item.name}
                  userRole={item.position}
                  onDragStart={handleUserDragStart}
                  onDragEnd={handleUserDragEnd}
                  disabled={isInLocalFolder} // Нельзя перемещать из локальных папок
                >
                  <UserLine
                    id={item.id}
                    isAdmin={item.isAdmin}
                    title={item.name}
                    about={item.position}
                    depth={item.depth + 0.5}
                    matched={matchedIds[item.id]}
                  />
                </DraggableUserWrapper>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 className="teams-title">Все сотрудники</h2>

      <div className="teams-table-settings">
        <div className="teams-search">
          <input
            className="teams-search-input"
            placeholder="Поиск по имени или роли"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {userStore.user?.isAdmin &&
          <div className={"teams-table-settings_buttons"}>
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16}}>
              <button className="AD-sync-button" onClick={onUpdateAD}>
                AD выгрузка <img src="/icons/dowland.svg" alt="dowland icon"/>
              </button>
              {!addMode && (
                <button className="edit-mode-button" onClick={onStartAdd}>
                  <img src={"/icons/PlusInCircle.svg"} alt={"toggle add team mode"}/>
                </button>
              )}
              {addMode && (
                <>
                  <button className="edit-mode-button" onClick={onCancelAdd}>отменить</button>
                </>
              )}
            </div>
          </div>
        }
      </div>

      {renderContent()}
    </>
  );
}
