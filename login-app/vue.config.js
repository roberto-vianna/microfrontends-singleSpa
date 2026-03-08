// module.exports = {
//   css: { extract: false },
//   configureWebpack: {
//     output: {
//       libraryTarget: "system",
//       filename: "app.js",
//     },
//     externals: ["vue", "vue-router"],
//   },
//   chainWebpack: (config) => {
//     config.optimization.splitChunks(false);
//     config.plugin("html").tap((args) => {
//       args[0].inject = false;
//       return args;
//     });
//   },
//   devServer: {
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//     port: 8082,
//   },
//   pluginOptions: {
//     copy: [
//       {
//         from: "src/_redirects",
//         to: "_redirects",
//         toType: "file",
//       },
//     ],
//   },
// };
module.exports = {
  publicPath: "/login/",
  outputDir: "dist",
  css: { extract: false },
  configureWebpack: {
    output: {
      libraryTarget: "system",
      filename: "app.js",
    },
    externals: [],
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