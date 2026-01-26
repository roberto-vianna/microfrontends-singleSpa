module.exports = {
  webpack: (config) => {
    config.entry = './src/single-spa-entry.js';
    config.output.libraryTarget = 'system';
    config.output.publicPath = 'http://localhost:3000/'; 
    return config;
  }
};