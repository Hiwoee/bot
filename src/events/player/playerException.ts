import { MewwmePlayer } from "mewwme.player";
import { Manager } from "../../manager.js";
import { TrackExceptionEvent } from "shoukaku";
import { TextChannel } from "discord.js";

export default class {
  async execute(
    client: Manager,
    player: MewwmePlayer,
    data: TrackExceptionEvent
  ) {
    client.logger.error(
      `Player get exception in / ${player.guildId} / reason: TrackExceptionEvent Lavalink Server`
    );
    client.logger.log({ level: "error", message: data });
    /////////// Update Music Setup //////////
    await client.UpdateMusic(player);
    /////////// Update Music Setup ///////////
    const fetch_channel = await client.channels.fetch(player.textId);
    const text_channel = fetch_channel! as TextChannel;
    if (text_channel) {
      await text_channel.send(
        "Player get exception, please contact with owner or type `/report` for send report to fix this error"
      );
    }
    await player.destroy();
  }
}
