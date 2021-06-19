import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { useContext } from 'preact/hooks';
import { PageBase } from '../../api/usePages';
import { authService } from '../../auth/AuthService';
import { UserContext } from '../../auth/UserContext';
import style from './style.css';

const Header: FunctionalComponent<{ pages: PageBase[] }> = ({ pages }) => {
    const { isLoggedIn } = useContext(UserContext);
    return (
        <header class={style.header}>
            <h1>Tolu Video Shack</h1>
            <nav>
                { !isLoggedIn &&
                    <Link activeClassName={style.active} href="/">
                        Home
                    </Link>
                }
                { pages.map(p => (
                    <Link activeClassName={style.active} href={`/page/${p.slug}`} key={p.slug} >
                    {p.name}
                    </Link>
                )) }
                <LoginButton isLoggedIn={isLoggedIn} />
            </nav>
        </header>
    );
};

const LoginButton: FunctionalComponent<{isLoggedIn: boolean}> = ({isLoggedIn}) => {
    const loggedIn = isLoggedIn;
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
