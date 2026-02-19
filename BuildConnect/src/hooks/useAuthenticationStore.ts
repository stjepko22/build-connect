import { useRootStore } from "./useRootStore";

export const useAuthenticationStore = () => {
    return useRootStore().authenticationStore;
}