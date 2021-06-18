import webpack from 'webpack';
import dotenv from 'dotenv';

const config = dotenv.config();
const localConfig = dotenv.config({ path: './.env.local' });
const parsed = { ...config.parsed, ...localConfig.parsed };
Object.keys(parsed).forEach(k => ( parsed[k] = JSON.stringify(parsed[k]) ));

module.exports = function (config) {
  config.plugins.push(
    new webpack.DefinePlugin({
      process: { env: parsed },
    })
  );
}