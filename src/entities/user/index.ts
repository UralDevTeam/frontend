import UserStore from "./model";

export const userStore = new UserStore();

export type {User, UserDTO} from "./types/user";
export {userFromDto} from "./types/userFromDto";
