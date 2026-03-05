module.exports = {
  css: { extract: false },
  configureWebpack: {
    output: {
      libraryTarget: "system",
      filename: "app.js",
    },
    externals: ["vue", "vue-router"],
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks(false);
    config.plugin("html").tap((args) => {
      args[0].inject = false;
      return args;
    });
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 8082,
  },
};