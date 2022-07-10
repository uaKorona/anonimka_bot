import {Telegraf} from "telegraf";
import LaunchOptions = Telegraf.LaunchOptions;

export function getConfig(): LaunchOptions {
    const { HEROKU_APP_NAME, PORT, PRODUCTION } = process.env;

    if (PRODUCTION === undefined) {
        return  {}
    }

    const domain: string = `https://${HEROKU_APP_NAME}.herokuapp.com`;
    const port: number = parseInt(PORT as string, 10) || 5000

    return {
        webhook: {
            domain,
            port,
        }
    }

}