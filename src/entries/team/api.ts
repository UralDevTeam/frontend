import {TeamNode} from "./model";
import {mockTeams} from "../../mocks/teams";

export async function fetchTeams(): Promise<TeamNode[]> {
    await new Promise(res => setTimeout(res, 100));
    return mockTeams;
}

