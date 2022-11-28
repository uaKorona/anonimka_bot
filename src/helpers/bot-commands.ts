import {Context} from "telegraf";
import {Update} from "typegram";
import {MESSAGES} from "./messeges";
import {botHelper} from "./bot-helper";
import {bot} from "../bot";
import {EnvInterface} from "../env/env.interface";
import {NewChatMemberInterface} from "../models/new-chat-member.interface";
import {Message} from "typegram/message";
import * as tt from "telegraf/src/telegram-types";

const PARSE_MODE_MARKDOWN = 'MarkdownV2';

export class BotCommands {
    constructor(
        private readonly env: EnvInterface
    ) {
    }

    onStart = (ctx: Context<Update>) =>
        ctx.replyWithHTML(MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'));

    onMessageFromChat = async (ctx: Context<Update>, next: () => Promise<void>) => {
        if (!botHelper.isMessageFromChat(ctx)) {
            return next(); // running next middleware
        }

        return this.onForbiddenMessage(ctx)
            .then(()=> ctx.deleteMessage(ctx?.message?.message_id))
            .catch(()=> {}) // ignore next middlewares for correct messages from chat
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

    async onForbiddenMessage(ctx: Context<Update>): Promise<unknown> {
        const {caption} = ctx?.message as Message.CaptionableMessage;
        const {text} = ctx?.message as Message.TextMessage;

        if (botHelper.isMessageForwardedFromChat(ctx)) {
            return this.copyMsgWithCaption(ctx, caption)
        }

        if (botHelper.isTextWithLink(text)) {
            const sanitizedText = botHelper.sanitizeText(text);

            return ctx.telegram.sendMessage(this.env.CHAT_ID, sanitizedText, {parse_mode: PARSE_MODE_MARKDOWN});
        }

        if (botHelper.isTextWithLink(caption)) {
            return this.copyMsgWithCaption(ctx, caption, PARSE_MODE_MARKDOWN)
        }

        return Promise.reject();
    }

    async copyMsgWithCaption(ctx: Context<Update>, text: string | undefined, parse_mode: string | undefined = undefined): Promise<unknown> {
        const caption = botHelper.sanitizeText(text);
        const extra: tt.ExtraCopyMessage = {caption};

        if (parse_mode) {
            extra.parse_mode = parse_mode;
        }

        return ctx.copyMessage(this.env.CHAT_ID, extra);
    }
}