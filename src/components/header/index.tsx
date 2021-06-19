import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { PageBase } from '../../api/usePages';
import { authService } from '../../modules/auth/AuthService';
import style from './style.css';

const Header: FunctionalComponent<{ pages: PageBase[]}> = ({ pages }) => {
    return (
        <header class={style.header}>
            <h1>Tolu Video Shack</h1>
            <nav>
                { !authService.isLoggedIn() &&
                    <Link activeClassName={style.active} href="/">
                        Home
                    </Link>
                }
                { pages.map(p => (
                    <Link activeClassName={style.active} href={`/page/${p.slug}`} key={p.slug} >
                    {p.name}
                    </Link>
                )) }
                <LoginButton />
            </nav>
        </header>
    );
};

const LoginButton: FunctionalComponent = () => {
    const loggedIn = authService.isLoggedIn();
    const label = loggedIn ? '🤩' : 'Log in';
    const title = loggedIn ? 'Log out' : label;
    const handleClick: h.JSX.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (event.target instanceof HTMLButtonElement) {
            event.target.disabled = true;
            if (loggedIn) {
                authService.logout();
            } else {
                authService.login();
            }
        }
    }
    return (
        <button class="login-button" title={title} onClick={handleClick}>
            {label}
        </button>
    );
};

export default Header;
