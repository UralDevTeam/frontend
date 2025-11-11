import { makeAutoObservable, runInAction } from "mobx";
import { UserDTO, User } from "../../entries/user";
import { userFromDto } from "../../entries/user/userFromDto";
import { fetchUsers } from "./fetcher";

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
}

export const usersStore = new UsersStore();

export default UsersStore;
