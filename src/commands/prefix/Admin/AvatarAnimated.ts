import { Attachment, Message, EmbedBuilder } from "discord.js";
import { Manager } from "../../../manager.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

// Main code
export default class implements PrefixCommand {
  name = "animated-avatar";
  description = "Change avatar of the bot with animated";
  category = "Admin";
  usage = "";
  aliases = ["ava", "new-ava"];
  accessableby = Accessableby.Owner;
  lavalink = true;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    try {
      const avatar: Attachment | undefined = message.attachments.first();
      if (!avatar) {
        return message.reply({
          content: "Please provide a GIF image attachment.",
        });
      }

      // Menampilkan pesan sementara
      const loadingMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "new_avatar_loading")}`
            )
            .setColor(client.color),
        ],
      });

      if (!avatar || avatar.contentType !== "image/gif") {
        return loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${client.i18n.get(language, "utilities", "new_avatar_not_gif")}`
              )
              .setColor(client.color),
          ],
        });
      }

      // Mengubah avatar bot dengan gambar yang diberikan
      await client.user?.setAvatar(avatar.url);

      // Memberi tahu bahwa avatar telah berhasil diubah dengan mengedit pesan loading
      await loadingMsg.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "new_avatar_success")}`
            )
            .setColor(client.color),
        ],
      });
    } catch (error) {
      // Tangani kesalahan
      client.logger.error("Error changing avatar:", error);
      await message.reply({
        content: "An error occurred while changing the avatar.",
      });
    }
  }
}
