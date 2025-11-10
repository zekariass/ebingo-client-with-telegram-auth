import type { Telegraf } from 'telegraf';
import { registerStartHandlers } from './start';
import { registerCommandHandlers } from './commands';
import { registerRoomHandlers } from './rooms';
import { registerNicknameHandlers } from './nickname';
import { registerWalletHandlers } from './wallet-handler';
import { registerInviteHandler } from './invite';
import { registerBroadcastHandler } from './broadcast';

export function registerHandlers(bot: Telegraf) {
  registerStartHandlers(bot);
  registerCommandHandlers(bot);
  registerRoomHandlers(bot);
  registerNicknameHandlers(bot);
  registerWalletHandlers(bot);
  registerInviteHandler(bot)
  registerBroadcastHandler(bot)
  // setLocalizedCommands()
}
