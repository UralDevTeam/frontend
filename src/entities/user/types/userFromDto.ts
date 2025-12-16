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

    const hireDateFromExperience = () => {
        const days = Number(userDto.experience);
        if (!Number.isFinite(days) || days <= 0) return undefined;

        const dt = new Date();
        dt.setDate(dt.getDate() - days);
        return dt;
    };

    return {
        aboutMe: userDto.aboutMe,
        birthday: userDto.birthday ? new Date(userDto.birthday) : undefined,
        hireDate: hireDateFromExperience(),
        isBirthyearVisible: userDto.isBirthyearVisible,
        boss: userDto.boss,
        city: userDto.city,
        department: userDto.department,
        email: userDto.email,
        experience: userDto.experience,
        fio: userDto.fio,
        firstName: fioParts.firstName,
        middleName: fioParts.middleName,
        lastName: fioParts.lastName,
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
