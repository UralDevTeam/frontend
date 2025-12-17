import {User, UserDTO} from "./user";
import { parseTeam } from "../lib/teamParts";

export const userFromDto: (userDTO: UserDTO) => User = (userDto) => {
    const parts = parseTeam(userDto.team);

    return {
        aboutMe: userDto.aboutMe,
        birthday: userDto.birthday ? new Date(userDto.birthday) : undefined,
        isBirthyearVisible: userDto.isBirthyearVisible,
        boss: userDto.boss,
        city: userDto.city,
        email: userDto.email,
        experience: userDto.experience,
        fio: userDto.fio,
        formatTeam: userDto.team.join(' / '),
        id: userDto.id,
        isAdmin: userDto.isAdmin,
        mattermost: userDto.mattermost,
        phone: userDto.phone,
        position: userDto.position,
        status: userDto.status,
        team: userDto.team,
        tg: userDto.tg,
        domain: parts.domain,
        legalEntity: parts.legalEntity,
        department: parts.department,
        group: parts.group,
    }
}
