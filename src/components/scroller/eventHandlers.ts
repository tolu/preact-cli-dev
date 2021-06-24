import style from './style.css';

export const ulKeyDownHandler = (event: KeyboardEvent) => {
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
export const ulFocusHandler = ({ target }: FocusEvent) => {
  if (target instanceof HTMLUListElement) {
      const focusTarget = target.focusedChild || target.querySelector('a');
      focusTarget && focusTarget.focus();
  }
};