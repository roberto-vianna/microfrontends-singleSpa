const singleSpaAngularWebpack = require("single-spa-angular/lib/webpack").default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  const isDev = options.configuration !== "production";

  singleSpaWebpackConfig.output.libraryTarget = "system";
  singleSpaWebpackConfig.output.chunkLoadingGlobal = "wpClientDashboard";
  singleSpaWebpackConfig.output.publicPath = isDev
    ? "http://localhost:8084/"
    : "/cliente/";

  return singleSpaWebpackConfig;
};