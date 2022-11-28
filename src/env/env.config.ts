import {EnvInterface} from "./env.interface";

const {
    PRODUCTION,
    ANONIMKA_BOT_TOKEN,
    ANONIMKA_CHAT_ID,
    ANONIMKA_LOG_CHAT_ID,
    TEST_CHAT_ID,
    TEST_BOT_TOKEN,
    WELCOME_LINK
} = process.env;

export const ENV_CONFIG: EnvInterface = {
    PRODUCTION: !!PRODUCTION,
    CHAT_ID: PRODUCTION ? ANONIMKA_CHAT_ID as string: TEST_CHAT_ID as string,
    BOT_TOKEN: PRODUCTION ? ANONIMKA_BOT_TOKEN as string : TEST_BOT_TOKEN as string,
    LOG_CHAT_ID: ANONIMKA_LOG_CHAT_ID as string,
    WELCOME_LINK: WELCOME_LINK as string
}

const emptyPops = Object
    .keys(ENV_CONFIG)
    .filter((key: string ) => ENV_CONFIG[key as keyof EnvInterface] == null);

if (emptyPops.length) {
    emptyPops.forEach(prop => console.log(prop, 'is empty'));
    if (!ENV_CONFIG.PRODUCTION) {
        throw new Error('env.config is fail!' + JSON.stringify(ENV_CONFIG))
    }
}