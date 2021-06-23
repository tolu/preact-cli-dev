/* must be js to be used by useJson and preact.config.js both */
export const webpackProxy = {
  '/api/play': {
    target: 'https://play-api-container.test.rikstv.no',
    pathRewrite: { '^/api': '' },
    changeOrigin: true, // needed for cert to be validated
  }
};

const targets = Object.keys(webpackProxy).map(k => webpackProxy[k].target);

/**
 * @param {string} urlString 
 * @returns {string}
 */
export const proxyRewrite = (urlString) => {
  const target = targets.find(t => urlString.toLowerCase().startsWith(t));
  if (!target) return urlString;
  const { pathname, search } = new URL(urlString);
  const rewrite = `https://localhost:40801/api${pathname}${search}`;
  console.log('rewrite', { old: urlString, rewrite });
  return rewrite;
}