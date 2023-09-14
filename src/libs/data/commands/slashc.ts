import {
  APIMessageActionRowComponent,
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  CommandInteraction,
} from "discord.js";
import { quoteArr } from "../suntzu";

export async function pong(interaction: CommandInteraction) {
  await interaction.reply({ content: "Pong!", ephemeral: true });
}

export async function sunquote(interaction: CommandInteraction) {
  const ind = Math.random() * quoteArr.length;
  await interaction.reply({
    content: quoteArr.at(ind)!.quote,
    ephemeral: true,
  });
}

export async function vote(interaction: CommandInteraction) {
  //const g = await interaction.deferReply();
  console.log(interaction.options.get("question"));

  const cds = interaction.options
    .get("candidates")
    ?.value?.toString()
    .split(" ")!;
  const row = new ActionRowBuilder<any>();
  const votesList = {};

  cds.forEach((x: string) => {
    const button = new ButtonBuilder({
      custom_id: `${x}`,
      style: ButtonStyle.Primary,
      label: `${x}`,
    });
    votesList[x] = 0;
    row.addComponents(button);
  });

  await interaction.reply({
    content: `Question : \n\`\`\`${interaction.options.get("question")
      ?.value}\`\`\` `,
    components: [row],
  });
}
