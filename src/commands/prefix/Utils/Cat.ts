import axios from "axios";
import { Manager } from "../../../manager.js";
import { EmbedBuilder, AttachmentBuilder, Message } from "discord.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "cat";
  description = "Sends a random cat image";
  category = "Utils";
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
    try {
      const msg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "cat_loading", {
                name: "Cat",
              })}`
            )
            .setColor(client.color),
        ],
      });

      const response = await axios.get("https://cataas.com/cat/cute", {
        responseType: "arraybuffer",
      });

      if (!response || !response.data) {
        throw new Error("Failed to fetch cat image");
      }

      const catAttachment = new AttachmentBuilder(response.data, {
        name: "mewscat.png",
      });

      const catEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Mews Cat!`,
          url: client.config.bot.SERVER_SUPPORT,
        })
        .setImage("attachment://mewscat.png")
        .setColor(client.color);

      await msg.edit({
        embeds: [catEmbed],
        files: [catAttachment],
      });
    } catch (error) {
      client.logger.error(`Error fetching cat image: ${error}`);

      const errorEmbed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "utilities", "cat_error", {
            name: "cat",
          })}`
        )
        .setColor(client.color);

      await message.reply({
        embeds: [errorEmbed],
      });
    }
  }
}
