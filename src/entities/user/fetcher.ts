import {WorkerStatuses} from '../../shared/statuses/workerStatuses';
import {UserDTO, UserLinkDTO} from "./types/user";
import {apiClient} from "../../shared/lib/api-client";

type BackendUserDTO = {
    id: string;
    fio?: string;
    email?: string;
    phone?: string | null;
    mattermost?: string | null;
    tg?: string | null;
    birthday?: string;
    isBirthyearVisible: boolean;
    team?: string[];
    boss?: UserLinkDTO | null;
    position?: string;
    experience?: number;
    status?: string;
    city?: string;
    aboutMe?: string;
    isAdmin?: boolean;
};

function mapStatusToWorkerStatus(s?: string): keyof typeof WorkerStatuses {
  const normalized = (s ?? '').toString().trim().toLowerCase();
  const statusMap: Record<string, keyof typeof WorkerStatuses> = {
    'active': WorkerStatuses.active,
    'vacation': WorkerStatuses.vacation,
    'sickleave': WorkerStatuses.sickLeave,
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
  const fio = safeString(u.fio);
  const email = safeTrim(u.email) ?? '';

  const team = Array.isArray(u.team) ? u.team.filter(Boolean).map(String) : [];

  const boss = u.boss
    ? {
      id: safeString(u.boss.id),
      fullName: safeString(u.boss.fullName),
      shortName: safeString(u.boss.shortName),
    }
    : {id: '', fullName: '', shortName: ''};

  const birthdayIso = parseDateSafe(u.birthday ?? undefined);

  const isBirthyearVisible = Boolean(u.isBirthyearVisible);

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
    isBirthyearVisible,
    team,
    boss,
    position: safeString(u.position),
    experience,
    status: mapStatusToWorkerStatus(u.status),

    city: safeString(u.city),
    aboutMe: safeString(u.aboutMe),
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

  try {
    const res = await apiClient.get<BackendUserDTO>(`/api/me`)
    return adaptBackendUserToFrontend(res);

  } catch (error) {
    if (typeof window !== 'undefined') {
      const path = window.location && window.location.pathname ? window.location.pathname : '';
      const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');
      if (!onAuthPage) {
        window.location.href = '/login';
      }
    }
    throw new Error('Unauthorized');

  }

}

export async function fetchUserById(id: string): Promise<UserDTO> {
  if (!id) throw new Error('Missing id');

  const res = await apiClient.get<BackendUserDTO>(`/api/users/${encodeURIComponent(id)}`)
  return adaptBackendUserToFrontend(res);

}

export const updateUser = async (userId: string, payload: Partial<UserDTO>): Promise<UserDTO> => {
  return await apiClient.put<UserDTO>(`/api/users/${encodeURIComponent(userId)}`, payload);
};


export const deleteUser = async (userId: string): Promise<void> => {
  return await apiClient.delete(`/api/user/${encodeURIComponent(userId)}`)
}