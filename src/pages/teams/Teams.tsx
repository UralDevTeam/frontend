import React, {useMemo, useState} from "react";
import "./teams.css";
import UserLineFigma from "./UserLine";

type User = {
  id: string;
  name: string;
  role: string;
  mail: string;
};

type TeamNode = {
  id: string;
  name: string;
  children?: TeamNode[];
  users: User[];
};

// Генератор sample data: создаёт иерархию команд и пользователей
function generateSampleTeams(teamCount = 6, maxDepth = 2, usersPerTeam = 5): TeamNode[] {
  const teamNames = [
    "Platform",
    "Frontend",
    "Backend",
    "Design",
    "QA",
    "Mobile",
    "Security",
    "Product",
    "Support",
  ];
  const firstNames = ["Иван", "Пётр", "Анна", "Ольга", "Сергей", "Мария", "Дмитрий", "Елена"];
  const lastNames = ["Иванов", "Петров", "Сидоров", "Кузнецова", "Смирнов", "Ковалёва", "Козлов", "Морозова"];
  const roles = ["Разработчик", "Тестировщик", "Дизайнер", "Менеджер", "Аналитик"];

  let teamIndex = 0;
  let userIndex = 0;

  function makeNode(depth: number): TeamNode {
    const name = teamNames[teamIndex % teamNames.length] + (depth > 0 ? ` ${teamIndex}` : "");
    const id = `team-${teamIndex++}`;

    const users: User[] = [];
    for (let i = 0; i < usersPerTeam; i++) {
      const first = firstNames[userIndex % firstNames.length];
      const last = lastNames[userIndex % lastNames.length];
      const role = roles[userIndex % roles.length];
      users.push({
        id: `u-${userIndex}`,
        name: `${last} ${first}`,
        role,
        mail: `${first.toLowerCase()}.${last.toLowerCase().replace(/ё/g, 'e')}@example.com`
      });
      userIndex++;
    }

    const node: TeamNode = {id, name, users};

    if (depth < maxDepth && teamIndex < teamCount) {
      const childrenCount = Math.min(2, teamCount - teamIndex);
      if (childrenCount > 0) {
        node.children = [];
        for (let i = 0; i < childrenCount; i++) {
          node.children.push(makeNode(depth + 1));
        }
      }
    }

    return node;
  }

  const roots: TeamNode[] = [];
  while (teamIndex < teamCount) {
    roots.push(makeNode(0));
  }
  return roots;
}

export default function Teams() {
  const teams = useMemo(() => generateSampleTeams(10, 4, 6), []);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded(prev => ({...prev, [id]: !prev[id]}));
  }

  function renderTree(nodes: TeamNode[]) {
    return (
      <div className="teams-tree-list">
        {nodes.map(n => (
          <div key={n.id} className="teams-tree-item">
            <div className="teams-tree-row">
              {(n.children && n.children.length) || (n.users && n.users.length) ? (
                <button className="teams-tree-toggler" onClick={() => toggle(n.id)} aria-label="toggle">
                  {expanded[n.id] ? "▼" : "▶"}
                </button>
              ) : (
                <span className="teams-tree-empty"/>
              )}
              <img src={"./icons/folder.svg"} alt="folder" className="teams-tree-icon"/>
              <span className="teams-tree-name">{n.name}</span>
            </div>

            {n.children && expanded[n.id] && (
              <div className="teams-tree-children">
                {renderTree(n.children)}
              </div>
            )}

            {expanded[n.id] && n.users && n.users.length > 0 && (
              <div className="teams-users-list">
                {n.users.map(u => (
                  <div key={u.id} className="teams-user-row">
                    <UserLineFigma
                      title={u.name}
                      about={["Роль: " + u.role, "Email: " + u.mail]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="main teams-page">
      <h2 className="teams-title">Все сотрудники</h2>

      <div className="teams-layout">
        <div className="simple-border-card teams-tree-card">
          {renderTree(teams)}
        </div>
      </div>
    </main>
  );
}
