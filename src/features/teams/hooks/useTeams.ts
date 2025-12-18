import {useCallback, useEffect, useMemo, useState} from "react";
import {usersStore} from '../../../entities/users';
import {autorun} from 'mobx';
import { updateUser } from "../../../entities/user/fetcher";

export const UDV_ROOT_ID = "udv-group-holding";
const UDV_ROOT_NAME = "UDV Group Holding";

export type TeamNode = {
    id: string;
    name: string;
    children?: TeamNode[];
    users: { id: string; name: string; position: string; mail: string, isAdmin: boolean }[];
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
    position: string;
    mail: string;
    depth: number;
    ancestors: string[];
};

export type FlatItem = FlatFolder | FlatUser;

let localFolders: TeamNode[] = [];

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

    function addLocalFolders() {
        for (const folder of localFolders) {
            if (folder.id.includes('/')) {
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

        const userMove = userMoves[u.id];
        if (userMove) {
            const movePath = userMove.split('/');
            let pathKeyParts: string[] = [];

            for (let i = 0; i < movePath.length; i++) {
                const segment = String(movePath[i]);
                pathKeyParts.push(segment);
                const key = pathKeyParts.join('/');
                const parentKey = pathKeyParts.length > 1 ? pathKeyParts.slice(0, -1).join('/') : undefined;

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
                            position: u.position || '',
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
                    position: u.position || '',
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
                        position: u.position || '',
                        mail: u.mail || u.email || '',
                        isAdmin: u.isAdmin ?? false
                    });
                }
            }
        }
    }

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

    roots.sort((a, b) => {
        if (!a.isLocal && b.isLocal) return -1;
        if (a.isLocal && !b.isLocal) return 1;
        return a.name.localeCompare(b.name);
    });

    return [{
        id: UDV_ROOT_ID,
        name: UDV_ROOT_NAME,
        users: [],
        children: roots,
        isLocal: false
    }];
}

export function useTeams() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({[UDV_ROOT_ID]: true});
    const [searchTerm, setSearchTerm] = useState("");
    const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});
    const [usersVersion, setUsersVersion] = useState(0);
    const [foldersVersion, setFoldersVersion] = useState(0);
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        userId?: string;
        userName?: string;
    }>({isDragging: false});

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
        if (id === UDV_ROOT_ID) return;
        setExpanded(prev => ({...prev, [id]: !prev[id]}));
    }

    const aggregates = useMemo(() => {
        const map: Record<string, Agg> = {};

        function dfs(node: TeamNode, depth: number): Agg {
            const agg: Agg = {
                employees: node.users ? node.users.length : 0,
                groups: 0,
                departments: 0,
                legalEntities: 0,
                domains: 0
            };

            if (node.children && node.children.length) {
                for (const ch of node.children) {
                    const childDepth = depth + 1;
                    const childAgg = dfs(ch, childDepth);

                    agg.employees += childAgg.employees;
                    agg.groups += childAgg.groups;
                    agg.departments += childAgg.departments;
                    agg.legalEntities += childAgg.legalEntities;
                    agg.domains += childAgg.domains;

                    switch (childDepth) {
                        case 1:
                            agg.domains += 1;
                            break;
                        case 2:
                            agg.legalEntities += 1;
                            break;
                        case 3:
                            agg.departments += 1;
                            break;
                        case 4:
                            agg.groups += 1;
                            break;
                        default:
                            break;
                    }
                }
            }

            map[node.id] = agg;
            return agg;
        }

        for (const root of teams) dfs(root, 0);
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
                            position: u.position,
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
                if (it.name.toLowerCase().includes(q) || it.position.toLowerCase().includes(q)) {
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

    const reload = useCallback(() => {
        usersStore.loadFromApi();
    }, []);

    const getNodesAtDepthFromFlat = useCallback((depth: number): TeamNode[] => {
        const folderItems = flatList.filter(
            item => item.type === 'folder' && item.depth === depth
        ) as FlatFolder[];

        return folderItems
            .map(item => nodesById.get(item.id))
            .filter((node): node is TeamNode => node !== undefined);
    }, [flatList, nodesById]);

    const resolveFolderPathNames = useCallback((folder: TeamNode): string[] => {
        const folderItem = flatList.find(
            item => item.type === 'folder' && item.id === folder.id
        ) as FlatFolder | undefined;

        const ancestorNames = (folderItem?.ancestors || [])
            .filter(id => id !== UDV_ROOT_ID)
            .map(id => nodesById.get(id)?.name)
            .filter((name): name is string => Boolean(name));

        return [...ancestorNames, folder.name];
    }, [flatList, nodesById]);

    const createFolder = useCallback((name: string, parentFolder?: TeamNode) => {
        const trimmedName = name.trim()
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const fallbackId = `folder-${timestamp}-${random}`;
        const folderId = trimmedName ? trimmedName.replace(/\//g, "-") : fallbackId;
        const displayName = trimmedName || folderId;

        let fullId: string;

        if (parentFolder) {
            fullId = `${parentFolder.id}/${folderId}`;
        } else {
            fullId = folderId;
        }

        const newFolder: TeamNode = {
            id: fullId,
            name: displayName,
            users: [],
            children: [],
            isLocal: true
        };

        localFolders.push(newFolder);

        setFoldersVersion(v => v + 1);

        if (parentFolder) {
            setExpanded(prev => ({...prev, [parentFolder.id]: true}));
        }

        return fullId;
    }, []);

    const moveUser = useCallback(async (userId: string, targetFolder: TeamNode) => {
        const user = usersStore.users?.find(u => u.id === userId);
        if (!user) return;

        const folderPathNames = resolveFolderPathNames(targetFolder);

        userMoves[userId] = folderPathNames.join('/');

        try {
            await updateUser(userId, { team: folderPathNames });
        } catch (error) {
            console.error("Failed to update user team", error);
            throw error;
        }

        setUsersVersion(v => v + 1);

        setExpanded(prev => ({ ...prev, [targetFolder.id]: true }));
    }, [resolveFolderPathNames]);


    return {
        teams,
        loading: usersStore.loading,
        error: usersStore.error,
        reload,
        flatList,
        aggregates,
        expanded,
        toggle,
        isVisible,
        searchTerm,
        setSearchTerm,
        matchedIds,
        getNodesAtDepthFromFlat,
        createFolder,
        moveUser,
        dragState,
        setDragState,
        nodesById
    };
}
