import { Accessableby, PrefixCommand } from "../../../@types/Command.js";
import { Manager } from "../../../manager.js";
import { EmbedBuilder, Message } from "discord.js";
import { createCanvas, loadImage } from "canvas"; // Use 'canvas' library
import { resolveImage } from "canvas-constructor"; // Use 'canvas-constructor' if needed

export default class implements PrefixCommand {
  name = "users";
  description = "Show your or someone else's profile info";
  category = "Utils";
  accessableby = Accessableby.Member;
  usage = "<mention>";
  aliases = ["user", "pfp"];
  lavalink = false;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "utilities", "arg_error", {
                text: "@mention",
              })}`
            )
            .setColor(client.color),
        ],
      });

    if (!message.guild) {
      return message.channel.send("This command can only be used in a server.");
    }

    // Fetch the guild member associated with the mentioned user
    const guildMember = message.guild.members.cache.get(mentionedUser.id);

    if (!guildMember) {
      return message.channel.send("User not found in the server.");
    }

    const canvas = createCanvas(754, 215);
    const ctx = canvas.getContext("2d");

    // Load your images here
    const img = await loadImage("profile.png"); // Replace 'ava.png' with the actual image path
    const userPfp = await loadImage(
      mentionedUser.displayAvatarURL({
        extension: "jpg",
        size: 1024,
      })
    );
    ctx.font = "bold 30px sans-serif"; // Font tebal dengan ukuran 30px
    ctx.drawImage(img, 0, 0, 754, 215);
    ctx.fillStyle = "#f4e0c7";
    // ...
    ctx.fillText(mentionedUser.tag, 278, 70); // Adjust coordinates

    // Check if guildMember.joinedAt is not null
    if (guildMember.joinedAt) {
      // Get the join date of the mentioned user (from the GuildMember)
      const joinDate = guildMember.joinedAt.toLocaleDateString();
      ctx.fillText(joinDate, 370, 118); // Adjust coordinates
    } else {
      ctx.fillText("Join date unavailable", 341, 137); // Handle the case where join date is not available
    }

    // Add user's Discord join date
    const userJoinDate = mentionedUser.createdAt.toLocaleDateString();
    ctx.fillText(userJoinDate, 380, 165); // Adjust coordinates for Discord join date
    // ...

    ctx.beginPath();
    ctx.arc(111, 107, 64, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(userPfp, 47, 43, 128, 128);

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer("image/jpeg");

    // Send the image as a Discord attachment
    message.channel.send({
      files: [
        {
          attachment: buffer,
          name: "avatar.jpg",
        },
      ],
    });
  }
}
