import { EmbedBuilder, Message } from "discord.js";
import { Radiostations } from "../../../assets/radioLink.js";
import { ConvertTime } from "../../../structures/ConvertTime.js";
import { Manager } from "../../../manager.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

// Main code
export default class implements PrefixCommand {
  name = "radio";
  description = "Play radio in voice channel";
  category = "Music";
  usage = "";
  aliases = [];
  lavalink = true;
  accessableby = Accessableby.Member;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${client.i18n.get(language, "music", "radio_loading")}`
          )
          .setColor(client.color),
      ],
    });

    const value = args[0];
    if (value && isNaN(+value))
      return msg.edit(
        `${client.i18n.get(language, "music", "number_invalid")}`
      );

    const { channel } = message.member!.voice;
    if (!channel)
      return msg.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "noplayer", "no_voice")}`
            )
            .setColor(client.color),
        ],
      });

    const resultsEmbed = new EmbedBuilder()
      .setTitle(`${client.i18n.get(language, "radio", "available_radio")}`) //
      .setDescription(
        `${client.i18n.get(language, "radio", "prefix", {
          prefix: `\`${prefix}\``,
        })}`
      )

      .addFields([
        {
          name: `***🇮🇩 Indonesia RADIO***`,
          value: `**1:  ** [\`${Radiostations[1 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
              **2:  ** [\`${Radiostations[2 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **3:  ** [\`${Radiostations[3 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **4:  ** [\`${Radiostations[4 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **5:  ** [\`${Radiostations[5 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              `,
          inline: true,
        },
        {
          name: `***🇮🇩 Indonesia RADIO***`,
          value: `**6:  ** [\`${Radiostations[6 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
              **7:  ** [\`${Radiostations[7 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **8:  ** [\`${Radiostations[8 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **9:  ** [\`${Radiostations[9 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              **10: ** [\`${Radiostations[10 - 1].split(" ")[0]}\`](${
                client.config.bot.SERVER_SUPPORT
              })
              `,
          inline: true,
        },
        {
          name: `***🇮🇩 Indonesia RADIO***`,
          value: `
            **11: ** [\`${Radiostations[11 - 1].split(" ")[0]}\`](${
              client.config.bot.SERVER_SUPPORT
            })
            **12: ** [\`${Radiostations[12 - 1].split(" ")[0]}\`](${
              client.config.bot.SERVER_SUPPORT
            })
            **13: ** [\`${Radiostations[13 - 1].split(" ")[0]}\`](${
              client.config.bot.SERVER_SUPPORT
            })
            **14: ** [\`${Radiostations[14 - 1].split(" ")[0]}\`](${
              client.config.bot.SERVER_SUPPORT
            })
            **15: ** [\`${Radiostations[15 - 1].split(" ")[0]}\`](${
              client.config.bot.SERVER_SUPPORT
            })
          `,
          inline: true,
        },
        {
          name: `***🇫🇷 France RADIO:***`,
          value: ` **16: ** [\`${Radiostations[16 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
      **17: ** [\`${Radiostations[17 - 1].split(" ")[0]}\`](${
        client.config.bot.SERVER_SUPPORT
      })`,
          inline: true,
        },
        {
          name: `***🇮🇹 Italy RADIO:***`,
          value: `**18: ** [\`${Radiostations[18 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
      **19: ** [\`${Radiostations[19 - 1].split(" ")[0]}\`](${
        client.config.bot.SERVER_SUPPORT
      })`,
          inline: true,
        },

        {
          name: `***🇬🇧 British RADIO:***`,
          value: `**20: ** [\`${Radiostations[20 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
      **21: ** [\`${Radiostations[21 - 1].split(" ")[0]}\`](${
        client.config.bot.SERVER_SUPPORT
      })`,
          inline: true,
        },
        {
          name: `***🇪🇸 Spain RADIO:***`,
          value: `**22: ** [\`${Radiostations[22 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
      **23: ** [\`${Radiostations[23 - 1].split(" ")[0]}\`](${
        client.config.bot.SERVER_SUPPORT
      })`,
          inline: true,
        },
        {
          name: `***🇨🇿 Czech RADIO:***`,
          value: `**24: ** [\`${Radiostations[24 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
          **25: ** [\`${Radiostations[25 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })`,
          inline: true,
        },

        {
          name: `***🇳🇱 Netherlands RADIO:***`,
          value: `**26: ** [\`${Radiostations[26 - 1].split(" ")[0]}\`](${
            client.config.bot.SERVER_SUPPORT
          })
      **27: ** [\`${Radiostations[27 - 1].split(" ")[0]}\`](${
        client.config.bot.SERVER_SUPPORT
      })`,
          inline: true,
        },
      ])
      .setColor(client.color)
      .setFooter({ text: `/radio <1-27>` });

    if (!value) {
      return msg.edit({ content: " ", embeds: [resultsEmbed] });
    } else if (Number(value) > 27 || Number(value) < 0) {
      return msg.edit({ content: " ", embeds: [resultsEmbed] });
    }

    const player = await client.manager.createPlayer({
      guildId: message.guild!.id,
      voiceId: message.member!.voice.channel!.id,
      textId: message.channel.id,
      deaf: true,
    });

    let i;

    for (i = 1; i <= 1 + Radiostations.length; i++) {
      if (Number(value) === Number(i)) {
        break;
      }
    }

    const args2 = Radiostations[i - 1].split(` `);

    const song = args2[1];

    const res = await player.search(song, { requester: message.author });

    if (res.type == "TRACK") {
      player.queue.add(res.tracks[0]);
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "music", "play_track", {
            title: args2[0],
            url: String(res.tracks[0].uri),
            duration: new ConvertTime().parse(res.tracks[0].length as number),
            request: String(res.tracks[0].requester),
            serversupport: String(client.config.bot.SERVER_SUPPORT),
          })}`
        )
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [embed] });
      if (!player.playing) player.play();
    }
  }
}
