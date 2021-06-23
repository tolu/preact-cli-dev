import { FunctionalComponent, h } from 'preact';
import { usePage } from '../../api/usePage';
import { PageBase } from '../../api/usePages';
import { Scroller } from '../../components/scroller';
import style from './style.css';
interface Props {
    page: PageBase;
}

const Page: FunctionalComponent<Props> = (props: Props) => {
    const { page: basePage } = props;

    const { page, error: pageError } = usePage(basePage.link);
    const swimlanes = page?.swimlanes.filter(s => s.name !== 'På TV nå').slice(0, 5) ?? [];

    return (
        <div class={style.page}>
            <h1>Page: {basePage.name}</h1>
            { pageError && <p>Something went wrong: {pageError}</p> }
            { !pageError && !page && <p>Loading...</p> }
            { page && swimlanes.map(s => <Scroller key={s.id} swimlane={s} />)}
        </div>
    );
};



export default Page;
