import {UserDTO} from "../../entries/user";
import { API_BASE } from '../../shared/apiConfig';

// Временный тип для данных, которые будет возвращать бэкенд (будет меняться).
type BackendUserDTO = {
  id: string;
  fio?: string;
  fullName?: string;
  email?: string;
  mail?: string;
  contact?: string;
  phone?: string | null;
  mattermost?: string | null;
  tg?: string | null;
  birthday?: string;
  team?: string[];
  boss?: { id: string; fullName: string; shortName: string } | null;
  role?: string;
  grade?: string;
  experience?: number;
  status?: string;
  city?: string;
  aboutMe?: string;
  isAdmin?: boolean;
};

function adaptBackendUserToFrontend(u: BackendUserDTO): UserDTO {
  return {
    id: u.id,
    fio: u.fio ?? u.fullName ?? "",
    // стараемся взять email/mail/contact в порядке приоритета
    mail: u.email ?? u.mail ?? u.contact ?? "",
    phone: u.phone ?? undefined,
    mattermost: u.mattermost ?? "",
    tg: u.tg ?? undefined,

    birthday: u.birthday ?? new Date().toISOString(),
    team: u.team ?? [],
    // фронтенд ожидает не-null boss, поэтому подставляем пустой объект если null
    boss: u.boss ?? { id: "", fullName: "", shortName: "" },
    role: u.role ?? "",
    experience: u.experience ?? 0,
    // привести status к тому, что ожидает фронтенд (по умолчанию 'work')
    status: (u.status as any) ?? "work",

    city: u.city ?? "",
    aboutMe: u.aboutMe ?? "",
  };
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  // Если мы уже на странице логина/регистрации/аутентификации — не шлём запрос на /api/me
  if (typeof window !== 'undefined') {
    const path = window.location && window.location.pathname ? window.location.pathname : '';
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');
    if (onAuthPage) {
      // Сохраняем поведение — бросаем ошибку 'Unauthorized', чтобы вызывающий код мог обработать состояние неавторизованного пользователя.
      throw new Error('Unauthorized');
    }
  }

  const res = await fetch(`${API_BASE}/api/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (res.status === 401 || res.status === 403) {
    // Не авторизован — перенаправляем на страницу логина.
    // Используем полноценный переход, чтобы сбросить состояние приложения.
    // Но не делаем redirect, если уже на странице логина/регистрации/аутентификации.
    if (typeof window !== 'undefined') {
      const path = window.location && window.location.pathname ? window.location.pathname : '';
      const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');
      if (!onAuthPage) {
        window.location.href = '/login';
      }
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch /api/me: ${res.status} ${text}`);
  }

  const raw = (await res.json()) as BackendUserDTO;
  return adaptBackendUserToFrontend(raw);
}