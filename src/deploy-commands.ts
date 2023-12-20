import { ApplicationCommand, RequestData, REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { log_log, log_error as log_error, delay } from "./util";

const commandsData = Object.values(commands).map((command) => command);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
const clientId = config.DISCORD_CLIENT_ID;

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommandsGuild({ guildId }: DeployCommandsProps) {
    try {
        log_log("Started refreshing application (/) commands.");

        log_log(`put: ${commands}`);
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commandsData,
            }
        );

        log_log("Successfully reloaded application (/) commands.");
    } catch (error) {
        log_error(String(error));
    }
}

export async function deployCommands() {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(clientId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        log_error(String(error));
    }
}

export async function get_REST_global_Commands() {
    // eslint-disable-next-line
    let json : [] = [];
    try {
        console.log("application (/) commands [rest].");
        
        const res = await rest.get(Routes.applicationCommands(clientId));
        //log(JSON.stringify(res));

        //   {
        //    id: '1105859971989647409',
        //    application_id: '1040580250268086323',
        //    version: '1105859972203544616',
        //    default_member_permissions: null,
        //    type: 1,
        //    name: 'stop',
        //    description: 'stop playback, disconnect, and clear all songs in the queue',
        //    dm_permission: true,
        //    contexts: null,
        //    integration_types: [ 0 ],
        //    nsfw: false
        //  },
        for (let i = 0; i <= res.length; i++) {
            log_log(`appending: ${JSON.stringify({"id":res[i].id, "name":res[i].name})}`);
            json.push({"id":res[i].id, "name":res[i].name});
        }

        log_log("Successfully got application (/) commands.");
    } catch (error) {
        log_error(String(error));
    }
    return json;
}

export async function get_REST_guild_Commands(guildId: string) {
    try {
        log_log("application (/) commands [rest].");

        const res = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        log_log(res);

        log_log("Successfully got application (/) commands.");
    } catch (error) {
        log_error(String(error));
    }
}

export async function clear_global_commands(){
    const global_commands = await get_REST_global_Commands();
    for(let i = 0; i < global_commands.length; i++) {
        rest.put(Routes.applicationCommands(clientId), { body: [] })
      	.then(() => log_log("Successfully deleted all application commands."))
      	.catch((e) => log_error(String(e)));
        await delay(1000);
    }
}

