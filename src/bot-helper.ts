import { Context } from "telegraf";
import { Update } from "typegram";

class BotHelper {
    public readonly zero: number = 0;

    public isMessageFromChat(ctx: Context<Update>): boolean {
        const id = ctx?.chat?.id ?? this.zero;

        return id < this.zero;
    }
}

export const botHelper = new BotHelper();
