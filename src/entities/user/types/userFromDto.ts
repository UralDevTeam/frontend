import {User, UserDTO} from "./user";

export const userFromDto = (user: UserDTO) => {
    return {
        ...structuredClone(user),
        birthday: user.birthday ? new Date(user.birthday) : undefined,
        hideBirthdayYear: user.hideBirthdayYear,
        formatTeam: user.team.join(' / ')
    } as User
}
