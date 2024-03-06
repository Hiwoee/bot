import { Manager } from "../../../manager.js";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";
import { createCanvas, loadImage } from "canvas"; // Use 'canvas' library

export default class implements SlashCommand {
  name = ["users"];
  description = "Show your or someone else's profile info";
  category = "Utils";
  accessableby = Accessableby.Member;
  lavalink = false;
  options = [
    {
      name: "user",
      description: "Type your user here",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ];

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });
    const userOption = interaction.options.getUser("user");

    if (!interaction.guild) {
      return interaction.reply("This command can only be used in a server.");
    }

    const canvas = createCanvas(754, 215);
    const ctx = canvas.getContext("2d");

    if (userOption) {
      const userPfp = await loadImage(
        userOption.displayAvatarURL({ extension: "jpg", size: 1024 })
      );
      const img = await loadImage("profile.png"); // Replace with the actual image path

      // Set font styles and color
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "#f4e0c7";

      // Draw on the canvas
      ctx.drawImage(img, 0, 0, 754, 215);
      ctx.fillText(userOption.username, 278, 70);

      // Handle join date
      const guildMember = interaction.guild.members.cache.get(userOption.id);
      if (guildMember && guildMember.joinedAt) {
        const joinDate = guildMember.joinedAt.toLocaleDateString();
        ctx.fillText(joinDate, 370, 118);
      } else {
        ctx.fillText("Join date unavailable", 341, 137);
      }

      // User's Discord join date
      const userJoinDate = userOption.createdAt.toLocaleDateString();
      ctx.fillText(userJoinDate, 380, 165);

      // Create a circular clip for the profile picture
      ctx.beginPath();
      ctx.arc(111, 107, 64, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(userPfp, 47, 43, 128, 128);

      // Convert to buffer and send the image
      const buffer = canvas.toBuffer("image/jpeg");
      await interaction.editReply({
        files: [
          {
            attachment: buffer,
            name: "avatar.jpg",
          },
        ],
      });
    } else {
      interaction.reply("User not specified.");
    }
  }
}
