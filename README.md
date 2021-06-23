# video-app-preact

## Intro

### Testing prod-build on <https://localhost>

1. Install [mkcert](https://github.com/FiloSottile/mkcert)
2. Generate certificates with `npm run gen-certs`
3. Run `npm run serve-https`

### Things learned

CSS modules are only watched in `/components` so any attempt to put them outside need configuration changes to work.

### ToDo

- [ ] `IntersectionObserver` on swimlane items to report (how good is `lazy+onload`?)
- [ ] add default TTL on cache service (and move to ServiceWorker?)
- [ ] Shaka player

## CLI Commands

- `npm install`: Installs dependencies

- `npm run dev`: Run a development, HMR server

- `npm run serve`: Run a production-like server

- `npm run build`: Production-ready build

- `npm run lint`: Pass TypeScript files using ESLint

- `npm run test`: Run Jest and Enzyme with
  [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for
  your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
