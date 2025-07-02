import { create } from "zustand";

export const useStore = create((set) => ({
    isLoggedIn: !!localStorage.getItem("jwt"),
    username: localStorage.getItem("username") || "",
      jwt: localStorage.getItem("jwt") || null,

    login: (jwt, username) => {
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", "true");
        set({ isLoggedIn: true, username,jwt });
    },

    logout: () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        localStorage.removeItem("isLoggedIn");
        set({ isLoggedIn: false, username: null, jwt: null });
    },
}));