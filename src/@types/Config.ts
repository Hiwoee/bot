export interface Config {
  bot: Bot;
  lavalink: Lavalink;
  features: Features;
  Emoji: Emoji;
  ServerSupport: ServerSupport;
  WelcomerEvents: WelcomerEvents;
  ImagesWelcomer: ImagesWelcomer;
}

export interface Bot {
  TOKEN: string;
  EMBED_COLOR: string;
  OWNER_IDS: string[];
  LANGUAGE: string;
  LIMIT_TRACK: number;
  LIMIT_PLAYLIST: number;
  SAFE_ICONS_MODE: boolean;
  SAFE_PLAYER_MODE: boolean;
  DELETE_MSG_TIMEOUT: number;
  DEBUG_MODE: boolean;
  SERVER_SUPPORT: string;
  DEVELOPER: string;
  DEVELOPER_URL: string;
  BUYCODE_URL: string;
  INVITE_URL: string;
  PATREON_URL: string;
  VOTEURL: string;
  BOT_ACTIVITY_TYPE: number;
  BOT_ACTIVITY1: string;
  BOT_ACTIVITY2: string;
  BOT_ACTIVITY3: string;
  GUILDADD_REMOVE: string;
  IMGURL_GUILDADD: string;
  IMGURL_HELPMENU: string;
  IMGURL_COMMANDMENU: string;
  STREAM_URL: string;
  BOT_STATUS: string;
  CUSTOM_STATUS: string;
  WEBSITE_URL: string;
  REQUEST_IMAGE: string;
  THEMES_MUSIC: string;
  GENIUS_APIKEY: string;
  QUOTES_API_KEY: string;
}

export interface Features {
  DATABASE: Database;
  MESSAGE_CONTENT: MessageContent;
  AUTOFIX_LAVALINK: AutofixLavalink;
  WEB_SERVER: WebServer;
  UPDATE_CHANNEL_ID: string;
  SUGGESTION_CHANNEL_ID: string;
  BUG_REPORT_CHANNEL_ID: string;
}

export interface AutofixLavalink {
  enable: boolean;
  reconnectTries: number;
  restTimeout: number;
}

export interface Database {
  driver: string;
  config: any;
}

export interface MessageContent {
  enable: boolean;
  commands: Commands;
}

export interface Commands {
  enable: boolean;
  prefix: string;
}

export interface WelcomerEvents {
  GUILD_ID: string;
  WELCOME_CHANNEL_ID: string;
  LEAVE_CHANNEL_ID: string;
  GREETINGS: GREETINGS;
  COLOR_GREETINGS: string;
  COLOR_USERNAME: string;
  BUTTON_NAME: string;
  EMOJI_ID: string;
  BUTTON_URL: string;
}

export interface GREETINGS {
  welcome: string[];
  bye: string[];
}

export interface WebServer {
  enable: boolean;
  PORT: number;
  TOPGG_WEBHOOK_PORT: number;
  TOPGG_WEBHOOK_AUTH: string;
  TOPGG_GUILD_ID: string;
  TOPGG_VOTE_LOG_CHANNEL_ID: string;
  TOPGG_VOTE_IMG: string;
  TOPGG_TOKEN: string;
  BUTTON_URL: string;
  EMOJI_ID: string;
  BUTTON_NAME: string;
  websocket: Websocket;
}

export interface Websocket {
  enable: boolean;
  host: string;
  secret: string;
  auth: boolean;
  trusted: string[];
}

export interface Lavalink {
  SPOTIFY: Spotify;
  DEFAULT: string[];
  NP_REALTIME: boolean;
  LEAVE_TIMEOUT: number;
  NODES: Node[];
  SHOUKAKU_OPTIONS: ShoukakuOptions;
  SEARCH_ENGINE: string;
  DEFAULT_VOLUME: number;
}

export interface Node {
  url: string;
  name: string;
  auth: string;
  secure: boolean;
}

export interface ShoukakuOptions {
  moveOnDisconnect: boolean;
  resumable: boolean;
  resumableTimeout: number;
  reconnectTries: number;
  restTimeout: number;
}

export interface Spotify {
  enable: boolean;
  id: string;
  secret: string;
}

export interface Emoji {
  E_HOME: string;
  E_SETTING: string;
  E_ADMIN: string;
  E_INFO: string;
  E_PLAYLIST: string;
  E_FILTER: string;
  E_ALLCMD: string;
  E_MUSIC: string;
  E_INVITE: string;
  E_SUPPORT: string;
  E_VOTE: string;
  E_UTILS: string;
}

export interface ServerSupport {
  QUOTES_API_KEY: string;
  WELCOME_CHANNEL_ID: string;
  LEAVE_CHANNEL_ID: string;
  GUILDID_WELCOMER: string;
  UPDATE_CHANNEL_ID: string;
  SUGGESTION_CHANNEL_ID: string;
  BUG_REPORT_CHANNEL_ID: string;
  REDEEM_LOGS: string;
  JOIN_LEAVE_LOGS: string;
}

export interface ImagesWelcomer {
  IMAGES1: string;
  IMAGES2: string;
  IMAGES3: string;
  IMAGES4: string;
  IMAGES5: string;
  IMAGES6: string;
  IMAGES7: string;
  IMAGES8: string;
  IMAGES9: string;
  IMAGES10: string;
  IMAGES11: string;
  IMAGES12: string;
  IMAGES13: string;
  IMAGES14: string;
  IMAGES15: string;
  IMAGES16: string;
  IMAGES17: string;
  IMAGES18: string;
  IMAGES19: string;
  IMAGES20: string;
}
