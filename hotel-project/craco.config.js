module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix plyr module resolution
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          // Force plyr to resolve to dist folder instead of src
          'plyr': require.resolve('plyr/dist/plyr.js')
        }
      };
      return webpackConfig;
    }
  }
};


