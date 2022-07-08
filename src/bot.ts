import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { MESSAGES } from "./messeges";
import { MessageTypes } from "./message-types.enum";
import { botHelper } from "./bot-helper";
import LaunchOptions = Telegraf.LaunchOptions;


const { ANONIMKA_BOT_TOKEN, ANONIMKA_CHAT_ID, HEROKU_APP_NAME } = process.env;
// webhook settings
const WEBHOOK_HOST = `https://${HEROKU_APP_NAME}.herokuapp.com`;
// https://anonimka-avtorika-bot.herokuapp.com/
const WEBHOOK_PATH = `webhook/${ANONIMKA_BOT_TOKEN}`;
const WEBHOOK_URL = `${WEBHOOK_HOST}/${WEBHOOK_PATH}`;

// webserver settings
const WEBAPP_HOST = '0.0.0.0'
const WEBAPP_PORT = 5000;
const options = {
    webHook: {
        // Port to which you should bind is assigned to $PORT variable
        // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
        port: process.env.PORT
        // you do NOT need to set up certificates since Heroku provides
        // the SSL certs already (https://<app-name>.herokuapp.com)
        // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};

export const bot: Telegraf<Context<Update>> = new Telegraf( ANONIMKA_BOT_TOKEN as string );
//bot.telegram.setWebhook(WEBHOOK_URL)

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
        hookPath: WEBHOOK_URL,
        port: WEBAPP_PORT
    }
}


// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
// const url = process.env.APP_URL || 'https://<app-name>.herokuapp.com:443';
//const bot = new TelegramBot(TOKEN, options);


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
// bot.setWebHook(`${url}/bot${TOKEN}`);

bot.launch(config).then(res => console.log(res))
