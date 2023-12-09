import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import {clear_global_commands, deployCommandsGuild, get_REST_global_Commands} from "./deploy-commands";
import moment from "moment";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

export const log = async (message : string) => {
    const time = moment().format("MMMM Do YYYY, h:mm:ss a");
    console.log(`[${time}] [LOG]: ${message}`);
};

client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
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
    console.log({"user_id": message.author.id, "author": message.author.displayName, "content": message.content});
    if (message.author.id == config.DISCORD_BOT_OWNER) {
        switch (message.content) {
        case "~deployGuild": {
            await log(`Found bot owner [${message.author.id}] using command ~deployGuild in: ${message.guildId}`);
            if (message.guildId != null) {
                await message.reply(`Deploying commands in: ${message.guildId}`);
                await deployCommandsGuild({ guildId: message.guildId });
            }
            break;
        }
        case "~getGlobalCommands":{
            await log(`Found bot owner [${message.author.id}] using command ~getGlobalCommands in: ${message.guildId}`);
            const msg2 = "```json\n" + JSON.stringify(await get_REST_global_Commands(),null, 2) + "```";
            await message.reply(msg2);
            break;
        }
        case "~clearGlobalCommands":{
            await log(`Found bot owner [${message.author.id}] using command ~clearGlobalCommands in: ${message.guildId}`);
            await message.reply("Clearing Global Bot commands");
            await clear_global_commands();
            break;
        }
        }
    }
});

client.login(config.DISCORD_TOKEN);
