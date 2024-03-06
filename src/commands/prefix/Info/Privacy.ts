import { ButtonStyle, Message } from "discord.js";
import { Manager } from "../../../manager.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "privacy";
  description = "Shows the privacy information of the Bot";
  category = "Info";
  accessableby = Accessableby.Member;
  usage = "";
  aliases = ["priv", "pp"];
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const privacyembed = new EmbedBuilder()
      .setAuthor({
        name: `${message.guild!.members.me!.displayName} Privacy Policy`,
        url: client.config.bot.SERVER_SUPPORT,
        iconURL: client.user!.displayAvatarURL() as string,
      })
      .setDescription(
        `${client.i18n.get(language, "info", "privacy", {
          bot: client.user!.username,
          serversupport: client.config.bot.SERVER_SUPPORT,
          developer: client.config.bot.DEVELOPER_URL,
        })}`
      )
      .setColor(client.color);
    //      .setFooter({
    //        text: `© ${message.guild!.members.me!.displayName} | ${client.i18n.get(
    //          language,
    //          "info",
    //          "footer"
    //        )}`,
    //      });

    const privacybutton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite Me")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.INVITE_URL)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Server Support")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.SERVER_SUPPORT)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Vote Me")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.VOTEURL)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Sponsor")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.PATREON_URL)
      );

    await message.reply({
      embeds: [privacyembed],
      components: [privacybutton],
    });
  }
}
