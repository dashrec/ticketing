module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
//fixes file changing issue inside container but not 100 %