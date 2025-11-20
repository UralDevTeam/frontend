import {UserDTO} from "../../entries/user";
import { API_BASE } from '../../shared/apiConfig';
import { WorkerStatuses } from '../../shared/statuses/workerStatuses';

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
  if (!s) return WorkerStatuses.active;
  const normalized = s.trim().toLowerCase();
  if (normalized === 'work' || normalized === 'active' || normalized === 'on') return WorkerStatuses.active;
  if (normalized === 'vacation' || normalized === 'vac') return WorkerStatuses.vacation;
  if (normalized === 'sick' || normalized === 'sickleave' || normalized === 'sick_leave' || normalized === 'sickleave') return WorkerStatuses.sickLeave;

  return WorkerStatuses.active;
}

function adaptBackendUserToFrontend(u: BackendUserDTO): UserDTO {
  return {
    id: u.id,
    fio: u.fio ?? u.fullName ?? "",
    email: u.email ?? u.mail ?? u.contact ?? "",
    phone: u.phone ?? undefined,
    mattermost: u.mattermost ?? undefined,
    tg: u.tg ?? undefined,
    isAdmin: u.isAdmin ?? false,

    birthday: u.birthday ?? undefined,
    team: u.team ?? [],
    boss: u.boss ?? { id: "", fullName: "", shortName: "" },
    role: u.role ?? "",
    experience: u.experience ?? 0,
    status: mapStatusToWorkerStatus(u.status),

    city: u.city ?? "",
    aboutMe: u.aboutMe ?? "",
    legalEntity: u.legalEntity ?? "",
    department: u.department ?? "",
  } as UserDTO;
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  if (typeof window !== 'undefined') {
    const path = window.location && window.location.pathname ? window.location.pathname : '';
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');
    if (onAuthPage) {
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
