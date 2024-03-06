import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import { Manager } from "../../../manager.js";
import axios from "axios";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

const PROXY_TYPES = ["all", "http", "socks4", "socks5"];

export default class implements PrefixCommand {
  name = "proxies";
  description = "Fetch proxies. Available types: all, http, socks4, socks5";
  category = "Utils";
  usage = "all, http, socks4, socks5";
  aliases = ["proxy", "prox"];
  accessableby = Accessableby.Member;
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    try {
      if (args.length === 0) {
        const embedUsage = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `${client.i18n.get(language, "utilities", "usage_proxies", {
              usage: `${prefix}proxies <type>`,
            })}`
          );

        return message.reply({ embeds: [embedUsage] });
      }

      const type = args[0].toLowerCase();

      if (!PROXY_TYPES.includes(type)) {
        const embedType = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `${client.i18n.get(language, "utilities", "invalid_proxies")}`
          );

        return message.reply({ embeds: [embedType] });
      }

      const response = await axios.get(
        `https://api.proxyscrape.com/?request=displayproxies&proxytype=${type}&timeout=10000&country=all&anonymity=all&ssl=all`
      );

      const proxies = response.data.trim(); // Trim the response

      if (!proxies) {
        return message.reply(
          client.i18n.get(language, "utilities", "error_proxies")
        );
      }

      const attachment = new AttachmentBuilder(Buffer.from(proxies), {
        name: `${type}_proxies.txt`,
      });

      message.reply({
        content: `**${type.toUpperCase()}** Proxies fetched`,
        files: [attachment],
      });
    } catch (error) {
      client.logger.error("Error in 'proxies' command:", error);
      const errorEmbed = new EmbedBuilder().setDescription(
        client.i18n.get(language, "utilities", "error_proxies")
      );
      message.reply({ embeds: [errorEmbed] });
    }
  }
}
