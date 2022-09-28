import {Context} from "telegraf";
import {Update} from "typegram";
import {MESSAGES} from "./messeges";
import {botHelper} from "./bot-helper";
import {bot} from "../bot";
import {EnvInterface} from "../env/env.interface";
import {NewChatMemberInterface} from "../models/new-chat-member.interface";

export class BotCommands {
    constructor(
        private readonly env: EnvInterface
    ) {
    }

    onStart = (ctx: Context<Update>) =>
        ctx.replyWithHTML(MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'));

    skipMessageFromChat = async (ctx: Context<Update>, next: () => Promise<void>) => {
        if (botHelper.isMessageFromChat(ctx)) {
            // skip running next middlewares for messages from chat
            return;
        }

        return next(); // running next middleware
    }

    onUnSupportMessageType = (ctx: Context<Update>) => {
        ctx.forwardMessage(this.env.LOG_CHAT_ID);
        return ctx.replyWithHTML(MESSAGES.unSupportType());
    }

    resendMessage = (ctx: Context<Update>) => {
        ctx.forwardMessage(this.env.LOG_CHAT_ID)
            .then((ctx2) =>
                bot.telegram.copyMessage(
                    this.env.CHAT_ID,
                    this.env.LOG_CHAT_ID,
                    ctx2.message_id
                )
            )
    }

    onNewChatMembers = (ctx: Context<Update>) => {
        const message: NewChatMemberInterface = ctx.message as NewChatMemberInterface;
        const {first_name, username} = message.new_chat_member;
        return ctx.replyWithHTML(MESSAGES.welcome(first_name, username, this.env.WELCOME_LINK))
    }
}