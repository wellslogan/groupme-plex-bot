var config = {};

config.bot = {};
config.plex = {};

config.port = process.env["PORT"] || 3000;
config.bot.id = process.env["bot_id"];
config.bot.keyword = "@plex";
config.plex.baseurl = process.env["plexBaseUrl"];
config.plex.token = process.env["X-Plex-Token"];

module.exports = config;

