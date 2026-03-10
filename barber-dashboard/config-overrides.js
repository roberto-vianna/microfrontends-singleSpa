const path = require("path");

module.exports = {
  webpack: (config) => {
    config.entry = path.resolve(__dirname, "src/single-spa-entry.js");
    config.output.libraryTarget = "system";
    config.output.filename = "main.js";
    config.output.publicPath = "/barbeiro/";
    return config;
  },
};