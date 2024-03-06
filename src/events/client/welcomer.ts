import { Manager } from "../../manager.js";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PartialGuildMember,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Canvas, resolveImage } from "canvas-constructor";
import { registerFont } from "canvas";
const language = "en";
// Register the font for use in the canvas
registerFont("./LuckiestGuy-Regular.ttf", { family: "Luckiest Guy" });
export default class GuildWelcomer {
  async execute(client: Manager) {
    const generateImage = async (
      member: GuildMember,
      channelId: string,
      isWelcome: boolean
    ) => {
      try {
        const greetings =
          client.config.WelcomerEvents.GREETINGS[isWelcome ? "welcome" : "bye"];
        const images = [
          `${client.config.ImagesWelcomer.IMAGES1}`,
          `${client.config.ImagesWelcomer.IMAGES2}`,
          `${client.config.ImagesWelcomer.IMAGES3}`,
          `${client.config.ImagesWelcomer.IMAGES4}`,
          `${client.config.ImagesWelcomer.IMAGES5}`,
          `${client.config.ImagesWelcomer.IMAGES6}`,
          `${client.config.ImagesWelcomer.IMAGES7}`,
          `${client.config.ImagesWelcomer.IMAGES8}`,
          `${client.config.ImagesWelcomer.IMAGES9}`,
          `${client.config.ImagesWelcomer.IMAGES10}`,
          `${client.config.ImagesWelcomer.IMAGES11}`,
          `${client.config.ImagesWelcomer.IMAGES12}`,
          `${client.config.ImagesWelcomer.IMAGES13}`,
          `${client.config.ImagesWelcomer.IMAGES14}`,
          `${client.config.ImagesWelcomer.IMAGES15}`,
          `${client.config.ImagesWelcomer.IMAGES16}`,
          `${client.config.ImagesWelcomer.IMAGES17}`,
          `${client.config.ImagesWelcomer.IMAGES18}`,
          `${client.config.ImagesWelcomer.IMAGES19}`,
          `${client.config.ImagesWelcomer.IMAGES20}`,
        ];

        const textColors = {
          greeting: client.config.WelcomerEvents.COLOR_GREETINGS,
          username: client.config.WelcomerEvents.COLOR_USERNAME,
        };

        const randomGreeting =
          greetings[Math.floor(Math.random() * greetings.length)];
        const randomImageIndex = Math.floor(Math.random() * images.length);
        const selectedImage = images[randomImageIndex];

        const guildMember = member as GuildMember;

        const img = await resolveImage(selectedImage);
        const userPfp = await resolveImage(
          guildMember.user.displayAvatarURL({
            extension: "jpg",
            size: 1024,
          })
        );
        const greetingText = `${randomGreeting}`;
        const namee =
          member.user.username.length > 10
            ? member.user.username.substring(0, 10) + "..."
            : member.user.username;

        const greetingColor = textColors.greeting;
        const usernameColor = textColors.username;

        return new Canvas(1920, 480)
          .printImage(img, 0, 0, 1920, 480)
          .setColor(greetingColor)
          .setTextFont("90px Luckiest Guy")
          .printWrappedText(greetingText, 550, 200, 800)
          .setColor(usernameColor)
          .setTextFont("130px Luckiest Guy")
          .printWrappedText(namee, 550, 350, 800)
          .printCircularImage(userPfp, 323, 240, 180)
          .toBuffer();
      } catch (error) {
        client.logger.error("Error generating image", error);
        throw error;
      }
    };

    client.on("guildMemberAdd", async (member: GuildMember) => {
      try {
        // Check if the member joined the main server
        if (member.guild?.id !== client.config.WelcomerEvents.GUILD_ID) {
          return;
        }
        client.logger.info(`Member joined: ${member.user?.tag}`);
        const channelId = client.config.WelcomerEvents.WELCOME_CHANNEL_ID;

        if (!channelId) {
          return;
        }

        const image = await generateImage(member, channelId!, true as boolean);
        const attachment = new AttachmentBuilder(image, {
          name: "mewwme.png",
        });

        const channel = (await client.channels.fetch(
          channelId
        )) as TextChannel | null;
        if (!channel) return;

        const WelcomeEmbed = new EmbedBuilder()
          .setImage("attachment://mewwme.png")
          .setColor(client.color);

        const ButtonLink = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel(client.config.WelcomerEvents.BUTTON_NAME)
            .setEmoji(client.config.WelcomerEvents.EMOJI_ID)
            .setStyle(ButtonStyle.Link)
            .setURL(client.config.WelcomerEvents.BUTTON_URL)
        );

        channel
          .send({
            content: client.i18n
              .get(language, "utilities", "welcome_member_join")
              .replace(
                "{guild:name}",
                member.guild ? member.guild.name : "Unknown Guild"
              )
              .replace("{member:tag}", `<@${member.id}>`),
            embeds: [],
            files: [attachment],
            components: [ButtonLink],
          })
          .catch((error: Error) => {
            client.logger.error(error);
          });
      } catch (error) {
        client.logger.error(error);
      }
    });

    client.on(
      "guildMemberRemove",
      async (member: GuildMember | PartialGuildMember) => {
        try {
          // Check if the member left the main server
          if (member.guild?.id !== client.config.WelcomerEvents.GUILD_ID) {
            return;
          }
          client.logger.info(`Member left: ${member.user?.tag}`);
          const channelId = client.config.WelcomerEvents.LEAVE_CHANNEL_ID;

          if (!channelId) {
            return;
          }

          const image = await generateImage(
            member as GuildMember,
            channelId!,
            false as boolean
          );
          const attachment = new AttachmentBuilder(image, {
            name: "mewwme.png",
          });

          const channel = (await client.channels.fetch(
            channelId
          )) as TextChannel | null;
          if (!channel) return;

          const LeaveEmbed = new EmbedBuilder()
            .setImage("attachment://mewwme.png")
            .setColor(client.color);

          channel
            .send({
              content: client.i18n
                .get(language, "utilities", "welcome_member_leave")
                .replace("{member:tag}", `<@${member.id}>`),
              embeds: [],
              files: [attachment],
            })
            .catch((error: Error) => {
              client.logger.error(error);
            });
        } catch (error) {
          client.logger.error(error);
        }
      }
    );
  }
}
