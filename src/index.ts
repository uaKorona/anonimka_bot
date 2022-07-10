import { bot } from "./bot";
import {getConfig} from "./bot-config";
import {Telegraf} from "telegraf";
import LaunchOptions = Telegraf.LaunchOptions;

const config: LaunchOptions = getConfig();
bot.launch(config).then(() => console.log('bot lunch with config', config))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
