const toString = Object.prototype.toString;

/**
 * 是否为数组
 * @param value: any
 * @returns {boolean}
 */
export const isArray = Array.isArray || function(value) {
    return toString.call(value) === '[object Array]';
}

/**
 * 是否为函数
 * @param value: any
 * @returns {boolean}
 */
export const isFunction = function(value) {
    return toString.call(value) === '[object Function]';
}

/**
 * 是否为整数
 * @param value: any
 * @returns {boolean}
 */
export const isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/**
 * 是否为IE
 * @returns {boolean}
 */
export const isIE = function() {
    return !isNaN(Number(document.documentMode));
};

/**
 * 是否为Edge
 * @returns {boolean}
 */
export const isEdge = function() {
    return navigator.userAgent.indexOf('Edge') > -1;
};

/**
 * polyfill trim（去除前后空格）
 * @type {string}
 */
export function trim(string) {
    return trim && trim(string) || (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/**
 * 转驼峰
 * @param name
 * @returns {string}
 */
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
export function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 * 左补位，如日期'1'补为'01'
 * @param str: string
 * @param len: number
 * @param ch: string，用什么补位，默认空格补
 * @returns {string}
 */
const spaceCache = [
    '',
    ' ',
    '  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
    '         '
];

export function leftPad (str, len, ch) {
    str = str + '';
    len = len - str.length;
    if (len <= 0) return str;

    if (!ch && ch !== 0) ch = ' ';
    ch = ch + '';
    if (ch === ' ' && len < 10) return spaceCache[len] + str;
    var pad = '';
    while (true) {
        if (len & 1) pad += ch;
        len >>= 1;
        if (len) ch += ch;
        else break;
    }
    return pad + str;
}