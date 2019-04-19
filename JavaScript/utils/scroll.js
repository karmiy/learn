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
 * @param fresh: boolean，传真值重新计算滚动条宽度，反之取缓存值
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