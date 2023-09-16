import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  time,
} from "discord.js";
import { quoteArr } from "../suntzu";
import { reshape } from "../../utills";

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
  //Time Duration in milliseconds
  const deadLine = 60_000; //60 * 60 * 100;

  //Vote Counter Table
  const voteSpan: any = {};

  //The elements to vote in the poll
  const cds = interaction.options
    .get("candidates")
    ?.value?.toString()
    .split(",")
    .map((element) => {
      const label = element.trimEnd().trimStart();

      const button = new ButtonBuilder({
        custom_id: `${interaction.id}_${label.toLowerCase()}`,
        style: ButtonStyle.Primary,
        label: `${label}`,
      });
      voteSpan[`${interaction.id}_${label.toLowerCase()}`] = {
        votes: 0,
        label: label,
      };
      return button;
    })!;

  //Remainder (5 buttons per row)
  const rowRem = 5;

  //Reshapes the buttons into 5 per row
  let candidates = reshape(cds, rowRem);

  candidates.forEach((elm, index, arr) => {
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(elm);
    arr[index] = row;
  });

  const response = await interaction.reply({
    content: `Question : \n### ${
      interaction.options.get("question")?.value
    }\n Below are the options`,
    components: candidates,
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: deadLine,
  });
  let votedPeople: { [key: string]: string } = {};
  collector.on("collect", async (res) => {
    if (votedPeople[res.user.id]) {
      await res.reply({
        content: `You have already selected ${votedPeople[res.user.id]}`,
        ephemeral: true,
      });
    } else {
      votedPeople[res.user.id] = res.component.label!;
      await res.reply({
        content: `You have selected ${res.component.label}`,
        ephemeral: true,
      });
      voteSpan[`${res.customId}`].votes += 1;
    }
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
    mes1 = mes1.slice(0, -4);
    const questionString = interaction.options.get("question")?.value;

    interaction.editReply({
      content: `
        Voting Results :\n### Question :\n## ${questionString!}\n### Result :\n${
        maxV.length > 1
          ? `Tie : ${mes1}\n *${maxV[0].votes} vote(s)*`
          : `Majority : ***${maxV[0].label}***\n *${maxV[0].votes} vote(s)*`
      }
        > Created at ${time(interaction.createdAt, "D")}
        `,
      components: [],
    });
    //interaction.followUp(resStr);
  }, deadLine);
}
