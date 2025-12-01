import {API_BASE} from '../../shared/apiConfig';
import {UserDTO} from "../user";


export async function fetchUsers(): Promise<UserDTO[]> {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {'Accept': 'application/json'}
    });

    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch /api/users: ${res.status} ${text}`);
    }

    return (await res.json()) as UserDTO[];
  } catch (e) {
    console.warn('fetchUsers failed, returning empty list', e);
    return [];
  }
}

  export async function createUser(payload: Partial<UserDTO>): Promise<UserDTO> {
  const res = await fetch(`${API_BASE}/api/user`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create user: ${res.status} ${text}`);
  }

  return (await res.json()) as UserDTO;
}
