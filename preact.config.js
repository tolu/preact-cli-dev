import webpack from 'webpack';
import dotenv from 'dotenv';
const { parsed = {} } = dotenv.config();
Object.keys(parsed).forEach(k => ( parsed[k] = JSON.stringify(parsed[k]) ));

module.exports = function (config) {
  config.plugins.push(
    new webpack.DefinePlugin({
      process: { env: parsed },
    })
  );
}