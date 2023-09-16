import { Client, GatewayIntentBits } from "discord.js";
import { setAppCommands } from "../libs/appcommands";
import { pong, sunquote, vote } from "../libs/data/commands/slashc";
import { purge } from "../libs/data/commands/usercommands";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.AutoModerationExecution,
  ],
});

export default async function activateBot() {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
    {
      name: "quote",
      description: "Quotes from Sun Tzu, The Art of War",
    },
    {
      name: "poll",
      description: "Creates a Poll for casting votes",
      options: [
        {
          name: "question",
          type: 3,
          description: "The Question",
          required: true,
        },
        {
          name: "candidates",
          type: 3,
          description: "Names of Candidates, seperated by space",
          required: true,
        },
        {
          name: "multiple",
          type: 3,
          description: "Whether a person can cast multiple votes",
          required: false,
          default: false,
        },
      ],
    },
    {
      name: "purge",
      description: "Thanos' snap in the channel",
    },
  ];

  const CLIENT_ID = process.env.CLIENTID!;

  setAppCommands(commands, CLIENT_ID);

  client.on("ready", () => {
    console.log(`Logged in as ${client.user!.tag}!`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "ping") {
      await pong(interaction);
    } else if (interaction.commandName === "quote") {
      await sunquote(interaction);
    } else if (interaction.commandName === "poll") {
      await vote(interaction);
    } else if (interaction.commandName === "purge") {
      await purge(interaction);
    }
  });

  await client.login(process.env.DISCORDTOKEN);
  client.user!.setPresence({
    activities: [
      {
        name: "League of Legends",
      },
    ],
    status: "idle",
  });

  return client;
}
