import {TeamNode} from "../entries/team/model";
import {mockUsers} from "./users";

const userMap = mockUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
}, {} as Record<string, typeof mockUsers[number]>);

function pickUsers(ids: string[]): TeamNode["users"] {
    return ids
        .map(id => {
            const user = userMap[id];
            if (!user) return undefined;
            return {
                id: user.id,
                name: user.fio,
                role: user.role,
                mail: user.mail,
            };
        })
        .filter((u): u is NonNullable<typeof u> => Boolean(u));
}

export const mockTeams: TeamNode[] = [
    {
        id: "team-management",
        name: "Правление",
        users: pickUsers(["emp-0006"]),
        children: [
            {
                id: "team-product-office",
                name: "Продуктовый офис",
                users: pickUsers(["emp-0005"]),
                children: [
                    {
                        id: "team-ux-studio",
                        name: "UX Studio",
                        users: pickUsers(["emp-0001"]),
                    },
                ],
            },
            {
                id: "team-engineering",
                name: "Инженерный блок",
                users: pickUsers(["emp-0004"]),
                children: [
                    {
                        id: "team-backend-guild",
                        name: "Backend Guild",
                        users: pickUsers(["emp-0002"]),
                    },
                ],
            },
            {
                id: "team-client-services",
                name: "Клиентские сервисы",
                users: pickUsers(["emp-0003"]),
            },
        ],
    },
];
