import { create } from "zustand";

export const useStore = create((set) => ({
    isLoggedIn: !!localStorage.getItem("jwt"),
    username: localStorage.getItem("username") || "",
      jwt: localStorage.getItem("jwt") || null,
       role: localStorage.getItem("role") || "",
triggerRefetchNoti: false,
setTriggerRefetchNoti: (val) => set({ triggerRefetchNoti: val }),


    login: (jwt, username, role) => {
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("username", username);
         localStorage.setItem("role", role);
        localStorage.setItem("isLoggedIn", "true");
        set({ isLoggedIn: true, username,jwt,role });
    },

    logout: () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        set({ isLoggedIn: false, username: null, jwt: null, role:null });
    },
}));