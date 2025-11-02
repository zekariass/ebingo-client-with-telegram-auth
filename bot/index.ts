import { Telegraf } from 'telegraf';
import { setCommandsAndWebhooks } from './setup';
import { registerMiddleware } from './middleware';
import { registerHandlers } from './handlers.ts';

// dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN missing');
if (!process.env.BACKEND_BASE_URL) throw new Error('BACKEND_BASE_URL missing');
if (!process.env.APP_URL) throw new Error('APP_URL missing');

export const bot = new Telegraf(process.env.BOT_TOKEN as string);

// install middleware and handlers
registerMiddleware(bot);
registerHandlers(bot);

// global error catcher
bot.catch((err) => console.error('Bot global error:', err));

// register commands & webhooks once
setCommandsAndWebhooks(bot).then(() => console.log('Bot setup complete')).catch(err => console.error('Setup error:', err));

export default bot;
