module.exports = {
  css: { extract: false },
  configureWebpack: {
    output: {
      libraryTarget: "system",
    },
  },
  chainWebpack: config => {
    config.optimization.splitChunks(false) 
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
