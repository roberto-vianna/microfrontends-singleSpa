const singleSpaAngularWebpack = require("single-spa-angular/lib/webpack").default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  const isProduction =
    process.env.CONTEXT === "production" ||
    process.env.NODE_ENV === "production";

  singleSpaWebpackConfig.output.libraryTarget = "system";
  singleSpaWebpackConfig.output.chunkLoadingGlobal = "wpClientDashboard";
  singleSpaWebpackConfig.output.publicPath = isProduction
    ? "/cliente/"
    : "http://localhost:8084/";

  return singleSpaWebpackConfig;
};
