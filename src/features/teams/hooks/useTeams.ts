import { useEffect, useMemo, useState } from "react";
import { TeamNode } from "../../../entries/team/model";
import { fetchTeams } from "../../../entries/team/api";

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

export function useTeams() {
  const [teams, setTeams] = useState<TeamNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // set of ids that match current search
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTeams().then(data => {
      if (!mounted) return;
      setTeams(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

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

        if (hasChildren) {
          walk(n.children!, depth + 1, [...ancestors, n.id]);
        }

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

  return { teams, loading, flatList, aggregates, expanded, toggle, isVisible, searchTerm, setSearchTerm, matchedIds };
}
