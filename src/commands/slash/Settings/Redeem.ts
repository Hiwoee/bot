import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  WebhookClient,
} from "discord.js";
import moment from "moment";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

export default class implements SlashCommand {
  name = ["redeem"];
  description = "Redeem your premium!";
  category = "Settings";
  accessableby = Accessableby.Member;
  lavalink = false;
  options = [
    {
      name: "code",
      description: "The code you want to redeem",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "user",
      description: "The user to redeem premium for",
      required: true,
      type: ApplicationCommandOptionType.User,
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
    ).getString("code");

    const targetUser = (
      interaction.options as CommandInteractionOptionResolver
    ).getUser("user");

    if (!targetUser) {
      return interaction.editReply(
        "Please provide a valid user to redeem premium for."
      );
    }

    let member = await client.db.premium.get(`${targetUser.id}`);

    if (member && member.isPremium) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_already")}`
        );
      return interaction.editReply({ embeds: [embed] });
    }

    const premium = await client.db.code.get(`${input!.toUpperCase()}`);

    if (input == "pmc_mewwme")
      return interaction.editReply(
        "WU9VIENBTidUIERPIFRISVMgRk9SIEZSRUUgUFJFTUlVTQotIFJhaW55WGVvbiAt"
      );

    if (!premium) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_invalid")}`
        );
      return interaction.editReply({ embeds: [embed] });
    }

    if (premium.expiresAt < Date.now()) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_invalid")}`
        );
      return interaction.editReply({ embeds: [embed] });
    }

    const expires = moment(premium.expiresAt).format("dddd, MMMM Do YYYY");
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(language, "premium", "redeem_title")}`,
        iconURL: client.user!.displayAvatarURL(),
      })
      .setDescription(
        `${client.i18n.get(language, "premium", "redeem_desc", {
          expires: expires,
          plan: premium.plan,
        })}`
      )
      .setColor(client.color)
      .setTimestamp();

    const data = {
      id: targetUser.id,
      isPremium: true,
      redeemedBy: interaction.user,
      redeemedAt: Date.now(),
      expiresAt: premium.expiresAt,
      plan: premium.plan,
    };

    const profileURL = `https://discord.com/users/${targetUser.id}`;
    const webhook = new WebhookClient({
      url: client.config.ServerSupport.REDEEM_LOGS,
    });

    const embedForWebhook = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(language, "premium", "redeem_code")}`,
        iconURL: client.user!.displayAvatarURL(),
      })
      .setDescription(
        `${client.i18n.get(language, "premium", "profile_desc", {
          user: targetUser.tag,
          plan: premium.plan,
          expires: expires,
        })}\n\n` +
          `**User ID:** ${targetUser.id}\n` +
          `[**Profile Link**](${profileURL})`
      )
      .setColor(client.color)
      .setTimestamp();

    await webhook.send({ embeds: [embedForWebhook] });
    await client.db.premium.set(`${targetUser.id}`, data);
    await interaction.editReply({ embeds: [embed] });
    await client.premiums.set(targetUser.id, data);
    return client.db.code.delete(`${input!.toUpperCase()}`);
  }
}
