import moment from "moment";
import { blueBright, gray, red, white, blue } from "console-log-colors";
import { Message } from "discord.js";
import {
    clear_global_commands,
    deployCommands,
    deployCommandsGuild,
    get_REST_global_Commands,
    get_REST_guild_Commands
} from "./deploy-commands";
import { commands } from "./commands";

export const log_log = (message: string, yes?: boolean) => {
    const time = moment().format("DD/MM/YYYY_hh:mm:ss");
    console.log(
        yes ?
            `[${blueBright(time)}] [${red("SYSTEM")}] [${gray("LOG")}]: ${white(message)}` :
            `[${blueBright(time)}] [${gray("LOG")}]: ${white(message)} `
    );
};

export const log_debug = (message: string, yes?: boolean) => {
    const time = moment().format("DD/MM/YYYY_hh:mm:ss");
    console.log(
        yes ?
            `[${blueBright(time)}] [${red("SYSTEM")}] [${blue("DEBUG")}]: ${white(message)}` :
            `[${blueBright(time)}] [${blue("DEBUG")}]: ${white(message)} `
    );
};

export const log_error = (message: string, yes?: boolean) => {
    const time = moment().format("DD/MM/YYYY_hh:mm:ss");
    console.log(
        yes ?
            `[${blueBright(time)}] [${red("SYSTEM")}] [${red("ERR")}]: ${white(message)}` :
            `[${blueBright(time)}] [${red("ERR")}]: ${white(message)} `
    );
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function run_message_command(message: Message) {
    switch (message.content) {
    case "~deploy": {
        log_log(`Found bot owner [${message.author.id}] using command ~deploy in: ${message.guildId}`);
        if (message.guildId != null) {
            await message.reply("Deploying commands");
            await deployCommands();
        }
        break;
    }
    case "~deployGuild": {
        log_log(`Found bot owner [${message.author.id}] using command ~deployGuild in: ${message.guildId}`);
        if (message.guildId != null) {
            await message.reply(`Deploying commands in: ${message.guildId}`);
            await deployCommandsGuild({ guildId: message.guildId });
        }
        break;
    }
    case "~getCommands": {
        log_log(`commands: ${JSON.stringify(commands)}`);
        break;
    }
    case "~getGuildCommands": {
        log_log(`Found bot owner [${message.author.id}] using command ~getGuildCommands in: ${message.guildId}`);
        const msg2 = "```json\n" + JSON.stringify(await get_REST_guild_Commands(String(message.guildId)), null, 2) + "```";
        await message.reply(msg2);
        break;
    }

    case "~getGlobalCommands": {
        log_log(`Found bot owner [${message.author.id}] using command ~getGlobalCommands in: ${message.guildId}`);
        const msg2 = "```json\n" + JSON.stringify(await get_REST_global_Commands(), null, 2) + "```";
        await message.reply(msg2);
        break;
    }
    case "~clearGlobalCommands": {
        log_log(`Found bot owner [${message.author.id}] using command ~clearGlobalCommands in: ${message.guildId}`);
        await message.reply("Clearing Global Bot commands");
        await clear_global_commands();
        break;
    }
    }
}