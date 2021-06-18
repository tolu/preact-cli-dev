import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { authService } from '../../modules/auth/AuthService';
import style from './style.css';

const Header: FunctionalComponent = () => {
    return (
        <header class={style.header}>
            <h1>Tolu Video Shack</h1>
            <nav>
                <Link activeClassName={style.active} href="/">
                    Home
                </Link>
                <Link activeClassName={style.active} href="/profile">
                    Me
                </Link>
                <Link activeClassName={style.active} href="/profile/john">
                    John
                </Link>
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
