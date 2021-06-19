import jwtDecode from 'jwt-decode';
import { getLogger } from '../modules/logger';

const log = getLogger('auth');
interface RtvToken {
  exp: number;
  email: string;
  auth_time: number;
  iss: string;
  iss_version: string;
  nameid: string; // tfn
  unique_name: string; // tfn
  sub: string; // user id
  ['urn:rikstv:1:cid']: string; // sha1 hashed user id
  ['urn:rikstv:1:tag']: 'InternalTest' | '' | undefined;
  ['http://rikstv.no/claims/customernumber/1']?: string;
}

export class JwtToken {
  private rawToken?: string | null;
  private decodedToken?: RtvToken | null;
  private expiresEpoch?: number | null;
  // Useful for simulating short TTL
  private expMarginMilliseconds = 30 * 1000;

  constructor(token: string | null, fromCallback = false) {
    if (token) {
      try {
        this.decodedToken = jwtDecode<RtvToken>(token);
        this.rawToken = token;
        // do we have a expiry?
        if (this.decodedToken?.exp) {
          const expDate = new Date(0);
          expDate.setUTCSeconds(this.decodedToken.exp);
          this.expiresEpoch = expDate.getTime();
          if (!fromCallback) {
            log.info(`auth: jwtToken expires: ${expDate.toLocaleTimeString()}`, this.decodedToken);
          }
        }
      } catch (err) {
        log.error('Failed to decode token', { token, err });
      }
    }
  }

  get accessToken(): string {
    return `${this.rawToken ?? ''}`;
  }

  get expires(): number {
    return this.expiresEpoch || 0;
  }

  isTokenValid(): boolean {
    return this.decodedToken != null && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    if (!this.expiresEpoch) {
      return true;
    }

    const verySoon = Date.now() + this.expMarginMilliseconds;
    return this.expiresEpoch < verySoon;
  }

  hasValidCustomerClaim(): boolean {
    if (!this.decodedToken) {
      return false;
    }

    // safety catch to avoid inifinite redirects to auth server
    // (it was possible to get "valid" token with incorrect customer number claim)
    const claim = 'http://rikstv.no/claims/customernumber/1';
    const validCustomerNumberClaim = (this.decodedToken[claim] || 0) > 1;
    return validCustomerNumberClaim;
  }
}
