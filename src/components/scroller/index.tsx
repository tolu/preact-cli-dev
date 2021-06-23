import { FunctionalComponent, h } from 'preact';
import { SwimlaneBase } from '../../api/usePage';
import { useSwimlane, SwimlaneItem } from '../../api/useSwimlane';
import style from './style.css';
import utils from './../utils.css';
import { useCallback } from 'preact/hooks';
import { Link } from 'preact-router';

const join = (...args: string[]) => args.join(' ');

export const Scroller: FunctionalComponent<{ swimlane: SwimlaneBase }> = ({ swimlane }) => {
    const { swimlaneItems = [], error: swimlaneError } = useSwimlane(swimlane);
    const handleKeyboard = useCallback(ulKeyDownHandler, []);
    const handleFocus = useCallback(ulFocusHandler, []);

    if (swimlaneError) {
        return (<section>
            <p>{swimlaneError}</p>
        </section>);
    }

    return (
        <section class={join(style['scroller-container'], utils['full-width'])}>
            <h2>{swimlane.name}: {swimlaneItems.length}</h2>
            <ul class={style.scroller} role="list" onKeyDown={handleKeyboard} onFocus={handleFocus}>
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
const ulKeyDownHandler = (event: KeyboardEvent) => {
    const { target, code, altKey, shiftKey, ctrlKey, metaKey } = event;
    // do nothing when control keys are pressed
    if (altKey || ctrlKey || metaKey) return;
    console.log('onKeyDown', { code, target })
    if (target instanceof HTMLAnchorElement) {
        const scroller = target.closest(`.${style.scroller}`) as HTMLUListElement | null;
        if (!scroller) return;
        if (/ArrowLeft|ArrowRight/i.test(code) && !shiftKey) {
            const move = code === 'ArrowLeft' ? -1 : 1;
            const children = Array.from(scroller.querySelectorAll('a'));
            const nextTarget = children[children.indexOf(target) + move];
            if (nextTarget) {
                nextTarget.focus();
                scroller.focusedChild = nextTarget;
            }
        }
        const scrollerContainer = target.closest(`.${style['scroller-container']}`);
        if (/Tab/i.test(code) && scrollerContainer) {
            const next = scrollerContainer[shiftKey ? 'previousElementSibling' : 'nextElementSibling']?.querySelector('ul');
            if (next instanceof HTMLElement) {
                event.preventDefault();
                next.tabIndex = -1;
                next.focus();
            }
        }
    }
};
const ulFocusHandler = ({ target }: FocusEvent) => {
    if (target instanceof HTMLUListElement) {
        const focusTarget = target.focusedChild || target.querySelector('a');
        focusTarget && focusTarget.focus();
    }
};