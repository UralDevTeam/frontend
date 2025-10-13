import {User, UserDTO} from "./user";

export const userFromDto = (user: UserDTO) => {
    return {
        ...user,
        birthday: new Date(user.birthday),
        formatTeam: user.team.join(' / ')
    } as User
}