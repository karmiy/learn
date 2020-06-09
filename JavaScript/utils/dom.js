import { trim } from './base';
/**
 * polyfill getComputedStyle
 * @param dom: DOMElement
 * @returns {function}
 */
export function DOMComputedStyle(dom) {
    return getComputedStyle ? getComputedStyle(dom) : dom.currentStyle;
}

/**
 * 添加样式
 * @param el: DOMElement
 * @param cls: string，如'k kk kkk'
 */
export function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/**
 * 移除样式
 * @param el: DOMElement
 * @param cls: string，如'k kk'
 */
export function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';

    for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

/**
 * 是否包含某样式
 * @param el: DOMElement
 * @param cls: string
 * @returns {boolean}
 */
export function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
};

/**
 * 判断选择器是否可以匹配到元素
 * @param {*} el 
 * @param {*} selector 
 */
export function elementMatches(el, selector) {
    const matches =
            Element.prototype.matches ||
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(selector) {
                const items = (this.document || this.ownerDocument).querySelectorAll(selector),
                    i = items.length;
                return [...items].findIndex(item => item === this) > -1;
            };
    
    return matches.call(el, selector);
}