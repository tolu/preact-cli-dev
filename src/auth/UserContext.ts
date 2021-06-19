import { createContext } from "preact";

export const UserContext = createContext({ token: '', isLoggedIn: false });
