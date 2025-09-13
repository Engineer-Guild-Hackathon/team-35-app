const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.transformer.cssModulePattern = /\.module\.(css|scss|sass)$/;

module.exports = config;