import { FunctionalComponent, h } from 'preact';
import { SwimlaneBase } from '../../api/usePage';
import { useSwimlane, SwimlaneItem } from '../../api/useSwimlane';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { Link } from 'preact-router';
import { ulFocusHandler, ulKeyDownHandler } from './eventHandlers';
import style from './style.css';
import utils from './../utils.css';
import { useObserver } from '../../modules/useObserver';

const join = (...args: string[]) => args.join(' ');

export const Scroller: FunctionalComponent<{ swimlane: SwimlaneBase }> = ({ swimlane }) => {
    const { swimlaneItems = [], error: swimlaneError } = useSwimlane(swimlane);
    const handleKeyboard = useCallback(ulKeyDownHandler, []);
    const handleFocus = useCallback(ulFocusHandler, []);
    const scrollerEl = useRef<HTMLUListElement|null>();
    useObserver(scrollerEl.current, (entries, observer) => {
        // observe
        const visibleItems = entries.filter(e => e.isIntersecting);
        if (visibleItems.length > 0) {
            console.log('log impression for', visibleItems.map(e => e.target));
            visibleItems.forEach(e => observer.unobserve(e.target));
        }
    }, [swimlane.id]);

    if (swimlaneError) {
        return (<section>
            <p>{swimlaneError}</p>
        </section>);
    }

    return (
        <section class={join(style['scroller-container'], utils['full-width'])}>
            <h2>{swimlane.name}<span aria-hidden={true}>: {swimlaneItems.length}</span></h2>
            <ul ref={scrollerEl} class={style.scroller} role="list" onKeyDown={handleKeyboard} onFocus={handleFocus} aria-label={swimlane.name}>
                {swimlaneItems.map(i => <ScrollerItem item={i} key={i.id} />)}
            </ul>
        </section>
    );
};

const ScrollerItem: FunctionalComponent<{ item: SwimlaneItem }> = ({ item }) => {
    const link = `/watch/${item.id}`;
    const img = item.imagePackUri || item.originChannel._links.placeholderImage.href;
    return (
        <li key={item.id} class={style['scroller-item']}>
            <Link href={link}>
                <figure>
                    <picture>
                        <img src={img} loading="lazy" />
                    </picture>
                    <figcaption>{getTitle(item)}</figcaption>
                </figure>
            </Link>
        </li>
    )
}
const padStart = (val: number, maxLength = 2, filler = '0') => `${val}`.padStart(maxLength, filler);
const getTitle = ({seriesName, name, season = 0, episode = 0}: SwimlaneItem) => {
    if (seriesName && season > 1 && episode > 1) {
        return `${seriesName} S${padStart(season)}E${padStart(episode)}`;
    }
    return seriesName || name;
}

/* extend global to store state of current focused element in ul-element */
declare global {
    interface HTMLUListElement {
        focusedChild?: HTMLAnchorElement;
    }
}