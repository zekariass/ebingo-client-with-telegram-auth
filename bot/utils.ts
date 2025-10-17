import { translations } from './translations';
import { getUserLang } from './userLangMap';

export function t(ctx: any, key: string) {
  const userId = ctx.from?.id;
  const lang = getUserLang(userId);
  return translations[lang]?.[key] || translations['en'][key] || key;
}
