var config = {};

config.bot = {};
config.plex = {};

config.bot.id = process.env["bot_id"];
config.bot.keyword = "@plex";
config.plex.baseurl = process.env["plexBaseUrl"];
config.plex.token = process.env["X-Plex-Token"];

