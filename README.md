# VERSION 7.0.5 RELEASE

# QUICKSTART
## 🛠️ Installation local or vps
1. Change the name of **config.example.yml** to **config.yml** and fill it with `TOKEN`, `NODES` and  other.
2. run `yarn install` to install the required packages.
3. run `yarn start:prod` to build & run the project in production mode.
4. run `yarn start:dev` to build & run the project in  development mode.
5. **Enjoy Listening To Music With Mewwme!**
> NOTE you can running with `NPM`, `YARN` or `PNPM`

## 🛠️ Installation with Pterodactyl Panel
1. [Click Here](https://github.com/mewwme/mewwme.github.io/blob/main/cdn/egg-node-j-s--universal.json) to download the Node.js Egg Template for Pterodactyl.
2. Change the name of **config.example.yml** to **config.yml** and fill it with `TOKEN`, `NODES` and  other.
3. In the Pterodactyl Panel, go to your server's Startup tab:
   - Set `STARTUP COMMAND 1` to `npm install`.
4. Optionally, if you have a production-ready start command:
   - Set `STARTUP COMMAND 2` to `npm run start:prod`.
5. **Enjoy Listening To Music With Mewwme!**

## Setting yml with .env
```yaml
# Mewwme config file via .yaml
# You can use ${} to pass an enviroment varible from .env file
# Eg:
# something: ${TOKEN}
```

## Permissions 
```
  accessableby = Accessableby.Owner;
```
- For premium access, set `Accessableby.Premium`.
- Admins in the server can execute specific commands by setting `Accessableby.Manager`.
- Full access to certain commands is reserved for the bot owner. Set `Accessableby.Owner` if you're the bot owner.
- Accessableby.Owner, Accessableby.Member, Accessableby.Manager, Accessableby.Premium

## Commands
#### `Announcement`
- Accessible only to bot owners, this command sends embed-based announcements to connected voice channel text channels across servers. Allows user-provided descriptions and optional images.
#### `Update`
- Enables bot owners to send update information to a specified channel, informing users about bot changes or enhancements.
#### `Suggestions`
- Allows users to submit recommendations via the Discord bot. Suggestions are sent to a designated channel for consideration.
#### `Report`
- Enables users to report bugs by providing a description through the Discord bot. Reports are sent to a specified channel for handling.
#### `Animated-Avatar`
- Owner can now easily change the bot's avatar with a GIF format directly from the command.

## 📚 Supported Databases
- [x] MySQL
- [x] MongoDB
- [x] JSON
- [x] PostgresSQL
```yaml
  DATABASE:
    driver: "postgres" # Note: mongodb, mysql, json, postgres
    config:
      host: "localhost"
      user: "me"
      password: "secret"
      database: "my_db"

  DATABASE:
    driver: "mysql" # Note: mongodb, mysql, json, postgres
    config:
      host: "localhost"
      user: "me"
      password: "secret"
      database: "my_db"

  DATABASE:
    driver: "mongodb"  # Note: mongodb, mysql, json, postgres
    config:
      uri: "mongodb://127.0.0.1:27017/mewwme"  # mongodb uri

  DATABASE:
    driver: "json" # mongodb, mysql, json, postgres
    config: { path: "./mewwme.database.json" }
```
Make sure to follow these steps carefully to set up your server for running the Mewwme music bot. If you encounter any issues, join [server discord](https://discord.gg/6EXgrmtkPX)

---
