'use client';

import { useEffect } from 'react';
import { userStore } from '../stores/user-store';

export const useTelegramInit = () => {
  const { setInitData, setInitDataUnsafe, fetchUserProfile } = userStore();

  useEffect(() => {
    // Check if running inside Telegram Web App
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Get the raw init data string
    const initData: string | null = tg.initData ?? null;
    const initDataUnsafe: Record<string, any> | null = tg.initDataUnsafe ?? null;

    // Save to Zustand
    setInitData(initData);
    setInitDataUnsafe(initDataUnsafe);

    // Fetch the user profile from your backend
    const telegramId = initDataUnsafe?.user?.id;
    if (telegramId) {
      fetchUserProfile(telegramId);
    }
  }, [setInitData, setInitDataUnsafe, fetchUserProfile]);
};
