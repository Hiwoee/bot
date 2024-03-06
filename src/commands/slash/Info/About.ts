import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  ButtonStyle,
} from "discord.js";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

export default class implements SlashCommand {
  name = ["about"];
  description = "Shows the developer information of the Bot (Credit)";
  category = "Info";
  lavalink = false;
  options = [];
  accessableby = Accessableby.Member;

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });
    const aboutembed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild!.members.me!.displayName} About`,
        url: client.config.bot.SERVER_SUPPORT,
        iconURL: client.user!.displayAvatarURL() as string,
      })
      .setFooter({ text: `${client.i18n.get(language, "info", "dev_foot")}` })
      .addFields(
        {
          name: "Creator",
          value: `**[${client.config.bot.DEVELOPER}](${client.config.bot.DEVELOPER_URL})**`,
          inline: true,
        },
        {
          name: "Type",
          value: "**Music bot**",
          inline: true,
        },
        {
          name: "Sponsor",
          value: `**[Patreon](${client.config.bot.PATREON_URL})**`,
          inline: true,
        }
      )
      .setThumbnail(client.user!.displayAvatarURL({ size: 2048 }))
      .setImage(client.config.bot.IMGURL_COMMANDMENU)
      .setColor(client.color);

    const aboutbutton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite Me")
          .setEmoji(client.config.Emoji.E_INVITE || "📨")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.INVITE_URL)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Server Support")
          .setEmoji(client.config.Emoji.E_SUPPORT || "💬")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.SERVER_SUPPORT)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Vote")
          .setEmoji(client.config.Emoji.E_VOTE || "👍")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.VOTEURL)
      );

    await interaction.editReply({
      embeds: [aboutembed],
      components: [aboutbutton],
    });
  }
}
