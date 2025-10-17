import type { Telegraf } from 'telegraf';
import { registerStartHandlers } from './start';
import { registerCommandHandlers } from './commands';
import { registerRoomHandlers } from './rooms';

export function registerHandlers(bot: Telegraf) {
  registerStartHandlers(bot);
  registerCommandHandlers(bot);
  registerRoomHandlers(bot);
}
