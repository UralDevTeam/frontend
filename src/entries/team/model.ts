export type User = {
  id: string;
  name: string;
  role: string;
  mail: string;
};

export type TeamNode = {
  id: string;
  name: string;
  children?: TeamNode[];
  users: User[];
};

export function generateSampleTeams(teamCount = 6, maxDepth = 2, usersPerTeam = 5): TeamNode[] {
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

