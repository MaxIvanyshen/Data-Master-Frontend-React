const Dotenv = require('dotenv-webpack');

module.exports = {
  // Your existing webpack configuration...
  plugins: [
    new Dotenv()
    // Add other plugins as needed
  ],
  resolve: {
    fallback: {
      // Add polyfills for Node.js core modules as necessary
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      fs: false, // no polyfill for fs
      // Other modules that may be needed
    },
  },
};
