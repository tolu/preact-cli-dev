import { useCallback, useEffect, useState } from "preact/hooks"
import { DOM } from "../modules/DOM";
import { getLogger } from "../modules/logger";
import { authService } from "./AuthService";

const log = getLogger('auth');
interface AuthState {
  token: string;
  isLoggedIn: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<AuthState>({
    token: authService.getToken(),
    isLoggedIn: authService.isLoggedIn(),
  });

  const handleChange = useCallback(() => {
    const token = authService.getToken();
    const isLoggedIn = authService.isLoggedIn();
    if (user.token !== token || user.isLoggedIn !== isLoggedIn) {
      log.info('handle user changed');
      setUser({
        token: authService.getToken(),
        isLoggedIn: authService.isLoggedIn(),
      })
    }
  }, [user, setUser]);

  useEffect(() => {
    DOM.addEventListener('auth.changed', handleChange);
    return () => DOM.removeEventListener('auth.changed', handleChange);
  }, [handleChange]);

  return user;

}