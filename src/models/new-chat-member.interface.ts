import {Message} from "typegram/message";

export interface NewChatMemberInterface extends Message.NewChatMembersMessage {
    new_chat_member: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
    }
}