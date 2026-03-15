const singleSpaAngularWebpack =
  require("single-spa-angular/lib/webpack").default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  singleSpaWebpackConfig.output.libraryTarget = "system";
  singleSpaWebpackConfig.output.chunkLoadingGlobal = "wpClientDashboard";
  singleSpaWebpackConfig.output.publicPath = "/cliente/";

  singleSpaWebpackConfig.externals = [
    "single-spa",
    "@angular/core",
    "@angular/common",
    "@angular/compiler",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/router",
    "rxjs",
    "rxjs/operators",
    "zone.js",
  ];

  return singleSpaWebpackConfig;
};