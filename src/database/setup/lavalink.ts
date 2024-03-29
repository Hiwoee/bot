import chalk from "chalk";
import { Manager } from "../../manager.js";
import { AutoReconnect } from "../schema/AutoReconnect.js";
import chillout from "chillout";
import { MewwmeLoopMode } from "../../@types/Lavalink.js";
import { MewwmePlayer } from "mewwme.player";

export class AutoReconnectLavalinkService {
  client: Manager;
  constructor(client: Manager) {
    this.client = client;
    this.execute();
  }

  async execute() {
    const lavalink = chalk.hex("#ffc61c");
    const lavalink_mess = lavalink("Lavalink: ");
    this.client.logger.data_loader(
      lavalink_mess + `Setting up data for lavalink...`
    );
    this.client.logger.data_loader(
      lavalink_mess + `Auto ReConnect Collecting player 24/7 data`
    );
    const maindata = await this.client.db.autoreconnect.all();

    if (!maindata || maindata.length == 0) {
      this.client.logger.data_loader(
        lavalink_mess + `Auto ReConnect found in 0 servers!`
      );
      this.client.logger.data_loader(
        lavalink_mess + `Setting up data for lavalink complete!`
      );
      return;
    }

    this.client.logger.data_loader(
      lavalink_mess +
        `Auto ReConnect found in ${Object.keys(maindata).length} servers!`
    );
    if (Object.keys(maindata).length === 0) return;

    let retry_interval = setInterval(async () => {
      if (!this.client.lavalinkUsing)
        return this.client.logger.data_loader(
          lavalink_mess + `No lavalink avalible, try again after 3 seconds!`
        );

      clearInterval(retry_interval);

      this.client.logger.data_loader(
        lavalink_mess + `Lavalink avalible, remove interval and continue setup!`
      );

      chillout.forEach(
        maindata,
        async (data: { id: string; value: AutoReconnect }) => {
          setTimeout(async () => this.connectChannel(data));
        }
      );

      this.client.logger.data_loader(
        lavalink_mess +
          `Reconnected to all ${Object.keys(maindata).length} servers!`
      );

      this.client.logger.data_loader(
        lavalink_mess + `Setting up data for lavalink complete!`
      );
    }, 3000);
  }

  async connectChannel(data: { id: string; value: AutoReconnect }) {
    try {
      const channel = this.client.channels.cache.get(data.value.text);
      const voice = this.client.channels.cache.get(data.value.voice);
      if (!channel || !voice) {
        // Jangan menghapus data jika salah satu channel tidak tersedia
        return;
      }

      // Mengatur data teks ID dan voice ID hanya jika keduanya tersedia
      this.client.db.autoreconnect.set(`${data.id}.text`, data.value.text);
      this.client.db.autoreconnect.set(`${data.id}.voice`, data.value.voice);

      const player = await this.client.manager.createPlayer({
        guildId: data.value.guild,
        voiceId: data.value.voice,
        textId: data.value.text,
        deaf: true,
        volume: this.client.config.lavalink.DEFAULT_VOLUME ?? 100,
      });

      if (data.value.current && data.value.current.length !== 0) {
        const search = await player.search(data.value.current, {
          requester: this.client.user,
        });
        if (!search.tracks.length) return;
        await player.play(search.tracks[0]);

        if (data.value.queue.length !== 0)
          await this.queueDataPush(data.value.queue, player);

        if (data.value.config.loop !== "none")
          player.setLoop(data.value.config.loop as MewwmeLoopMode);
        if (data.value.config.volume !== 1)
          player.setVolume(data.value.config.volume);
      }
    } catch (error) {
      // Handle errors that occur during connection or playback
      this.client.logger.info(
        `An error occurred while trying to connect or play a song: ${error}`
      );
      // You can add additional code here to handle or track errors further
    }
  }

  async queueDataPush(query: string[], player: MewwmePlayer) {
    const SongAdd = [];
    let SongLoad = 0;

    for (const data of query) {
      const res = await player.search(data, {
        requester: this.client.user,
      });
      if (res.type == "TRACK") {
        SongAdd.push(res.tracks[0]);
        SongLoad++;
      } else if (res.type == "PLAYLIST") {
        for (let t = 0; t < res.tracks.length; t++) {
          SongAdd.push(res.tracks[t]);
          SongLoad++;
        }
      } else if (res.type == "SEARCH") {
        SongAdd.push(res.tracks[0]);
        SongLoad++;
      }
      if (SongLoad == query.length) {
        player.queue.add(SongAdd);
      }
    }
  }
}
