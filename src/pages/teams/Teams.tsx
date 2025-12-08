import React, {useEffect, useState} from "react";
import "./teams.css";
import {useTeams} from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "./UserLine";
import {useDebounce} from "../../shared/helper/debounce";
import {usersStore} from "../../entities/users";
import AddTeamRow from "./AddTeamRow";


export default function Teams() {
  const {loading, flatList, aggregates, expanded, toggle, isVisible, setSearchTerm, matchedIds, getNodesAtDepthFromFlat, createFolder} = useTeams();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  const [addMode, setAddMode] = useState(false);

  const onStartAdd = () => {
    setAddMode(true);
  }

  const onCancelAdd = () => {
    setAddMode(false);
  }
  const onFinishEnd = onCancelAdd;

  useEffect(() => {
    if (!usersStore.users || usersStore.users.length === 0) {
      usersStore.loadFromApi();
    }
  }, []);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  if (loading) return <div>Loading...</div>;


  return (
    <main className="main teams-page">
      <h2 className="teams-title">Все сотрудники</h2>

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
                  <TeamRow key={item.id} item={item} agg={agg} expanded={expanded} toggle={toggle}
                           matched={matchedIds[item.id]}/>
                );
              }

              return (
                <UserLine
                  key={item.id}
                  id={item.id}
                  isAdmin={item.isAdmin}
                  title={item.name}
                  about={item.role}
                  depth={item.depth + 0.5}
                  matched={matchedIds[item.id]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
