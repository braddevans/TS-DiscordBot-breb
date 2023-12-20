import { Client } from "discord.js";
import { config } from "./config";
import { commands, import_commands } from "./commands";
import { deployCommandsGuild } from "./deploy-commands";
import { log_log as c_log, run_message_command } from "./util";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"]
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
    c_log(JSON.stringify({
        "user_id": message.author.id,
        "author": message.author.displayName,
        "content": message.content,
        "guildId": message.guildId,
        "guildName": message.guild?.name
    }, null, 2));
    if (message.author.id == config.DISCORD_BOT_OWNER) {
        await run_message_command(message);
    }
});

client.login(config.DISCORD_TOKEN).then(() => {
    c_log("Shit Loaded");
});
