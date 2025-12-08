import {User, UserDTO} from "./user";

export const userFromDto: (userDTO: UserDTO) => User = (userDto) => {
  return {
    aboutMe: userDto.aboutMe,
    birthday: userDto.birthday ? new Date(userDto.birthday) : undefined,
    boss: userDto.boss,
    city: userDto.city,
    department: userDto.department,
    email: userDto.email,
    experience: userDto.experience,
    fio: userDto.fio,
    formatTeam: userDto.team.join(' / '),
    id: userDto.id,
    isAdmin: userDto.isAdmin,
    legalEntity: userDto.legalEntity,
    mattermost: userDto.mattermost,
    phone: userDto.phone,
    role: userDto.position,
    status: userDto.status,
    team: userDto.team,
    tg: userDto.tg
  }
}
