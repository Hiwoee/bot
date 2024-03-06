import {
  ChannelType,
  Message,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import { Manager } from "../../manager.js";
import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { stripIndents } from "common-tags";
import fs from "fs";
import { Accessableby } from "../../@types/Command.js";

export default class {
  async execute(client: Manager, message: Message) {
    if (message.author.bot || message.channel.type == ChannelType.DM) return;

    if (!client.isDatabaseConnected)
      return client.logger.warn(
        "The database is not yet connected so this event will temporarily not execute. Please try again later!"
      );

    let guildModel = await client.db.language.get(`${message.guild!.id}`);
    if (!guildModel) {
      guildModel = await client.db.language.set(
        `${message.guild!.id}`,
        client.config.bot.LANGUAGE
      );
    }

    const language = guildModel;

    let PREFIX = client.prefix;

    const mention = new RegExp(`^<@!?${client.user!.id}>( |)$`);

    const GuildPrefix = await client.db.prefix.get(`${message.guild!.id}`);
    if (GuildPrefix) PREFIX = GuildPrefix;
    else if (!GuildPrefix) {
      await client.db.language.set(`${message.guild!.id}`, client.prefix);
      const newPrefix = await client.db.language.get(`${message.guild!.id}`);
      PREFIX = String(newPrefix);
    }

    if (message.content.match(mention)) {
      const mention_embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.guild!.members.me!.displayName} Guide!`,
          url: client.config.bot.SERVER_SUPPORT,
          iconURL: client.user!.displayAvatarURL() as string,
        })
        .setColor(client.color)
        .setDescription(
          stripIndents`
      ${client.i18n.get(language, "help", "intro1", {
        bot: message.guild!.members.me!.displayName,
      })}
      ${client.i18n.get(language, "help", "prefix", {
        prefix: PREFIX,
        website: client.config.bot.WEBSITE_URL,
      })}
      ${client.i18n.get(language, "help", "intro2", {
        prefix: PREFIX,
        serversupport: client.config.bot.SERVER_SUPPORT,
        website: client.config.bot.WEBSITE_URL,
        bot: client.user!.username,
      })}
    `
        )
        .setImage(client.config.bot.IMGURL_HELPMENU);

      const mentionbutton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setLabel("Invite Me")
            .setEmoji(client.config.Emoji.E_INVITE)
            .setStyle(ButtonStyle.Link)
            .setURL(client.config.bot.INVITE_URL)
        )
        .addComponents(
          new ButtonBuilder()
            .setLabel("Server Support")
            .setEmoji(client.config.Emoji.E_SUPPORT)
            .setStyle(ButtonStyle.Link)
            .setURL(client.config.bot.SERVER_SUPPORT)
        )
        .addComponents(
          new ButtonBuilder()
            .setLabel("Vote")
            .setEmoji(client.config.Emoji.E_VOTE)
            .setStyle(ButtonStyle.Link)
            .setURL(client.config.bot.VOTEURL)
        );
      await message.reply({
        embeds: [mention_embed],
        components: [mentionbutton],
      });
      return;
    }
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user!.id}>|${escapeRegex(PREFIX)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(
      prefixRegex
    ) as RegExpMatchArray;
    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift()!.toLowerCase();

    const command =
      client.commands.get(cmd) ||
      client.commands.get(client.aliases.get(cmd) as string);
    if (!command) return;

    if (
      !message.guild!.members.me!.permissions.has(
        PermissionsBitField.Flags.SendMessages
      )
    )
      return await message.author.dmChannel!.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(
                language,
                "interaction",
                "no_perms_sendmessage"
              )}`
            )
            .setColor(client.color),
        ],
      });
    if (
      !message.guild!.members.me!.permissions.has(
        PermissionsBitField.Flags.ViewChannel
      )
    )
      return;
    if (
      !message.guild!.members.me!.permissions.has(
        PermissionsBitField.Flags.EmbedLinks
      )
    )
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(
                language,
                "interaction",
                "no_perms_viewchannel"
              )}`
            )
            .setColor(client.color),
        ],
      });

    if (
      command.accessableby == Accessableby.Owner &&
      !client.owner.includes(message.author.id)
    )
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "interaction", "owner_only")}`
            )
            .setColor(client.color),
        ],
      });

    if (
      command.accessableby == Accessableby.Manager &&
      !message.member!.permissions.has(PermissionsBitField.Flags.ManageGuild)
    )
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "lang_perm")}`
            )
            .setColor(client.color),
        ],
      });

    try {
      if (command.accessableby == Accessableby.Premium) {
        const user = client.premiums.get(message.author.id);
        if (!user || !user.isPremium) {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `${client.i18n.get(
                language,
                "nopremium",
                "premium_author"
              )}`,
              iconURL: client.user!.displayAvatarURL(),
            })
            .setDescription(
              `${client.i18n.get(language, "nopremium", "premium_desc")}`
            )
            .setColor(client.color)
            .setTimestamp();

          return message.reply({ content: " ", embeds: [embed] });
        }
      }
    } catch (err) {
      client.logger.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "nopremium", "premium_error")}`
            )
            .setColor(client.color),
        ],
      });
    }

    if (command.lavalink && client.lavalinkUsing.length == 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "no_node")}`)
            .setColor(client.color),
        ],
      });
    }

    if (command) {
      try {
        command.run(client, message, args, language, PREFIX);
      } catch (error) {
        client.logger.error(error);
        message.reply({
          content: `${client.i18n.get(
            language,
            "interaction",
            "error"
          )}\n ${error}`,
        });
      }
    }
  }
}
