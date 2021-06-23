import { FunctionalComponent, h } from 'preact';
import { SwimlaneBase } from '../../api/usePage';
import { useSwimlane, SwimlaneItem } from '../../api/useSwimlane';
import style from './style.css';
import utils from './../utils.css';

const join = (...args: string[]) => args.join(' ');

export const Scroller: FunctionalComponent<{ swimlane: SwimlaneBase }> = ({ swimlane }) => {
    const { swimlaneItems = [], error: swimlaneError } = useSwimlane(swimlane);

    if (swimlaneError) {
        return (<section>
            <p>{swimlaneError}</p>
        </section>);
    }

    return (
        <section class={join(style['scroller-container'], utils['full-width'])}>
            <h2>{swimlane.name}: {swimlaneItems.length}</h2>
            <ul class={style.scroller} role="list">
                {swimlaneItems.map(i => <ScrollerItem item={i} key={i.id} />)}
            </ul>
        </section>
    );
};

const ScrollerItem: FunctionalComponent<{ item: SwimlaneItem }> = ({ item }) => {
    const link = `/watch/${item.seriesId ?? item.id}`;
    const img = item.imagePackUri || item.originChannel._links.placeholderImage.href;
    return (
        <li key={item.id} class={style['scroller-item']}>
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