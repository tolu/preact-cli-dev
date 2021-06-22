import webpack from 'webpack';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

const config = dotenv.config();
const localConfig = dotenv.config({ path: './.env.local' });
const parsed = { ...config.parsed, ...localConfig.parsed };
Object.keys(parsed).forEach(k => ( parsed[k] = JSON.stringify(parsed[k]) ));

module.exports = function (/** @type {import('webpack').Configuration} */config) {
  config.plugins.push(
    new webpack.DefinePlugin({
      process: { env: parsed },
    })
  );
  Object.assign(config.devServer, {
    http2: true,
    https: {
      key: readFileSync(path.join(__dirname, '/certs/key.pem')),
      cert: readFileSync(path.join(__dirname, '/certs/cert.pem')),
    },
  });
}