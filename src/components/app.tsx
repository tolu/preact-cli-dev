import { FunctionalComponent, h } from 'preact';
import { route, Route, Router, RouterOnChangeArgs } from 'preact-router';

import Home from '../routes/home';
import Page from '../routes/page';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import { authService } from '../modules/auth/AuthService';
import { useEffect } from 'preact/hooks';
import { getLogger } from '../modules/logger';
import { usePages } from '../api/usePages';

const log = getLogger('app');

const App: FunctionalComponent = () => {

    authService.init();
    const { pages, error } = usePages();
    
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
            route('/page/start', true);
        }
    };

    return (
        <div id="preact_root">
            <Header pages={pages || []} />
            <Router onChange={handleRoute}>
                <Route path="/" component={Home} />
                {(pages || []).map(p => (

                <Route path={`/page/${p.slug}`} component={Page} page={p} key={p.slug} />
                
                ))}
                { error && !pages && <NotFoundPage default /> }
            </Router>
        </div>
    );
};

export default App;
