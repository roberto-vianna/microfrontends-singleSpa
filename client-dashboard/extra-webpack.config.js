// const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

// module.exports = (config, options) => {
//   const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

//   // Feel free to modify this webpack config however you'd like to
//   return singleSpaWebpackConfig;
// };

const singleSpaAngularWebpack = require("single-spa-angular/lib/webpack").default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  singleSpaWebpackConfig.output.libraryTarget = "system";
  singleSpaWebpackConfig.output.chunkLoadingGlobal = "wpClientDashboard";
  singleSpaWebpackConfig.output.publicPath = "/cliente/";

  return singleSpaWebpackConfig;
};