import { useCallback, useEffect, useState } from "preact/hooks"
import { getLogger } from "../modules/logger";
import { authService } from "./AuthService";

const log = getLogger('auth');

export const useAuth = () => {
  const [user, setUser] = useState({
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
    addEventListener('auth.changed', handleChange);
    return () => removeEventListener('auth.changed', handleChange);
  }, [handleChange]);

  return user;

}