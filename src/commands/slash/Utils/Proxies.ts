import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";
import {
  AttachmentBuilder,
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import axios from "axios";

const PROXY_TYPES = ["all", "http", "socks4", "socks5"];

export default class implements SlashCommand {
  name = ["get", "proxy"];
  description = "Fetch proxies. Available types: all, http, socks4, socks5";
  category = "Utils";
  accessableby = Accessableby.Member;
  lavalink = false;
  options = [
    {
      name: "type",
      description: "Type of proxy",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: PROXY_TYPES.map((p) => ({ name: p, value: p })),
    },
  ];

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });
    try {
      const type = (
        interaction.options as CommandInteractionOptionResolver
      )?.getString("type")!;

      if (!PROXY_TYPES.includes(type)) {
        const embedType = new EmbedBuilder().setDescription(
          `${client.i18n.get(language, "utilities", "invalid_proxies")}`
        );
        return interaction.reply({ embeds: [embedType], ephemeral: true });
      }

      const response = await axios.get(
        `https://api.proxyscrape.com/?request=displayproxies&proxytype=${type}&timeout=10000&country=all&anonymity=all&ssl=all`
      );

      const proxies = response.data.trim(); // Trim the response

      if (!proxies) {
        const embedError = new EmbedBuilder().setDescription(
          client.i18n.get(language, "utilities", "error_proxies")
        );
        return interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      const attachment = new AttachmentBuilder(Buffer.from(proxies), {
        name: `${type.toLowerCase()}_proxies.txt`,
      });

      await interaction.followUp({
        content: `**${type.toUpperCase()}** Proxies fetched`,
        files: [attachment],
      });
    } catch (error) {
      client.logger.error("Error in run method");
      const errorEmbed = new EmbedBuilder().setDescription(
        client.i18n.get(language, "utilities", "error_proxies")
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}
