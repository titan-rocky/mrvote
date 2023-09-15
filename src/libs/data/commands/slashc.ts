import {
  APIMessageActionRowComponent,
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
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

  const deadLine = 60 * 60 * 100;
  const cds = interaction.options
    .get("candidates")
    ?.value?.toString()
    .split(" ")!;
  const row = new ActionRowBuilder<any>();

  const voteSpan: any = {};

  cds.forEach((x: string) => {
    const button = new ButtonBuilder({
      custom_id: `${interaction.id}_${x}`,
      style: ButtonStyle.Primary,
      label: `${x}`,
    });
    row.addComponents(button);
    voteSpan[`${interaction.id}_${x}`] = { votes: 0, label: x };
  });

  const response = await interaction.reply({
    content: `Question : \n### ${
      interaction.options.get("question")?.value
    }\n Below are the options`,
    components: [row],
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: deadLine,
  });

  collector.on("collect", async (res) => {
    await res.reply({
      content: `You have selected ${res.component.label}`,
      ephemeral: true,
    });
    voteSpan[`${res.customId}`].votes += 1;
  });
  setTimeout(() => {
    let maxV: Array<any> = [{ votes: -1 }];
    const resStr = (() => {
      let s = "# The Results :\n";
      for (let i in voteSpan) {
        if (voteSpan[i].votes > maxV[0].votes) {
          maxV = [voteSpan[i]];
        } else if (voteSpan[i].votes === maxV[0].votes) {
          maxV = [...maxV, voteSpan[i]];
        }
        s = s + `* ${voteSpan[i].label} : ${voteSpan[i].votes}\n`;
      }
      return s;
    })();
    let mes1 = maxV.reduce(
      (acc: string, cur) => acc + `***${cur.label}*** and `,
      ""
    );
    mes1 = mes1.slice(0, -3);
    const questionString = interaction.options.get("question")?.value;

    interaction.editReply({
      content: `
        Voting Results :\n### Question : \`\`\`${questionString!}\`\`\`\n${
        maxV.length > 1
          ? `Tie : ${mes1}`
          : `Majority : ***${maxV[0].label}***\n *\(${maxV[0].votes} votes\)*`
      }
        `,
      components: [],
    });
    //interaction.followUp(resStr);
  }, deadLine);
}
