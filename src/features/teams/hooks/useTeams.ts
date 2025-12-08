import {useCallback, useEffect, useMemo, useState} from "react";
import {usersStore} from '../../../entities/users';
import {autorun} from 'mobx';

export type TeamNode = {
  id: string;
  name: string;
  children?: TeamNode[];
  users: { id: string; name: string; role: string; mail: string, isAdmin: boolean }[];
  isLocal?: boolean;
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
  isAdmin: boolean;
  name: string;
  role: string;
  mail: string;
  depth: number;
  ancestors: string[];
};

export type FlatItem = FlatFolder | FlatUser;

// Локальное хранилище для папок
let localFolders: TeamNode[] = [];

// Локальное хранилище для перемещений пользователей
let userMoves: Record<string, string> = {};

function buildTreeFromUsers(users: Array<any>): TeamNode[] {
  const map = new Map<string, TeamNode & { parentKey?: string }>();

  function ensureNode(key: string, name: string, parentKey?: string) {
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
        users: [],
        children: [],
        parentKey,
        isLocal: false
      });
    }
    return map.get(key)!;
  }

  // Сначала добавляем все локальные папки
  function addLocalFolders() {
    for (const folder of localFolders) {
      // Для локальных папок сохраняем информацию о родителе
      if (folder.id.includes('/')) {
        // Это вложенная папка
        const parts = folder.id.split('/');
        const parentKey = parts.slice(0, -1).join('/');
        const key = folder.id;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name: folder.name,
            users: [],
            children: [],
            parentKey: parentKey || undefined,
            isLocal: true
          });
        }
      } else {
        // Это корневая папка
        if (!map.has(folder.id)) {
          map.set(folder.id, {
            id: folder.id,
            name: folder.name,
            users: [],
            children: [],
            isLocal: true
          });
        }
      }
    }
  }

  addLocalFolders();

  for (const u of users || []) {
    const teamPath = Array.isArray(u.team) ? u.team : [];

    // Проверяем, перемещен ли пользователь в другую папку
    const userMove = userMoves[u.id];
    if (userMove) {
      // Если пользователь перемещен, добавляем его в новую папку
      const movePath = userMove.split('/');
      let pathKeyParts: string[] = [];

      for (let i = 0; i < movePath.length; i++) {
        const segment = String(movePath[i]);
        pathKeyParts.push(segment);
        const key = pathKeyParts.join('/');
        const parentKey = pathKeyParts.length > 1 ? pathKeyParts.slice(0, -1).join('/') : undefined;

        // Создаем папку, если ее еще нет
        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name: segment,
            users: [],
            children: [],
            parentKey,
            isLocal: false
          });
        }

        if (i === movePath.length - 1) {
          const node = map.get(key)!;
          // Проверяем, нет ли уже такого пользователя в этой папке
          if (!node.users.find(user => user.id === u.id)) {
            node.users.push({
              id: u.id,
              name: u.fio || u.fullName || '',
              role: u.role || '',
              mail: u.mail || u.email || '',
              isAdmin: u.isAdmin ?? false
            });
          }
        }
      }
      continue;
    }

    if (teamPath.length === 0) {
      const rootKey = '__no_team__';
      const node = ensureNode(rootKey, 'No team');
      if (!node.users.find(user => user.id === u.id)) {
        node.users.push({
          id: u.id,
          name: u.fio || u.fullName || '',
          role: u.role || '',
          mail: u.mail || u.email || '',
          isAdmin: u.isAdmin ?? false
        });
      }
      continue;
    }

    let pathKeyParts: string[] = [];
    for (let i = 0; i < teamPath.length; i++) {
      const segment = String(teamPath[i]);
      pathKeyParts.push(segment);
      const key = pathKeyParts.join('/');
      const parentKey = pathKeyParts.length > 1 ? pathKeyParts.slice(0, -1).join('/') : undefined;
      ensureNode(key, segment, parentKey);

      if (i === teamPath.length - 1) {
        const node = map.get(key)!;
        if (!node.users.find(user => user.id === u.id)) {
          node.users.push({
            id: u.id,
            name: u.fio || u.fullName || '',
            role: u.role || '',
            mail: u.mail || u.email || '',
            isAdmin: u.isAdmin ?? false
          });
        }
      }
    }
  }

  // Строим иерархию
  map.forEach((node) => {
    if (node.parentKey) {
      const parent = map.get(node.parentKey);
      if (parent) {
        if (!parent.children) parent.children = [];
        if (!parent.children.find((c: any) => c.id === node.id)) {
          parent.children.push(node);
        }
      }
    }
  });

  // Собираем корневые элементы
  const roots: TeamNode[] = [];
  map.forEach((node) => {
    if (!node.parentKey) {
      const copy: TeamNode = {
        id: node.id,
        name: node.name,
        users: [...node.users],
        isLocal: node.isLocal
      };

      if (node.children && node.children.length) {
        copy.children = node.children.map((c: any) => ({
          id: c.id,
          name: c.name,
          users: [...c.users],
          children: c.children,
          isLocal: c.isLocal
        }));
      }

      roots.push(copy);
    }
  });

  // Сортируем: сначала существующие команды, затем локальные папки
  roots.sort((a, b) => {
    // Сначала нелокальные элементы
    if (!a.isLocal && b.isLocal) return -1;
    if (a.isLocal && !b.isLocal) return 1;
    // Затем по имени
    return a.name.localeCompare(b.name);
  });

  return roots;
}

export function useTeams() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});
  const [usersVersion, setUsersVersion] = useState(0);
  const [foldersVersion, setFoldersVersion] = useState(0);

  useEffect(() => {
    const disposer = autorun(() => {
      void usersStore.users;
      setUsersVersion(v => v + 1);
    });
    return () => disposer();
  }, []);

  const teams = useMemo(() => buildTreeFromUsers(usersStore.users || []), [usersVersion, foldersVersion]);

  const nodesById = useMemo(() => {
    const map = new Map<string, TeamNode>();

    function walk(node: TeamNode) {
      map.set(node.id, node);
      if (node.children) {
        node.children.forEach(walk);
      }
    }

    teams.forEach(walk);
    return map;
  }, [teams]);

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
              isAdmin: u.isAdmin,
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
        if (it.name.toLowerCase().includes(q) || it.role.toLowerCase().includes(q)) {
          matched[it.id] = true;
        }
      }
    }

    setMatchedIds(matched);

    const toExpand: Record<string, boolean> = {};
    for (const it of flatList) {
      if (matched[it.id]) {
        for (const a of it.ancestors) {
          if (a) toExpand[a] = true;
        }
        if (it.type === 'folder') toExpand[it.id] = true;
      }
    }

    if (Object.keys(toExpand).length) {
      setExpanded(prev => ({...prev, ...toExpand}));
    }
  }, [searchTerm, flatList]);

  const getNodesAtDepthFromFlat = useCallback((depth: number): TeamNode[] => {
    const folderItems = flatList.filter(
      item => item.type === 'folder' && item.depth === depth
    ) as FlatFolder[];

    return folderItems
      .map(item => nodesById.get(item.id))
      .filter((node): node is TeamNode => node !== undefined);
  }, [flatList, nodesById]);

  // Метод для создания папки
  const createFolder = useCallback((name: string, parentFolder?: TeamNode) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const folderId = `folder-${timestamp}-${random}`;

    let fullId: string;

    if (parentFolder) {
      // Создаем вложенную папку
      fullId = `${parentFolder.id}/${folderId}`;
    } else {
      // Создаем корневую папку
      fullId = folderId;
    }

    // Создаем новую папку
    const newFolder: TeamNode = {
      id: fullId,
      name,
      users: [],
      children: [],
      isLocal: true
    };

    // Добавляем в локальное хранилище
    localFolders.push(newFolder);

    // Обновляем версию для перестроения дерева
    setFoldersVersion(v => v + 1);

    // Автоматически раскрываем родительскую папку
    if (parentFolder) {
      setExpanded(prev => ({...prev, [parentFolder.id]: true}));
    }

    return fullId;
  }, []);

  // Метод для перемещения пользователя
  const moveUser = useCallback((userId: string, targetFolder: TeamNode) => {
    // Находим пользователя в исходных данных
    const user = usersStore.users?.find(u => u.id === userId);
    if (!user) return;

    // Сохраняем перемещение в локальное хранилище
    userMoves[userId] = targetFolder.id;

    // Обновляем версию для перестроения дерева
    setUsersVersion(v => v + 1);

    // Раскрываем целевую папку, чтобы показать перемещенного пользователя
    setExpanded(prev => ({...prev, [targetFolder.id]: true}));
  }, []);

  return {
    teams,
    loading: usersStore.loading,
    flatList,
    aggregates,
    expanded,
    toggle,
    isVisible,
    searchTerm,
    setSearchTerm,
    matchedIds,
    getNodesAtDepthFromFlat,
    // Экспортируем новые методы
    createFolder,
    moveUser
  };
}