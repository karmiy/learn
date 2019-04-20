import { DOMComputedStyle } from './dom';

/**
 * 获取元素滚动量
 * @param target: DOMElement
 * @param top: boolean 垂直/水平
 * @returns {number}
 */
export function getScroll(target, top) {
    if (typeof window === 'undefined') {
        return 0;
    }

    const prop = top ? 'pageYOffset' : 'pageXOffset';
    const method = top ? 'scrollTop' : 'scrollLeft';
    const isWindow = target === window;

    let ret = isWindow ? target[prop] : target[method];
    // ie6,7,8 standard mode
    if (isWindow && typeof ret !== 'number') {
        ret = window.document.documentElement[method];
    }

    return ret;
}

/**
 * 判断元素是否是滚动元素
 * @param target: DOMElement
 * @param direction: 'X' | 'Y' | undefined，方向
 * @returns {boolean}
 */
export function isScrollTarget(target, direction = '') {
    if(!target)
        return false;
    const overflow = DOMComputedStyle(target)[`overflow${direction}`];
    return (overflow.indexOf('auto') !== -1 || overflow.indexOf('scroll') !== -1) && (target.scrollHeight > target.clientHeight);
}

/**
 * 获取浏览器的滚动条宽度
 * @param fresh: boolean，true重新计算滚动条宽度，false取缓存值
 * @returns {number}
 */
let cached;

export function getScrollBarSize(fresh) {
    if (fresh || cached === undefined) {
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    }
    return cached;
}

/**
 * 滚动条到可视区域
 * @param container: DOMElement，滚动容器
 * @param selected: DOMElement，容器的某个子元素，selected为undefined时container滚动到0的位置，否则滚动到使selected可视的区域
 */
export function scrollIntoView(container, selected) {
    if (!selected) {
        container.scrollTop = 0;
        return;
    }
    let transientPosition = false;
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
        transientPosition = true;
    }
    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer && container !== pointer && container.contains(pointer)) {
        offsetParents.push(pointer);
        pointer = pointer.offsetParent;
    }
    const top = selected.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;

    if (top < viewRectTop) {
        container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
        container.scrollTop = bottom - container.clientHeight;
    }
    if (transientPosition) {
        container.style.position = '';
    }
}