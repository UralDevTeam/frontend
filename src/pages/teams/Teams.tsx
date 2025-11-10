import React from "react";
import "./teams.css";
import { useTeams } from "../../features/teams/hooks/useTeams";
import TeamRow from "../../features/teams/components/TeamRow";
import UserLine from "./UserLine";

export default function Teams() {
  const { loading, flatList, aggregates, expanded, toggle, isVisible } = useTeams();

  if (loading) return <div>Loading...</div>;

  return (
    <main className="main teams-page">
      <h2 className="teams-title">Все сотрудники</h2>

      <div className="teams-layout">
        <div className="simple-border-card teams-tree-card">
          <div className="teams-list">
            {flatList.map(item => {
              if (!isVisible(item.ancestors)) return null;

              if (item.type === "folder") {
                const agg = aggregates[item.id] || { employees: 0, groups: 0, departments: 0, legalEntities: 0, domains: 0 };
                return (
                  <TeamRow key={item.id} item={item} agg={agg} expanded={expanded} toggle={toggle} />
                );
              }

              return (
                <UserLine
                  key={item.id}
                  title={item.name}
                  about={[`Роль: ${item.role}`]}
                  depth={item.depth + 0.5}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
