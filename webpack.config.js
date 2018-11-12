'use strict';

const path = require('path');

module.exports = {
  mode: "production",
  entry: "./output/client/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  }
};
