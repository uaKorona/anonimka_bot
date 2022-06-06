import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { MESSAGES } from "./messeges";
import { MessageTypes } from "./message-types.enum";
import { botHelper } from "./bot-helper";

const { ANONIMKA_BOT_TOKEN, ANONIMKA_CHAT_ID } = process.env;

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
