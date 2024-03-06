import {
  EmbedBuilder,
  AttachmentBuilder,
  CommandInteraction,
  ApplicationCommandOptionType,
  CommandInteractionOptionResolver,
} from "discord.js";
import axios from "axios";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

export default class implements SlashCommand {
  name = ["cat"];
  description = "Sends a random cat image";
  category = "Utils";
  options = [
    {
      name: "category",
      description: "Select a category for the quote",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Cute", value: "cute" },
        { name: "Sad", value: "sad" },
        { name: "Sleepy", value: "sleepy" },
        { name: "Gray", value: "gray" },
        { name: "Angry", value: "angry" },
        { name: "Orange", value: "orange" },
        { name: "Baby", value: "baby" },
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
    try {
      await interaction.deferReply({ ephemeral: false });

      const category = (
        interaction.options as CommandInteractionOptionResolver
      ).getString("category");

      const loadingEmbed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "utilities", "cat_loading", {
            name: "Cat",
          })}`
        )
        .setColor(client.color);

      const msg = await interaction.editReply({
        embeds: [loadingEmbed],
      });

      const response = await axios.get(`https://cataas.com/cat/${category}`, {
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
          name: `Mews Cat - ${category}`,
          url: client.config.bot.SERVER_SUPPORT,
        })
        .setImage("attachment://mewscat.png")
        .setColor(client.color);

      await msg.edit({
        embeds: [catEmbed],
        files: [catAttachment],
      });
    } catch (error) {
      client.logger.error(`Error fetching cat image`);

      const errorEmbed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "utilities", "cat_error", {
            name: "cat",
          })}`
        )
        .setColor(client.color);

      await interaction.editReply({
        embeds: [errorEmbed],
      });
    }
  }
}
