// TODO (@tolu): import from oidc-client/lib to get ES6
import { UserManager } from 'oidc-client';

import { getLogger } from '../logger';

import { JwtToken } from './JwtToken';

// read from .env file and injected via Define-plugin
const { SCOPE, CLIENT_ID, AUTHORITY } = process.env;
if (!SCOPE || !CLIENT_ID || !AUTHORITY) {
  throw new TypeError('Missing required config in env');
}

const config = {
  auth: {
    oauthRedirectURL: `${window.location.origin}/app/post-login`,
    stsUrl: AUTHORITY,
    scope: SCOPE,
  }
}

const log = getLogger('auth');

const _tokenKey: Readonly<string> = 'access_token';
const _idTokenKey: Readonly<string> = 'id_token';
const _loginAttemptTimeKey: Readonly<string> = 'login_attempt';

class AuthService {
  private userManager: Readonly<UserManager>;
  private token: JwtToken = new JwtToken(null);
  private redirectUrl: Readonly<URL>;
  private onLoginRedirect: Readonly<boolean>;

  constructor() {
    const overrides = {
      notificationTime: parseFloat(sessionStorage.getItem('config.auth.time') || '') || null,
      monitorSession: sessionStorage.getItem('config.auth.monitorSession') != null || null,
    };

    this.redirectUrl = new URL(config.auth.oauthRedirectURL);
    this.userManager = new UserManager({
      authority: config.auth.stsUrl,
      scope: config.auth.scope,
      client_id: CLIENT_ID,
      redirect_uri: this.redirectUrl.href,
      response_type: 'code',
      loadUserInfo: false,
      accessTokenExpiringNotificationTime: overrides.notificationTime ?? 120,
      // automaticSilentRenew: true,
      monitorSession: overrides.monitorSession ?? false,
    });
    // TODO (@tolu): use event instead of own custom logic in JwtToken
    this.userManager.events.addAccessTokenExpiring((...args) => {
      log.info('onAccessTokenExpiring', args);
      // this.redirectToAuthServer();
    });

    this.onLoginRedirect = window.location.pathname.toLowerCase() === this.redirectUrl.pathname.toLowerCase();
  }

  init() {
    if (!this.onLoginRedirect) {
      // Get and decode token from localStorage
      this.token = new JwtToken(this.getPersistedToken());
  
      // Check if we should refresh
      if (this.shouldRefreshExistingToken()) {
        this.redirectToAuthServer();
      }
    }
  }

  isLoggedIn() {
    if (this.token.isTokenValid()) {
      if (!this.token.hasValidCustomerClaim()) {
        // safety catch to avoid infinite redirects to auth server
        // it was possible to get "valid" token with incorrect customer number claim
        this.logout();
      } else {
        return true;
      }
    }

    return false;
  }

  shouldRefreshExistingToken() {
    return this.token.accessToken && this.token.isTokenExpired();
  }

  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      log.info('doc visible');
      this.shouldRefreshExistingToken() && this.login();
    }
  }

  async handleRouteChange(url: string): Promise<string|null> {
    if (this.onLoginRedirect) {
      return await this.handleAuthorizationCallback();
    }
    if (this.shouldRefreshExistingToken()) {
      this.login(url);
    }
    return null;
  }

  logout() {
    localStorage.removeItem(_tokenKey);
    const args = {
      id_token_hint: localStorage.getItem(_idTokenKey),
      post_logout_redirect_uri: window.location.origin,
    };
    this.userManager.signoutRedirect(args);
  }

  login(redirect = window.location.pathname) {
    localStorage.setItem(_loginAttemptTimeKey, Date.now().toString());
    this.redirectToAuthServer(redirect);
  }

  getToken() {
    // TODO: make async and check valid / refresh if needed before returning
    // only works if we get silent refresh working
    return `${this.token.accessToken}`;
  }

  // PRIVATE PARTS

  private setToken(access_token: string, fromCallback = false) {
    localStorage.setItem(_tokenKey, access_token);
    this.token = new JwtToken(access_token, fromCallback);
  }

  private redirectToAuthServer(redirect = window.location.pathname) {
    log.info('redirecting to auth server...');
    this.userManager.signinRedirect({ state: redirect });
  }

  private getPersistedToken() {
    return localStorage.getItem(_tokenKey);
  }

  private async handleAuthorizationCallback() {
    try {
      const user = await this.userManager.signinRedirectCallback();
      log.info('login callback', user);
      const { access_token, state, id_token } = user;
      localStorage.setItem(_idTokenKey, id_token);
      this.setToken(access_token, true);
      
      return state || '/';
    } catch (e) {
      log.error(e);
    }
    return '/';
  }
}

const authService = new AuthService();

export { authService };
