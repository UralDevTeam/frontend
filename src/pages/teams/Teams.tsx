import React, {useEffect, useState} from "react";
import "./teams.css";
import {useTeams} from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "../../features/teams/components/UserLine";
import {useDebounce} from "../../shared/helper/debounce";
import {usersStore} from "../../entities/users";
import AddTeamRow from "../../features/teams/components/AddTeamRow";
import { DraggableUserWrapper } from "../../features/teams/components/DraggableUserWrapper";
import { DroppableFolderWrapper } from "../../features/teams/components/DroppableFolderWrapper";

export default function Teams() {
  const {
    loading,
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
    nodesById
  } = useTeams();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [addMode, setAddMode] = useState(false);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    userId?: string;
    userName?: string;
    userRole?: string;
  }>({ isDragging: false });

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
    setDragState({ isDragging: false });
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

  if (loading) return <div>Loading...</div>;

  return (
    <main className="main teams-page">
      <h2 className="teams-title">Все сотрудники</h2>

      {/* Индикатор перетаскивания */}
      {dragState.isDragging && dragState.userName && (
        <div className="drag-indicator">
          <span className="drag-indicator-icon">↕️</span>
          Перемещаем: {dragState.userName}
        </div>
      )}

      <div className="teams-table-setings">
        <div className="teams-search">
          <input
            className="teams-search-input"
            placeholder="Поиск по имени или роли"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>
          {!addMode && (
            <button className="edit-mode-button" onClick={onStartAdd}>+</button>
          )}
          {addMode && (
            <>
              <button className="undo-edit-button" onClick={onCancelAdd}>отменить</button>
            </>
          )}
        </div>
      </div>

      <div className="teams-layout">
        <div className="simple-border-card teams-tree-card">
          <div className="teams-list">

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
    </main>
  );
}
