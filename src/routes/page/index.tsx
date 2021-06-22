import { FunctionalComponent, h } from 'preact';
import { SwimlaneBase, usePage } from '../../api/usePage';
import { PageBase } from '../../api/usePages';
import { SwimlaneItem as ScrollerItem, SwimlaneItem, useSwimlane } from '../../api/useSwimlane';
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

const Scroller: FunctionalComponent<{ swimlane: SwimlaneBase}> = ({swimlane}) => {
    const { swimlaneItems = [], error: swimlaneError } = useSwimlane(swimlane);

    if (swimlaneError) {
        return (<section>
            <p>{swimlaneError}</p>
        </section>);
    }

    return (
        <section>
            <h2>{swimlane.name}</h2>
            <ul class={style.scroller} role="list">
                { swimlaneItems.map(i => <ScrollerItem item={i} key={i.id} />) }
            </ul>
        </section>
    );
};

const ScrollerItem: FunctionalComponent<{item: SwimlaneItem}> = ({item}) => {
    const link = `/watch/${item.seriesId ?? item.id}`;
    const img = item.imagePackUri || item.originChannel._links.placeholderImage.href;
    return (
        <li key={item.id} class={ style['scroller-item'] }>
            <a href={link}>
                <figure>
                    <picture>
                        <img src={img} loading="lazy" />
                    </picture>
                    <figcaption>{item.name}</figcaption>
                </figure>
            </a>
        </li>
    )
}

export default Page;
