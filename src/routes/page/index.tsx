import { FunctionalComponent, h } from 'preact';
import { Page } from '../../api/usePages';
import style from './style.css';

interface Props {
    page: Page;
}

const Profile: FunctionalComponent<Props> = (props: Props) => {
    const { page } = props;

    return (
        <div class={style.profile}>
            <h1>Page: {page.name}</h1>
            <pre>{JSON.stringify(page, null, 4)}</pre>
        </div>
    );
};

export default Profile;
