import type { Telegraf } from 'telegraf';
import { registerStartHandlers } from './start';
import { registerCommandHandlers } from './commands';
import { registerRoomHandlers } from './rooms';
import { registerNicknameHandlers } from './nickname';
import { registerWalletHandlers } from './wallet-handler';

export function registerHandlers(bot: Telegraf) {
  registerStartHandlers(bot);
  registerCommandHandlers(bot);
  registerRoomHandlers(bot);
  registerNicknameHandlers(bot);
  registerWalletHandlers(bot)
}
