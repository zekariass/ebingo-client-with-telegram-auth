import type { Telegraf } from 'telegraf';
import { registerStartHandlers } from './start';
import { registerCommandHandlers } from './commands';
import { registerRoomHandlers } from './rooms';
import { registerNicknameHandlers } from './nickname';

export function registerHandlers(bot: Telegraf) {
  registerStartHandlers(bot);
  registerCommandHandlers(bot);
  registerRoomHandlers(bot);
  registerNicknameHandlers(bot);
}
