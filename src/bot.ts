import { Client, GatewayIntentBits } from "discord.js";
import { setAppCommands } from "./appcommands";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export default async function activateBot() {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
  ];

  const CLIENT_ID = "1106419645092732939";

  setAppCommands(commands, CLIENT_ID);

  client.on("ready", () => {
    console.log(`Logged in as ${client.user!.tag}!`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply("Pong!");
    }
  });

  await client.login(process.env.DISCORDTOKEN);
  return client;
}
