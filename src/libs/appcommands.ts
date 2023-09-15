import { REST, Routes } from "discord.js";

interface ApplicationCommandDesc {
  name: string;
  description: string;
}

export async function setAppCommands(
  commands: Array<ApplicationCommandDesc>,
  client_id: string
) {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORDTOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(client_id), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error : " + error);
  }
}
