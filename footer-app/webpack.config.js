const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);
  

  singleSpaWebpackConfig.output.libraryTarget = 'system';
  singleSpaWebpackConfig.output.chunkLoadingGlobal = 'wpFooterApp';
  singleSpaWebpackConfig.output.library = { type: 'system' };
  singleSpaWebpackConfig.output.publicPath = 'http://localhost:8084/';

singleSpaWebpackConfig.externals = [
  'single-spa',
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  'rxjs',
  'rxjs/operators',
  'zone.js'
];

  return singleSpaWebpackConfig;
};
