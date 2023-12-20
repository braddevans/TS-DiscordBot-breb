import { Client } from "discord.js";
import { config } from "./config";
import { commands, commandsData, import_commands } from "./commands";
import {
    clear_global_commands,
    deployCommands,
    deployCommandsGuild,
    get_REST_global_Commands,
    get_REST_guild_Commands
} from "./deploy-commands";
import { log as c_log } from "./util";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});


import_commands().then(c_log("commands loaded"));

client.once("ready", () => {
    c_log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommandsGuild({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.on("messageCreate", async (message) => {
    c_log(JSON.stringify({"user_id": message.author.id, "author": message.author.displayName, "content": message.content, "guild": message.guildId},null,2));
    if (message.author.id == config.DISCORD_BOT_OWNER) {
        switch (message.content) {
        case "~deploy": {
            c_log(`Found bot owner [${message.author.id}] using command ~deploy in: ${message.guildId}`);
            if (message.guildId != null) {
                await message.reply("Deploying commands");
                await deployCommands();
            }
            break;
        }
        case "~deployGuild": {
            c_log(`Found bot owner [${message.author.id}] using command ~deployGuild in: ${message.guildId}`);
            if (message.guildId != null) {
                await message.reply(`Deploying commands in: ${message.guildId}`);
                await deployCommandsGuild({ guildId: message.guildId });
            }
            break;
        }
        case "~getCommands": {
            c_log(`commands: ${JSON.stringify(commands)}`);
            break;
        }
        case "~getGuildCommands": {
            c_log(`Found bot owner [${message.author.id}] using command ~getGuildCommands in: ${message.guildId}`);
            const msg2 = "```json\n" + JSON.stringify(await get_REST_guild_Commands(String(message.guildId)),null, 2) + "```";
            await message.reply(msg2);
            break;
        }

        case "~getGlobalCommands":{
            c_log(`Found bot owner [${message.author.id}] using command ~getGlobalCommands in: ${message.guildId}`);
            const msg2 = "```json\n" + JSON.stringify(await get_REST_global_Commands(),null, 2) + "```";
            await message.reply(msg2);
            break;
        }
        case "~clearGlobalCommands":{
            c_log(`Found bot owner [${message.author.id}] using command ~clearGlobalCommands in: ${message.guildId}`);
            await message.reply("Clearing Global Bot commands");
            await clear_global_commands();
            break;
        }
        }
    }
});

client.login(config.DISCORD_TOKEN);
