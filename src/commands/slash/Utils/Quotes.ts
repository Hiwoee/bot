import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import axios from "axios";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

export default class implements SlashCommand {
  name = ["get", "quote"];
  description = "Sends a random Quote";
  category = "Utils";
  options = [
    {
      name: "category",
      description: "Select a category for the quote",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Love", value: "love" },
        { name: "Dreams", value: "dreams" },
        { name: "Equality", value: "equality" },
        { name: "God", value: "god" },
        { name: "Friendship", value: "friendship" },
        { name: "Hope", value: "hope" },
        { name: "Life", value: "life" },
      ],
    },
  ];
  lavalink = false;
  accessableby = Accessableby.Member;

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    let loadingMsg: any;

    try {
      await interaction.deferReply({ ephemeral: false });

      const category = (
        interaction.options as CommandInteractionOptionResolver
      ).getString("category");

      loadingMsg = await interaction.editReply({
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
        `https://api.api-ninjas.com/v1/quotes?category=${category}`,
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
            name: `Quote Off The Wall - ${category}`,
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
        await loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${client.i18n.get(language, "utilities", "quote_error", {
                  name: "Quote",
                })}`
              )
              .setColor(client.color),
          ],
        });
      }
    } catch (error) {
      client.logger.error("Error fetching quotes, check API KEY");
      await loadingMsg.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "quote_error", {
                name: "Quote",
              })}`
            )
            .setColor(client.color),
        ],
      });
    }
  }
}
