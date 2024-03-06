import {
  EmbedBuilder,
  CommandInteraction,
  TextChannel,
  ApplicationCommandOptionType,
  CommandInteractionOptionResolver,
} from "discord.js";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

export default class implements SlashCommand {
  name = ["update"];
  description = "Launch the bot update informations!";
  category = "Admin";
  accessableby = Accessableby.Owner;
  lavalink = false;
  options = [
    {
      name: "description",
      description: "The description of your update",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ];

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });

    const input = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("description");

    // Get the channel to send the message
    const channelId = client.config.features.UPDATE_CHANNEL_ID;
    const channel = interaction.guild?.channels.cache.get(
      channelId
    ) as TextChannel;

    if (!channel) {
      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "info", "update_failure")}`
        );

      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Send a message to the specified channel
    try {
      await channel.send(`${input}`);
      const successEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "info", "update_success")}`
        );

      return interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      client.logger.error("Error sending update:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "info", "update_failure")}`
        );

      return interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}
