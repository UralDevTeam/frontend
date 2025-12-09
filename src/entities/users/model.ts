import {makeAutoObservable, runInAction} from "mobx";
import {fetchUsers} from "./fetcher";
import {User, UserDTO, userFromDto} from "../user";

export class UsersStore {
  users: User[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsersFromDto(dtos: UserDTO[]) {
    this.users = dtos.map(d => userFromDto(d));
  }

  clear() {
    this.users = [];
    this.loading = false;
    this.error = null;
  }

  async loadFromApi() {
    this.loading = true;
    this.error = null;
    try {
      const dtos = await fetchUsers();
      runInAction(() => {
        this.setUsersFromDto(dtos);
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message ?? String(e);
        this.loading = false;
      });
    }
  }

  fullTextSearch(query: string): User[] {
        const lowerCaseQuery = query.toLowerCase();
        return this.users.filter(user => {
            return (
              user.aboutMe?.toLowerCase().includes(lowerCaseQuery) ||
              user.fio?.toLowerCase().includes(lowerCaseQuery) ||
              user.city?.toLowerCase().includes(lowerCaseQuery) ||
              user.phone?.toLowerCase().includes(lowerCaseQuery) ||
              user.email?.toLowerCase().includes(lowerCaseQuery) ||
              user.position?.toLowerCase().includes(lowerCaseQuery) ||
              user.formatTeam?.toLowerCase().includes(lowerCaseQuery)
            );
        });
    }
}

export const usersStore = new UsersStore();
