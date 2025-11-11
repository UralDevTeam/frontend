import {UserDTO} from "../../entries/user";
import {API_BASE} from '../../shared/apiConfig';


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
    // В качестве безопасного fallback возвращаем пустой список — компонент может использовать локальные заглушки.
    console.warn('fetchUsers failed, returning empty list', e);
    return [];
  }
}

