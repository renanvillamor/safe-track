const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

if (!config.resolver.platforms.includes("web")) {
  config.resolver.platforms.push("web");
}

module.exports = config;
