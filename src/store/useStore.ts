import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PersistentStore {
  name: string;
  setName: (newName: string) => void;
  jwt: string;
  token: string;
  setJwt: (newJwt: string) => void;
  setToken: (newToken: string) => void;
  version: number;
  setVersion: (newVersion: number) => void;
  pfp: string;
  setPfp: (newPfp: string) => void;
  displayName: string;
  setDisplayName: (newDisplayName: string) => void;
  clearData: () => void;
}

// Create a store with persistence
export const useStore = create<PersistentStore>()(
  persist(
    (set) => ({
      name: '',
      setName: (newName: string) => set({ name: newName }),
      jwt: '',
      token: '',
      setJwt: (newJwt: string) => set({ jwt: newJwt }),
      setToken: (newToken: string) => set({ token: newToken }),
      version: 0,
      setVersion: (newVersion: number) => set({ version: newVersion }),
      pfp: '',
      setPfp: (newPfp: string) => set({ pfp: newPfp }),
      displayName: '',
      setDisplayName: (newDisplayName: string) =>
        set({ displayName: newDisplayName }),
      clearData: () =>
        set({
          name: '',
          jwt: '',
          token: '',
          pfp: '',
          displayName: '',
          version: 0,
        }), // Fix version later, it should not be reset.
    }),
    {
      name: 'user-storage',
    }
  )
);
