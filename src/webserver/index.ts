import express from "express";
import expressWs from "express-ws";
import { Manager } from "../manager.js";
import { WebsocketService } from "./websocket.js";
import { loadRequest } from "./loadRequest.js";
import { Webhook } from "@top-gg/sdk";
import {
  ButtonBuilder,
  EmbedBuilder,
  TextChannel,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
const language = "en";
export class WebServer {
  client: Manager;
  app: expressWs.Application;
  port: number;
  votePort: number; // Tambahkan property votePort
  channelID: string;

  constructor(client: Manager) {
    this.client = client;
    this.app = expressWs(express()).app;
    this.port = this.client.config.features.WEB_SERVER.PORT;
    this.votePort = this.client.config.features.WEB_SERVER.TOPGG_WEBHOOK_PORT;
    this.channelID =
      this.client.config.features.WEB_SERVER.TOPGG_VOTE_LOG_CHANNEL_ID;

    if (this.client.config.features.WEB_SERVER.websocket.enable) {
      this.websocket();
    }

    this.alive();
    this.setupVoteWebhook();
    this.expose();
  }

  websocket() {
    const client = this.client;

    new loadRequest(client);
    this.app.ws("/websocket", function (ws, req) {
      new WebsocketService(client, ws, req);
    });
  }

  alive() {
    this.app.get("/", (req, res) => {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mewwme</title>
        <link rel="icon" href="https://cdn.is-a.fun/bot/mewwme/avatar.png" type="image/png">
        <!-- Add your CSS styles or external stylesheets here -->
          <style>
              body {
                  animation: backgroundChange 6s infinite;
                  text-align: center;
              }
      
              h1 {
                  margin-top: 50vh;
              }
      
              @keyframes backgroundChange {
                  0%, 100% {
                      background-color: black;
                  }
                  50% {
                      background-color: white;
                  }
              }
          </style>
      </head>
      <body>
          <h1>Hello World, Kumaha Damang?</h1>
          <p style="font-size: 10px;">Made with ❤️ by <a href="https://lrmn.is-a.dev">L RMN</a></p>
          <P style="font-size: 10px;">Join Discord Server Support <a href="https://discord.gg/mewwme">MEWWME</a></P>
      </body>
      </html>
      `);
    });

    // Serve your favicon.ico file from the specified path
    this.app.get("/favicon.ico", (req, res) => {
      // Redirect to the URL of your favicon
      res.redirect("https://cdn.is-a.fun/bot/mewwme/avatar.png");
    });
  }

  setupVoteWebhook() {
    const client = this.client;
    const webhook = new Webhook(
      client.config.features.WEB_SERVER.TOPGG_WEBHOOK_AUTH
    );

    // Create a dedicated Express instance for /vote on votePort
    const voteApp = express();
    const voteServer = expressWs(voteApp).app;

    voteServer.post(
      "/vote",
      webhook.listener(async (vote) => {
        try {
          const voteUser = await client.users.fetch(vote.user);

          const guild = client.guilds.cache.get(
            client.config.features.WEB_SERVER.TOPGG_GUILD_ID
          );
          let channel;

          if (guild) {
            channel = guild.channels.cache.get(
              client.config.features.WEB_SERVER.TOPGG_VOTE_LOG_CHANNEL_ID
            );
          }

          if (channel && channel.isTextBased()) {
            client.logger.info(`${voteUser.tag} Just Voted On Top.gg`);

            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setImage(
                client.config.features.WEB_SERVER.TOPGG_VOTE_IMG ||
                  "https://cdn.is-a.fun/bot/mewwme/vote.png"
              );

            const ButtonVote =
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setLabel(
                    client.config.features.WEB_SERVER.BUTTON_NAME || "Vote"
                  )
                  .setEmoji(client.config.features.WEB_SERVER.EMOJI_ID || "👍")
                  .setStyle(ButtonStyle.Link)
                  .setURL(
                    client.config.features.WEB_SERVER.BUTTON_URL ||
                      "https://top.gg/bot/928711702596423740"
                  )
              );

            await channel.send({
              content: client.i18n
                .get(language, "utilities", "vote_logs_message")
                .replace("{vote:user}", `<@${vote.user}>`)
                .replace("{vote:bot}", `<@${vote.bot}>`),
              embeds: [embed],
              components: [ButtonVote],
            });
          } else {
            client.logger.error(
              `Channel with ID ${this.channelID} is not a text channel.`
            );
          }
        } catch (error) {
          client.logger.error(error);
        }
      })
    );

    // Listen pada votePort
    voteServer.listen(this.votePort, () => {
      client.logger.info(
        `Running /vote ON TOP.GG web server on port: ${this.votePort}`
      );
    });
  }

  expose() {
    this.app.listen(this.port);
    this.client.logger.info(`Running main web server in port: ${this.port}`);
  }
}
