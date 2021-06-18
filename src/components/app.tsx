import { FunctionalComponent, h } from 'preact';
import { route, Route, Router, RouterOnChangeArgs } from 'preact-router';

import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import { authService } from '../modules/auth/AuthService';
import { useEffect } from 'preact/hooks';
import { getLogger } from '../modules/logger';

const log = getLogger('app');

const App: FunctionalComponent = () => {

    authService.init();

    // setup visibility changed in an effect
    // so that we remove listener for HMR updates
    useEffect(() => {
        const handler = () => authService.handleVisibilityChange();
        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    });{}

    const handleRoute = async ({url, previous}: RouterOnChangeArgs) => {
        log.debug('onRouteChange', {url, previous});
        // refresh token on nav and handle login redirect
        const redirect = await authService.handleRouteChange(url);
        if (redirect) {
            route(redirect, true);
        } else if (url === '/' && authService.isLoggedIn()) {
            route('/start', true);
        }
    };

    return (
        <div id="preact_root">
            <Header />
            <Router onChange={handleRoute}>
                <Route path="/" component={Home} />
                <Route path="/start/" component={Profile} user="me" />
                <Route path="/profile/:user" component={Profile} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
