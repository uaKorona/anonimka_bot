import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { MESSAGES } from "./messeges";
import { MessageTypes } from "./message-types.enum";
import { botHelper } from "./bot-helper";

const { anonimka_bot_token, anonimka_chat_id } = process.env;

export const bot: Telegraf<Context<Update>> = new Telegraf( anonimka_bot_token as string );

bot.start( ( ctx ) => {
    ctx.replyWithHTML( MESSAGES.startMessage( ctx.from.first_name ) );
} );

bot.use(async (ctx, next) => {
    if (botHelper.isMessageFromChat( ctx )) {
        // skip running next middlewares for messages from chat
        return;
    }

    return next(); // runs next middleware
})

bot.on( [MessageTypes.photo, MessageTypes.video, MessageTypes.document], ( ctx ) => {
    ctx.copyMessage( anonimka_chat_id as string );
} );

bot.use(( ctx ) => {
    ctx.replyWithHTML( MESSAGES.unSupportType() );
});
