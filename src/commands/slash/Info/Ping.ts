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
  name = ["info", "ping"];
  description = "Shows the ping information of the Bot";
  category = "Info";
  options = [];
  lavalink = false;
  accessableby = Accessableby.Member;

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });
    const pingembed = new EmbedBuilder()
      .setTitle(
        `${client.i18n.get(language, "info", "ping_title")}` +
          client.user!.username
      )
      .setDescription(
        `${client.i18n.get(language, "info", "ping_desc", {
          ping: String(client.ws.ping),
        })}`
      )
      .setColor(client.color);
    const pingbutton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Me")
        .setEmoji(client.config.Emoji.E_INVITE || "📨")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.bot.INVITE_URL)
    );

    await interaction.editReply({
      embeds: [pingembed],
      components: [pingbutton],
    });
  }
}
