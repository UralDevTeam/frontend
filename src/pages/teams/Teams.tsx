import React, {useMemo, useState} from "react";
import "./teams.css";
import UserLine from "./UserLine";

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

type FlatFolder = {
  type: "folder";
  id: string;
  name: string;
  depth: number;
  ancestors: string[];
  hasChildren: boolean;
  hasUsers: boolean;
};

type FlatUser = {
  type: "user";
  id: string;
  name: string;
  role: string;
  mail: string;
  depth: number;
  ancestors: string[];
};

type FlatItem = FlatFolder | FlatUser;

export default function Teams() {
  const teams = useMemo(() => generateSampleTeams(10, 4, 6), []);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded(prev => ({...prev, [id]: !prev[id]}));
  }

  const flatList = useMemo<FlatItem[]>(() => {
    const out: FlatItem[] = [];

    function walk(nodes: TeamNode[], depth: number, ancestors: string[]) {
      for (const n of nodes) {
        const hasChildren = Array.isArray(n.children) && n.children.length > 0;
        const hasUsers = Array.isArray(n.users) && n.users.length > 0;

        out.push({
          type: "folder",
          id: n.id,
          name: n.name,
          depth,
          ancestors: [...ancestors],
          hasChildren,
          hasUsers,
        });

        // Сначала дети (они будут следовать за папкой в плоском списке)
        if (hasChildren) {
          walk(n.children!, depth + 1, [...ancestors, n.id]);
        }

        // Затем пользователи команды
        if (hasUsers) {
          for (const u of n.users) {
            out.push({
              type: "user",
              id: u.id,
              name: u.name,
              role: u.role,
              mail: u.mail,
              depth: depth + 1,
              ancestors: [...ancestors, n.id],
            });
          }
        }
      }
    }

    walk(teams, 0, []);
    return out;
  }, [teams]);

  function isVisible(ancestors: string[]) {
    return ancestors.every(a => expanded[a]);
  }

  //+0.5 depth для элеменов - чтобы у низ был отступ слева

  return (
    <main className="main teams-page">
      <h2 className="teams-title">Все сотрудники</h2>

      <div className="teams-layout">
        <div className="simple-border-card teams-tree-card">
          <div className="teams-list">
            {flatList.map(item => {
              if (!isVisible(item.ancestors)) return null;

              if (item.type === "folder") {
                return (
                  <div className="teams-row" style={{paddingLeft: 24 * (item.depth + 0.5)}}>
                    {(item.hasChildren || item.hasUsers) ? (
                      <button className="teams-tree-toggler" onClick={() => toggle(item.id)} aria-label="toggle">
                        {expanded[item.id] ? "▼" : "▶"}
                      </button>
                    ) : (
                      <span className="teams-tree-empty"/>
                    )}

                    <img src={"./icons/folder.svg"} alt="folder" className="teams-tree-icon"/>
                    <span className="teams-tree-name">{item.name}</span>
                  </div>
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
