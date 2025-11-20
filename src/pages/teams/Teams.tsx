import React, { useEffect, useState } from "react";
import "./teams.css";
import { useTeams } from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "./UserLine";
import {useDebounce} from "../../shared/helper/debounce";
import {usersStore} from "../../entities/users";

export default function Teams() {
  const { loading, flatList, aggregates, expanded, toggle, isVisible, setSearchTerm, matchedIds } = useTeams();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);

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

      <div className="teams-search">
        <input
          className="teams-search-input"
          placeholder="Поиск по имени или роли"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="teams-layout">
        <div className="simple-border-card teams-tree-card">
          <div className="teams-list">
            {flatList.map(item => {
              if (!isVisible(item.ancestors)) return null;

              if (item.type === "folder") {
                const agg = aggregates[item.id] || { employees: 0, groups: 0, departments: 0, legalEntities: 0, domains: 0 };
                return (
                  <TeamRow key={item.id} item={item} agg={agg} expanded={expanded} toggle={toggle} matched={matchedIds[item.id]} />
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
