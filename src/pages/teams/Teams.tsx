import React, {useEffect, useState} from "react";
import "./teams.css";
import {useTeams} from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "../../features/teams/components/UserLine";
import {useDebounce} from "../../shared/helper/debounce";
import {usersStore} from "../../entities/users";
import AddTeamRow from "../../features/teams/components/AddTeamRow";
import {DraggableUserWrapper} from "../../features/teams/components/DraggableUserWrapper";
import {DroppableFolderWrapper} from "../../features/teams/components/DroppableFolderWrapper";

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

  if (loading) return <div>Loading...</div>;

  return (
    <main className="main teams-page">
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
        <div className={"teams-table-settings_buttons"}>
          {!addMode && (
            <button className="edit-mode-button" onClick={onStartAdd}>
              <img src={"/icons/PlusInCircle.svg"} alt={"toggle add team mode"} />
            </button>
          )}
          {addMode && (
            <>
              <button className="edit-mode-button" onClick={onCancelAdd}>отменить</button>
            </>
          )}
        </div>
      </div>

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
    </main>
  );
}
