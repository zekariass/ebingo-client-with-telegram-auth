import i18n from "@/i18n"
import { create } from "zustand"

interface SystemConfig {
  id: number
  name: string
  value: string
}

interface SystemStore {
  systemConfigs: SystemConfig[]
  setSystemConfigs: (configs: SystemConfig[]) => void
  fetchSystemConfigs: () => Promise<void>
  resetSystemConfigs: () => void
}


export const useSystemStore = create<SystemStore>((set, get) => ({
    systemConfigs: [],
    setSystemConfigs: (configs) => set({ systemConfigs: [...configs] }),
    fetchSystemConfigs: async () => {
      try {
        const response = await fetch(`/${i18n.language}/api/system/configs`);
        if (!response.ok) throw new Error("Failed to fetch system configs");
        const { data } = await response.json();
        set({ systemConfigs: data });
      } catch (err) {
        console.error("Error fetching system configs:", err);
      }
    },
    resetSystemConfigs: () => set({ systemConfigs: [] }),
}));