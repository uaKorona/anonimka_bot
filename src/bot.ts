import {Context, Telegraf} from 'telegraf';
import {Update} from 'typegram';
import {MessageTypes} from "./helpers/message-types.enum";
import {BotCommands} from "./helpers/bot-commands";
import {ENV_CONFIG} from "./env/env.config";

const botCommands = new BotCommands(ENV_CONFIG);
const SUPPORT_TYPES = [MessageTypes.photo, MessageTypes.video, MessageTypes.document];

export const bot: Telegraf<Context<Update>> = new Telegraf(ENV_CONFIG.BOT_TOKEN);

bot.start(botCommands.onStart);

bot.on('new_chat_members', botCommands.onNewChatMembers);

bot.use(botCommands.skipMessageFromChat);

bot.on(SUPPORT_TYPES, botCommands.resendMessage);

bot.use(botCommands.onUnSupportMessageType);

