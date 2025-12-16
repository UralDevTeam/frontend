import {User, UserDTO} from "./user";

const splitFio = (fio?: string) => {
    const parts = (fio ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        lastName: parts[0] ?? "",
        firstName: parts[1] ?? "",
        middleName: parts.slice(2).join(" ") ?? "",
    };
};

export const userFromDto: (userDTO: UserDTO) => User = (userDto) => {
    const fioParts = splitFio(userDto.fio);

    return {
        aboutMe: userDto.aboutMe,
        birthday: userDto.birthday ? new Date(userDto.birthday) : undefined,
        hireDate: userDto.hireDate ? new Date(userDto.hireDate) : undefined,
        isBirthyearVisible: userDto.isBirthyearVisible,
        boss: userDto.boss,
        city: userDto.city,
        department: userDto.department,
        email: userDto.email,
        experience: userDto.experience,
        fio: userDto.fio,
        firstName: userDto.firstName || fioParts.firstName,
        middleName: userDto.middleName || fioParts.middleName,
        lastName: userDto.lastName || fioParts.lastName,
        formatTeam: userDto.team.join(' / '),
        id: userDto.id,
        isAdmin: userDto.isAdmin,
        legalEntity: userDto.legalEntity,
        mattermost: userDto.mattermost,
        phone: userDto.phone,
        position: userDto.position,
        status: userDto.status,
        team: userDto.team,
        tg: userDto.tg
    }
}
