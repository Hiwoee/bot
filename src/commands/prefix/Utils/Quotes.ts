import axios from "axios";
import { Manager } from "../../../manager.js";
import { EmbedBuilder, Message } from "discord.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "quote";
  description = "Sends a random Quote";
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
      const loadingMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "quote_loading", {
                name: "Quote",
              })}`
            )
            .setColor(client.color),
        ],
      });

      const response = await axios.get(
        `https://api.api-ninjas.com/v1/quotes?category=love`,
        {
          headers: {
            "X-Api-Key": client.config.bot.QUOTES_API_KEY,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const quoteData = response.data[0];

        const quoteEmbed = new EmbedBuilder()
          .setAuthor({
            name: `Quote Off The Wall!`,
            url: client.config.bot.SERVER_SUPPORT,
          })
          .setDescription(
            `\`\`\`${quoteData.quote} \nBy - ${quoteData.author}\`\`\``
          )
          .setColor(client.color);

        await loadingMsg.edit({
          embeds: [quoteEmbed],
        });
      } else {
        client.logger.error("Invalid API response format");
        throw new Error(client.i18n.get(language, "utilities", "quote_error"));
      }
    } catch (error) {
      client.logger.error("Error fetching quotes");
      // Send an error message to the user
      message.reply(client.i18n.get(language, "utilities", "quote_error"));
    }
  }
}
