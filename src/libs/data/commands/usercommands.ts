import { CommandInteraction } from "discord.js";

export async function purge(interaction: CommandInteraction) {
  await interaction.reply({ content: "Purged!", ephemeral: true });
}
