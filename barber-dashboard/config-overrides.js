const path = require("path");

module.exports = {
  webpack: (config) => {
    config.entry = path.resolve(__dirname, "src/single-spa-entry.js");
    config.output.libraryTarget = "system";
    config.output.publicPath = "https://barber-dashboard-mfe.netlify.app/";
    config.optimization = {
      splitChunks: false,
      runtimeChunk: false,
    };
    config.externals = ["react", "react-dom"];

    return config;
  },
};