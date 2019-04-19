/**
 * polyfill getComputedStyle
 * @param dom: DOMElement
 * @returns {function}
 */
export function DOMComputedStyle(dom) {
    return getComputedStyle ? getComputedStyle(dom) : dom.currentStyle;
}