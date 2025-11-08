// utils/inviteLink.ts
export function generateInviteLink(botUsername: string, telegramId: number | string) {
  if (!botUsername) throw new Error('Bot username is required.');
  return `https://t.me/${botUsername}?start=${telegramId}`;
}
