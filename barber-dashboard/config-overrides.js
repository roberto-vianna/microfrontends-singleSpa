const path = require("path");

module.exports = {
  webpack: (config) => {
    config.entry = path.resolve(__dirname, "src/single-spa-entry.js");
    config.output.libraryTarget = "system";
    config.output.filename = "main.js";
    config.output.publicPath = "/barbeiro/";

    config.optimization = {
      splitChunks: false,
      runtimeChunk: false,
    };

    config.plugins = config.plugins.filter(
      (plugin) =>
        !(plugin && plugin.constructor && plugin.constructor.name === "MiniCssExtractPlugin")
    );

    const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));

    if (oneOfRule) {
      oneOfRule.oneOf.forEach((rule) => {
        if (Array.isArray(rule.use)) {
          rule.use = rule.use.map((loader) => {
            if (
              typeof loader === "object" &&
              loader.loader &&
              loader.loader.includes("mini-css-extract-plugin")
            ) {
              return {
                loader: require.resolve("style-loader"),
              };
            }

            if (
              typeof loader === "string" &&
              loader.includes("mini-css-extract-plugin")
            ) {
              return require.resolve("style-loader");
            }

            return loader;
          });
        }
      });
    }

    return config;
  },
};