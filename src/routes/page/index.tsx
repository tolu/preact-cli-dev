import { FunctionalComponent, h } from 'preact';
import { usePage } from '../../api/usePage';
import { PageBase } from '../../api/usePages';
import style from './style.css';

interface Props {
    page: PageBase;
}

const Profile: FunctionalComponent<Props> = (props: Props) => {
    const { page: basePage } = props;

    const { page, error } = usePage(basePage.link);

    return (
        <div class={style.profile}>
            <h1>Page: {basePage.name}</h1>
            { error && <p>Something went wrong: {error}</p> }
            { !error && !page && <p>Loading...</p> }
            { page && page.swimlanes.map(s => (
                <section key={s.id}>
                    <h2>{s.name}</h2>
                </section>
            ))}
        </div>
    );
};

export default Profile;
