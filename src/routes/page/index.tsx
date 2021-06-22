import { FunctionalComponent, h } from 'preact';
import { SwimlaneBase, usePage } from '../../api/usePage';
import { PageBase } from '../../api/usePages';
import { useSwimlane } from '../../api/useSwimlane';
import style from './style.css';

interface Props {
    page: PageBase;
}

const Profile: FunctionalComponent<Props> = (props: Props) => {
    const { page: basePage } = props;

    const { page, error: pageError } = usePage(basePage.link);
    const swimlanes = page?.swimlanes.filter(s => s.name !== 'På TV nå').slice(0, 5) ?? [];

    return (
        <div class={style.page}>
            <h1>Page: {basePage.name}</h1>
            { pageError && <p>Something went wrong: {pageError}</p> }
            { !pageError && !page && <p>Loading...</p> }
            { page && swimlanes.map(s => <Swimlane key={s.id} swimlane={s} />)}
        </div>
    );
};

const Swimlane: FunctionalComponent<{ swimlane: SwimlaneBase}> = ({swimlane}) => {
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
                { swimlaneItems.map(i => (
                    <li key={i.id} class={ style['scroller-item'] }>
                        <a href={`/watch/${i.seriesId ?? i.id}`}>
                            <figure>
                                <picture>
                                    <img src={i.imagePackUri || i.originChannel._links.placeholderImage.href} loading="lazy" />
                                </picture>
                                <figcaption>{i.name}</figcaption>
                            </figure>
                        </a>
                    </li>
                )) }
            </ul>
        </section>
    );
};

export default Profile;
