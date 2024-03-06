import { EmbedBuilder, Message, WebhookClient } from "discord.js";
import moment from "moment";
import { Manager } from "../../../manager.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "redeem";
  description = "Redeem your premium!";
  category = "Settings";
  accessableby = Accessableby.Member;
  usage = "<input>";
  aliases = [];
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const input = args[0];
    const mentionedUser = message.mentions.users.first();

    if (!input || !mentionedUser) {
      return message.reply({
        embeds: [
          new EmbedBuilder().setColor(client.color).setDescription(
            `${client.i18n.get(language, "premium", "redeem_required", {
              prefix: prefix,
            })}`
          ),
        ],
      });
    }

    let member = await client.db.premium.get(`${mentionedUser.id}`);

    if (member && member.isPremium) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_already")}`
        );
      return message.reply({ embeds: [embed] });
    }

    const premium = await client.db.code.get(`${input.toUpperCase()}`);

    if (!premium) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_invalid")}`
        );
      return message.reply({ embeds: [embed] });
    }

    if (premium.expiresAt < Date.now()) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${client.i18n.get(language, "premium", "redeem_invalid")}`
        );
      return message.reply({ embeds: [embed] });
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

    const new_data = {
      id: mentionedUser.id,
      isPremium: true,
      redeemedBy: message.author.tag,
      redeemedAt: Date.now(),
      expiresAt: premium.expiresAt,
      plan: premium.plan,
    };

    const embedForMentionedUser = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(language, "premium", "redeem_code")}`,
        iconURL: client.user!.displayAvatarURL(),
      })
      .setDescription(
        `${client.i18n.get(language, "premium", "profile_desc", {
          user: mentionedUser.tag,
          plan: premium.plan,
          expires: moment(premium.expiresAt).format("dddd, MMMM Do YYYY"),
        })}\n\n` +
          `**User ID:** ${mentionedUser.id}\n` +
          `[**Profile Link**](https://discord.com/users/${mentionedUser.id})`
      )
      .setColor(client.color)
      .setTimestamp();

    const webhook = new WebhookClient({
      url: client.config.ServerSupport.REDEEM_LOGS,
    });

    await webhook.send({ embeds: [embedForMentionedUser] });
    await client.db.premium.set(`${new_data.id}`, new_data);
    await message.reply({ embeds: [embed] });
    await client.db.code.delete(`${input.toUpperCase()}`);
    return client.premiums.set(String(mentionedUser.id), new_data);
  }
}
