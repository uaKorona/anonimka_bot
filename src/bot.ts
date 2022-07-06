import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { MESSAGES } from "./messeges";
import { MessageTypes } from "./message-types.enum";
import { botHelper } from "./bot-helper";
import LaunchOptions = Telegraf.LaunchOptions;


const { ANONIMKA_BOT_TOKEN, ANONIMKA_CHAT_ID, HEROKU_APP_NAME, PORT } = process.env;
// webhook settings
const WEBHOOK_HOST = `https://${HEROKU_APP_NAME}.herokuapp.com`;
// https://anonimka-avtorika-bot.herokuapp.com/
const WEBHOOK_PATH = `webhook/${ANONIMKA_BOT_TOKEN}`;
const WEBHOOK_URL = `${WEBHOOK_HOST}/${WEBHOOK_PATH}`;

// webserver settings
const WEBAPP_HOST = '0.0.0.0'
const WEBAPP_PORT = PORT || 8000;

export const bot: Telegraf<Context<Update>> = new Telegraf( ANONIMKA_BOT_TOKEN as string );

bot.start( ( ctx ) => {
    ctx.replyWithHTML( MESSAGES.startMessage( ctx.from.first_name ) );
} );

bot.use(async (ctx, next) => {
    if (botHelper.isMessageFromChat( ctx )) {
        // skip running next middlewares for messages from chat
        return;
    }

    return next(); // running next middleware
})

bot.on( [MessageTypes.photo, MessageTypes.video, MessageTypes.document], ( ctx ) => {
    ctx.copyMessage( ANONIMKA_CHAT_ID as string );
} );

bot.use(( ctx ) => {
    ctx.replyWithHTML( MESSAGES.unSupportType() );
});

const config: LaunchOptions = {
    webhook: {
        domain: WEBHOOK_HOST,
        port: 4000
    }
}

bot.launch(config)
