import { ButtonStyle, Message, Client } from "discord.js";
import { Manager } from "../../../manager.js";
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  version,
} from "discord.js";
import os from "os";
import ms from "pretty-ms";
import { stripIndents } from "common-tags";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "status";
  description = "Shows the status information of the Bot";
  category = "Info";
  accessableby = Accessableby.Member;
  usage = "";
  aliases = [];
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const cpuCores = os.cpus().length; // Number of CPU cores
    const total = os.totalmem() / 1024 / 1024;
    const used = process.memoryUsage().rss / 1024 / 1024;

    const statusembed = new EmbedBuilder()
      .setAuthor({
        name: `${message.guild!.members.me!.displayName} Status`,
        url: client.config.bot.SERVER_SUPPORT,
        iconURL: client.user!.displayAvatarURL() as string,
      })
      .addFields([
        {
          name: "Uptime",
          value: `\`\`\`${ms(client.uptime as number)}\`\`\``,
          inline: true,
        },
        {
          name: "WebSocket Ping",
          value: `\`\`\`${client.ws.ping}ms\`\`\``,
          inline: true,
        },
        {
          name: "Memory",
          value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(
            2
          )} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )} MB Heap\`\`\``,
          inline: true,
        },
        {
          name: "Guild Count",
          value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``,
          inline: true,
        },
        {
          name: "User Count",
          value: `\`\`\`${client.guilds.cache.reduce(
            (a, b) => a + b.memberCount,
            0
          )}\`\`\``,
          inline: true,
        },
        {
          name: "Node",
          value: `\`\`\`${process.version}\`\`\``,
          inline: true,
        },
        {
          name: "Cached Data",
          value: `\`\`\`${client.guilds.cache.reduce(
            (a, b) => a + b.memberCount,
            0
          )} users\n${client.emojis.cache.size} emojis\`\`\``,
          inline: true,
        },
        {
          name: "RAM Usage",
          value: `\`\`\`${used.toFixed(2)}/${total.toFixed(2)} (MB)\`\`\``,
          inline: true,
        },
        {
          name: "RAM Total",
          value: `\`\`\`${(total / 1024).toFixed(2)} GB\`\`\``,
          inline: true,
        },
        {
          name: "vCore",
          value: `\`\`\`${cpuCores}\`\`\``,
          inline: true,
        },
        {
          name: "OS",
          value: `\`\`\`${os.type()} ${os.release()} (${os.arch()})\`\`\``,
          inline: true,
        },
        { name: "Discord.js", value: `\`\`\`${version}\`\`\``, inline: true },
        {
          name: "Bot Version",
          value: `\`\`\`${client.metadata.version}\`\`\``,
          inline: true,
        },
        {
          name: "Autofix",
          value: `\`\`\`${client.metadata.autofix}\`\`\``,
          inline: true,
        },
        {
          name: "Codename",
          value: `\`\`\`${client.metadata.codename}\`\`\``,
          inline: true,
        },
      ])
      .setColor(client.color);
    //      .setFooter({
    //        text: `© ${message.guild!.members.me!.displayName} | ${client.i18n.get(
    //          language,
    //          "info",
    //          "footer"
    //        )}`,
    //      });

    const statusbutton = new ActionRowBuilder<ButtonBuilder>()
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
    await message.reply({ embeds: [statusembed], components: [statusbutton] });
  }
}
