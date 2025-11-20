import { makeAutoObservable, runInAction } from "mobx";
import {User, UserDTO} from "./types/user";
import {userFromDto} from "./types/userFromDto";

export class UserStore {
    user: User | null = null;
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: User) {
        this.user = user;
    }

    setUserFromDto(userDto: UserDTO) {
        const user = userFromDto(userDto);
        this.setUser(user);
    }

    clear() {
        this.user = null;
        this.error = null;
        this.loading = false;
    }

    updateField<K extends keyof User>(key: K, value: User[K]) {
        if (!this.user) return;
        this.user[key] = value;
    }

    async loadUserFromApi(fetcher: () => Promise<UserDTO>) {
        this.loading = true;
        this.error = null;
        try {
            const dto = await fetcher();
            runInAction(() => {
                this.setUserFromDto(dto);
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

export default UserStore;
