import UserStore from "./model";

// singleton store
export const userStore = new UserStore();

export type { User } from "../../entries/user/user";
export type { UserDTO } from "../../entries/user/user";
