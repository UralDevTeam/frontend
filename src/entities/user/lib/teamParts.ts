export function getTeamPart(team: string[], index: number): string {
    return (team[index] || "").trim();
}

export function parseTeam(team: string[]) {
    return {
        domain: getTeamPart(team, 0),
        legalEntity: getTeamPart(team, 1),
        department: getTeamPart(team, 2),
        group: getTeamPart(team, 3),
    };
}
