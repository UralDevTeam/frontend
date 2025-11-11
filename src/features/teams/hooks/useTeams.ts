import { useEffect, useMemo, useState } from "react";
import { usersStore } from '../../../entities/users';
import { autorun } from 'mobx';

// Локальное определение TeamNode (ранее было в entries/team/model)
type TeamNode = {
  id: string;
  name: string;
  children?: TeamNode[];
  users: { id: string; name: string; role: string; mail: string }[];
};

type Agg = { employees: number; groups: number; departments: number; legalEntities: number; domains: number };

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

export type FlatItem = FlatFolder | FlatUser;

// build tree of TeamNode from users list
function buildTreeFromUsers(users: Array<any>): TeamNode[] {
  // nodes stored by path key, e.g. 'dev' or 'dev/ui'
  const map = new Map<string, TeamNode & { parentKey?: string }>();

  function ensureNode(key: string, name: string, parentKey?: string) {
    if (!map.has(key)) {
      map.set(key, { id: key, name, users: [], children: [] , parentKey });
    }
    return map.get(key)!;
  }

  for (const u of users || []) {
    const teamPath = Array.isArray(u.team) ? u.team : [];
    if (teamPath.length === 0) {
      // user without team: attach to root node named 'No team'
      const rootKey = '__no_team__';
      const node = ensureNode(rootKey, 'No team');
      node.users.push({ id: u.id, name: u.fio || u.fullName || '', role: u.role || '', mail: u.mail || u.email || '' });
      continue;
    }

    // build nodes along the path
    let pathKeyParts: string[] = [];
    for (let i = 0; i < teamPath.length; i++) {
      const segment = String(teamPath[i]);
      pathKeyParts.push(segment);
      const key = pathKeyParts.join('/');
      const parentKey = pathKeyParts.length > 1 ? pathKeyParts.slice(0, -1).join('/') : undefined;
      ensureNode(key, segment, parentKey);

      // if last segment, attach user
      if (i === teamPath.length - 1) {
        const node = map.get(key)!;
        node.users.push({ id: u.id, name: u.fio || u.fullName || '', role: u.role || '', mail: u.mail || u.email || '' });
      }
    }
  }

  // wire children arrays based on parentKey
  map.forEach((node, key) => {
    if (node.parentKey) {
      const parent = map.get(node.parentKey);
      if (parent) {
        // avoid duplicate child entries
        if (!parent.children) parent.children = [];
        if (!parent.children.find((c: any) => c.id === node.id)) parent.children.push(node);
      }
    }
  });

  // collect roots (nodes without parentKey)
  const roots: TeamNode[] = [];
  map.forEach((node, key) => {
    if (!node.parentKey) {
      // remove parentKey helper before returning
      const copy: TeamNode = { id: node.id, name: node.name, users: node.users || [] };
      if (node.children && node.children.length) {
        copy.children = node.children.map((c: any) => ({ id: c.id, name: c.name, users: c.users || [], children: c.children }));
      }
      roots.push(copy);
    }
  });

  return roots;
}

export function useTeams() {
  // teams now computed from usersStore.users
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // set of ids that match current search
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});

  // локальный счётчик версии пользователей, увеличивается при изменении usersStore.users
  const [usersVersion, setUsersVersion] = useState(0);

  useEffect(() => {
    const disposer = autorun(() => {
      // читаем usersStore.users чтобы autorun подписался
      void usersStore.users;
      // форсим обновление версии
      setUsersVersion(v => v + 1);
    });
    return () => disposer();
  }, []);

  // derive teams from users
  const teams = useMemo(() => buildTreeFromUsers(usersStore.users || []), [usersVersion]);

  function toggle(id: string) {
    setExpanded(prev => ({...prev, [id]: !prev[id]}));
  }

  const aggregates = useMemo(() => {
    const map: Record<string, Agg> = {};

    function dfs(node: TeamNode): { employees: number; groups: number } {
      let employees = node.users ? node.users.length : 0;
      let groups = 0;
      if (node.children && node.children.length) {
        groups += node.children.length;
        for (const ch of node.children) {
          const res = dfs(ch);
          employees += res.employees;
          groups += res.groups;
        }
      }
      map[node.id] = {employees, groups, departments: 0, legalEntities: 0, domains: 0};
      return {employees, groups};
    }

    for (const root of teams) dfs(root);
    return map;
  }, [teams]);

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

        if (hasChildren) {
          walk(n.children!, depth + 1, [...ancestors, n.id]);
        }
      }
    }

    walk(teams, 0, []);
    return out;
  }, [teams]);

  function isVisible(ancestors: string[]) {
    return ancestors.every(a => expanded[a]);
  }

  // вычисление совпадений по searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setMatchedIds({});
      return;
    }

    const q = searchTerm.trim().toLowerCase();
    const matched: Record<string, boolean> = {};

    for (const it of flatList) {
      if (it.type === 'folder') {
        if (it.name.toLowerCase().includes(q)) {
          matched[it.id] = true;
        }
      } else {
        // user
        if (it.name.toLowerCase().includes(q) || it.role.toLowerCase().includes(q)) {
          matched[it.id] = true;
        }
      }
    }

    setMatchedIds(matched);

    // автоматически раскрываем родителей найденных элементов
    const toExpand: Record<string, boolean> = {};
    for (const it of flatList) {
      if (matched[it.id]) {
        // раскрываем всех предков
        for (const a of it.ancestors) {
          if (a) toExpand[a] = true;
        }
        // если найденная папка сама — раскрыть её
        if (it.type === 'folder') toExpand[it.id] = true;
      }
    }

    if (Object.keys(toExpand).length) {
      setExpanded(prev => ({...prev, ...toExpand}));
    }
  }, [searchTerm, flatList]);

  return { teams, loading: usersStore.loading, flatList, aggregates, expanded, toggle, isVisible, searchTerm, setSearchTerm, matchedIds };
}