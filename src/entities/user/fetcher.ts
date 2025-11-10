import {UserDTO} from "../../entries/user";

// Пробный fetcher — пытается получить /api/user/me, иначе возвращает заглушку
export async function fetchCurrentUser(): Promise<UserDTO> {

  const now = new Date();
  return {
    id: 'sample-1',
    fio: 'Иванов Иван Иванович',
    mail: 'ivanov@example.com',
    phone: '+7 (900) 000-00-00',
    mattermost: 'ivanov_mm',
    tg: 'ivanov_tg',
    birthday: now.toISOString(),
    team: ['Разработка', 'Frontend'],
    boss: {id: 'boss-1', fullName: 'Петров Петр', shortName: 'П.П.'},
    role: 'Разработчик',
    experience: 365,
    status: 'work',
    city: 'Екатеринбург',
    aboutMe: 'Заглушка пользователя'
  } as UserDTO;
}

