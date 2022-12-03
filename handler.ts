import http from "serverless-http";
import {bot} from "./src/bot.js";
import {ENV_CONFIG} from "./src/env/env.config.js";

if (!ENV_CONFIG.PRODUCTION) {
    bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}


// setup webhook
export const anonimkaBot = http(bot.webhookCallback("/telegraf"));