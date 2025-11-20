import { API_BASE } from '../../shared/apiConfig';
import { WorkerStatuses } from '../../shared/statuses/workerStatuses';
import {UserDTO} from "./types/user";

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
  legalEntity?: string;
  department?: string;
};

function mapStatusToWorkerStatus(s?: string): keyof typeof WorkerStatuses {
  // Нормализуем вход и используем словарь для простого расширения
  const normalized = (s ?? '').toString().trim().toLowerCase();
  const statusMap: Record<string, keyof typeof WorkerStatuses> = {
    'work': WorkerStatuses.active,
    'working': WorkerStatuses.active,
    'active': WorkerStatuses.active,
    'on': WorkerStatuses.active,
    'vacation': WorkerStatuses.vacation,
    'vac': WorkerStatuses.vacation,
    'vocation': WorkerStatuses.vacation,
    'sick': WorkerStatuses.sickLeave,
    'sickleave': WorkerStatuses.sickLeave,
    'sick_leave': WorkerStatuses.sickLeave,
    'sick-leave': WorkerStatuses.sickLeave,
  };

  if (!normalized) return WorkerStatuses.active;
  return statusMap[normalized] ?? WorkerStatuses.active;
}

function safeTrim(s?: string | null) {
  if (s === null || s === undefined) return undefined;
  const t = String(s).trim();
  return t === '' ? undefined : t;
}

function safeString(s?: string | null) {
  if (s === null || s === undefined) return '';
  return String(s).trim();
}

function parseDateSafe(d?: string | null): string | undefined {
  if (!d) return undefined;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString();
}

function adaptBackendUserToFrontend(u: BackendUserDTO): UserDTO {
  const fio = safeString(u.fio ?? u.fullName);
  const email = safeTrim(u.email ?? u.mail ?? u.contact) ?? '';

  const team = Array.isArray(u.team) ? u.team.filter(Boolean).map(String) : [];

  const boss = u.boss
    ? {
        id: safeString(u.boss.id),
        fullName: safeString(u.boss.fullName),
        shortName: safeString(u.boss.shortName),
      }
    : { id: '', fullName: '', shortName: '' };

  const birthdayIso = parseDateSafe(u.birthday ?? undefined);

  const experience = typeof u.experience === 'number' && Number.isFinite(u.experience) ? u.experience : Number(u.experience) || 0;

  const isAdmin = Boolean(u.isAdmin);

  return {
    id: safeString(u.id),
    fio,
    email,
    phone: safeTrim(u.phone ?? undefined),
    mattermost: safeTrim(u.mattermost ?? undefined),
    tg: safeTrim(u.tg ?? undefined),
    isAdmin,

    birthday: birthdayIso ?? undefined,
    team,
    boss,
    role: safeString(u.role),
    experience,
    status: mapStatusToWorkerStatus(u.status),

    city: safeString(u.city),
    aboutMe: safeString(u.aboutMe),
    legalEntity: safeString(u.legalEntity),
    department: safeString(u.department),
  } as UserDTO;
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  if (typeof window !== 'undefined') {
    const path = window.location && window.location.pathname ? window.location.pathname : '';
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');
    if (onAuthPage) {
            throw new Error('Cannot fetch current user while on authentication page');
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

export async function fetchUserById(id: string): Promise<UserDTO> {
  if (!id) throw new Error('Missing id');

  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(id)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch /api/users/${id}: ${res.status} ${text}`);
  }

  const raw = (await res.json()) as BackendUserDTO;
  return adaptBackendUserToFrontend(raw);
}
