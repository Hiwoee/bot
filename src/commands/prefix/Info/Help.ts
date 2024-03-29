import { Manager } from "../../../manager.js";
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";
import { readdirSync } from "fs";
import { stripIndents } from "common-tags";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default class implements PrefixCommand {
  name = "help";
  description = "Displays all commands that the bot has.";
  category = "Info";
  usage = "+ <commamnd_name>";
  accessableby = Accessableby.Member;
  aliases = ["h"];
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    if (args[0]) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.guild!.members.me!.displayName} Help Command!`,
          iconURL: message.guild!.iconURL() as string,
        })
        .setDescription(`The bot prefix is: \`${prefix} or /\``)
        .setThumbnail(client.user!.displayAvatarURL({ size: 2048 }))
        .setColor(client.color);

      let command = client.commands.get(
        client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase()
      );
      if (!command)
        return message.reply({
          embeds: [
            embed
              .setTitle("Invalid Command.")
              .setDescription(
                `Do \`${prefix}help\` for the list of the commands.`
              ),
          ],
        });

      embed.setDescription(stripIndents`The client's prefix is: \`${prefix}\`\n
            **Command:** ${
              command.name.slice(0, 1).toUpperCase() + command.name.slice(1)
            }
            **Description:** ${
              command.description || "No Description provided."
            }
            **Usage:** ${
              command.usage
                ? `\`${prefix}${command.name} ${command.usage}\``
                : "No Usage"
            }
            **Accessible by:** ${command.accessableby}
            **Aliases:** ${
              command.aliases && command.aliases.length !== 0
                ? command.aliases.join(", ")
                : "None."
            }`);

      return message.reply({ embeds: [embed] });
    }

    const category = readdirSync(join(__dirname, "..", "..", "prefix"));

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.guild!.members.me!.displayName} Help Menu!`,
        url: client.config.bot.SERVER_SUPPORT,
        iconURL: client.user!.displayAvatarURL() as string,
      })
      .setTitle(`${client.i18n.get(language, "help", "homepage_title")}`)
      .setDescription(
        `${client.i18n.get(language, "help", "homepage_desc", {
          patreon: client.config.bot.PATREON_URL,
        })}`
      )
      .setImage(client.config.bot.IMGURL_HELPMENU)
      .setColor(client.color);

    const button = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite Me")
          .setEmoji(client.config.Emoji.E_INVITE || "📨")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.INVITE_URL)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support")
          .setEmoji(client.config.Emoji.E_SUPPORT || "💬")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.SERVER_SUPPORT)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Vote Me")
          .setEmoji(client.config.Emoji.E_VOTE || "👍")
          .setStyle(ButtonStyle.Link)
          .setURL(client.config.bot.VOTEURL)
      );

    const selectmenu =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
        new StringSelectMenuBuilder()
          .setCustomId("help-category")
          .setPlaceholder(
            `${client.i18n.get(language, "utilities", "help_desc")}`
          )
          .setMaxValues(1)
          .setMinValues(1)
          /// Map the category to the select menu
          .setOptions([
            new StringSelectMenuOptionBuilder()
              .setLabel("Home")
              .setValue("Home")
              .setEmoji(client.config.Emoji.E_HOME || "🏠"),
            // Category: info
            new StringSelectMenuOptionBuilder()
              .setLabel("Info")
              .setValue("Info")
              .setEmoji(client.config.Emoji.E_INFO || "📚"),
            // Category: settings
            new StringSelectMenuOptionBuilder()
              .setLabel("Settings")
              .setValue("Settings")
              .setEmoji(client.config.Emoji.E_SETTING || "⚙️"),
            // Category: music
            new StringSelectMenuOptionBuilder()
              .setLabel("Music")
              .setValue("Music")
              .setEmoji(client.config.Emoji.E_MUSIC || "🎵"),
            // Category: filter
            new StringSelectMenuOptionBuilder()
              .setLabel("Filter")
              .setValue("Filter")
              .setEmoji(client.config.Emoji.E_FILTER || "🎤"),
            // Category: playlist
            new StringSelectMenuOptionBuilder()
              .setLabel("Playlist")
              .setValue("Playlist")
              .setEmoji(client.config.Emoji.E_PLAYLIST || "🎧"),
            // Category: admin
            new StringSelectMenuOptionBuilder()
              .setLabel("Admin")
              .setValue("Admin")
              .setEmoji(client.config.Emoji.E_ADMIN || "🛡️"),
            // Category: admin
            new StringSelectMenuOptionBuilder()
              .setLabel("Utils")
              .setValue("Utils")
              .setEmoji(client.config.Emoji.E_UTILS || "🛡️"),
            new StringSelectMenuOptionBuilder()
              .setLabel("All Commands")
              .setValue("All")
              .setEmoji(client.config.Emoji.E_ALLCMD || "🗒️"),
          ]),
      ]);

    message
      .reply({ embeds: [embed], components: [selectmenu, button] })
      .then(async (msg) => {
        let collector = await msg.createMessageComponentCollector({
          filter: (i) =>
            i.isStringSelectMenu() &&
            i.user &&
            i.message.author.id == client.user!.id &&
            i.user.id == message.author.id,
          time: 60000,
        });
        collector.on("collect", async (m) => {
          if (m.isStringSelectMenu()) {
            if (m.customId === "help-category") {
              await m.deferUpdate();
              const [directory] = m.values;

              if (directory === "All") {
                const categoriesAndCommands = client.commands.reduce(
                  (accumulator, command) => {
                    if (!accumulator[command.category]) {
                      accumulator[command.category] = [];
                    }
                    accumulator[command.category].push(`\`${command.name}\``);
                    return accumulator;
                  },
                  {} as { [key: string]: string[] }
                );

                const embed = new EmbedBuilder()
                  .setAuthor({
                    name: `${
                      message.guild!.members.me!.displayName
                    } Help Menu!`,
                    url: client.config.bot.SERVER_SUPPORT,
                    iconURL: client.user!.displayAvatarURL() as string,
                  })
                  .setDescription(`Bot prefix is: \`${prefix} or /\``)
                  .setImage(client.config.bot.IMGURL_COMMANDMENU)
                  .setColor(client.color);

                for (const [category, commands] of Object.entries(
                  categoriesAndCommands
                )) {
                  const commandList = commands.join(", ");
                  embed.addFields({
                    name: `${category.toUpperCase()}`,
                    value: commandList,
                    inline: false,
                  });
                }

                msg.edit({ embeds: [embed] });
              } else if (directory === "Home") {
                msg.edit({ embeds: [embed], components: [selectmenu, button] });
              } else {
                const filteredCommands = client.commands.filter(
                  (c) => c.category === directory
                );
                const embed = new EmbedBuilder()
                  .setDescription(`Bot prefix is: \`${prefix} or /\``)
                  .setImage(client.config.bot.IMGURL_COMMANDMENU)
                  //                .setThumbnail(client.user!.displayAvatarURL({ size: 2048 }))
                  .setColor(client.color);

                if (filteredCommands.size > 0) {
                  const commandList = filteredCommands
                    .map((c) => `\`${c.name}\``)
                    .join(", ");
                  embed.addFields({
                    name: `❯  ${directory.toUpperCase()} Commands`,
                    value: commandList,
                    inline: false,
                  });
                  //                  .setFooter({
                  //                    text: `© ${
                  //                      interaction.guild!.members.me!.displayName
                  //                    } ${client.i18n.get(
                  //                      language,
                  //                      "info",
                  //                      "footer"
                  //                    )} | Total Commands: ${client.slash.size}`,
                  //                    iconURL: client.user!.displayAvatarURL(),
                  //                  });
                } else {
                  embed.addFields({
                    name: `❯  ${directory.toUpperCase()} [0]`,
                    value: "No commands found.",
                    inline: false,
                  });
                }
                msg.edit({ embeds: [embed] });
              }
            }
          }
        });

        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            const timedMessage = `${client.i18n.get(
              language,
              "utilities",
              "help_timeout",
              {
                prefix: prefix,
              }
            )}`;
            selectmenu.components[0].setDisabled(true);

            msg.edit({
              content: timedMessage,
              embeds: [embed],
              components: [selectmenu, button],
            });
          }
        });
      });
  }
}
