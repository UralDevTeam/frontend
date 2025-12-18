import {UserDTO} from "../user";
import {apiClient} from "../../shared/lib/api-client";

export async function fetchUsers(): Promise<UserDTO[]> {
  return apiClient.get<UserDTO[]>(`/api/users`);
}

export async function createUser(payload: Partial<UserDTO>): Promise<UserDTO> {
  const res = await apiClient.fetch(`/api/user`, {
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
