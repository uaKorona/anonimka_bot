import {Context} from "telegraf";
import {Update} from "typegram";
import {REGEX_URL} from "../models/forbidden.consts";


class BotHelper {
    public readonly zero: number = 0;

    public isMessageFromChat(ctx: Context<Update>): boolean {
        const id = ctx?.chat?.id ?? this.zero;

        return id < this.zero;
    }

    public isTextWithLink(text: string | undefined): boolean {
        return !!(text ?? '').match(REGEX_URL);
    }

    public isMessageForwardedFromChat(ctx: Context<Update>): boolean {
        // @ts-ignore
        return !!ctx?.message?.forward_from_chat;
    }

    public sanitizeText(text: string | undefined): string {
        return (text ?? '').replaceAll(REGEX_URL, '||тут була якась ссилка, але адмін її вирізав||');
    }
}

export const botHelper = new BotHelper();
