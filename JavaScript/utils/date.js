import { leftPad } from './base';
/**
 * 格式化日期
 * @param date: Date
 * @param fmt: String, 如'YYYY-MM-DD hh:mm:ss'
 * @returns {string}
 */
export function formatDate(date, fmt) {
    const o = {
        "M+": date.getMonth() + 1, // 月
        "D+": date.getDate(), // 日
        "H+": date.getHours(), // 24小时制
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, leftPad((date.getFullYear() + "").substr(4 - RegExp.$1.length), RegExp.$1.length, '0'));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 获取相对日期
 * @param date: Date
 * @param dValue: number，偏移量，如向后10天，传递10
 * @param type: string，'year' | 'momth' | 'day' | 'hour' | 'minute' | 'second'
 * @param after: boolean，true表示往后计，false往前计
 * @returns {Date}
 */
export function getRelativeDate(date = new Date(), dValue, type, after) {
    let rDate = date, time = '', cloneDate = null;
    switch (type) {
        case 'second':
            time = date.valueOf() + (after ? (dValue * 1000) : -(dValue * 1000));
            rDate = new Date(time);
            break;
        case 'minute':
            time = date.valueOf() + (after ? (dValue * 60 * 1000) : -(dValue * 60 * 1000));
            rDate = new Date(time);
            break;
        case 'hour':
            time = date.valueOf() + (after ? (dValue * 60 * 60 * 1000) : -(dValue * 60 * 60 * 1000));
            rDate = new Date(time);
            break;
        case 'day':
            time = date.valueOf() + (after ? (dValue * 24 * 60 * 60 * 1000) : -(dValue * 24 * 60 * 60 * 1000));
            rDate = new Date(time);
            break;
        case 'month':
            cloneDate = new Date(date.valueOf());
            cloneDate.setMonth(cloneDate.getMonth() + (after ? dValue : -dValue));
            rDate = cloneDate;
            break;
        case 'year':
            cloneDate = new Date(date.valueOf());
            cloneDate.setFullYear(cloneDate.getFullYear() + (after ? dValue : -dValue));
            rDate = cloneDate;
            break;
    }
    return rDate;
}

const divisors = {
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000
};

/**
 * 获取日期该月的最后一天
 * @param date: Date
 * @returns {Date}
 */
export function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * 获取日期该年的第一天
 * @param date: Date
 * @returns {Date}
 */
export function beginOfYear(date) {
    return new Date(date.getFullYear(), 0, 0);
}

/**
 * 获取日期该年的最后一天
 * @param date: Date
 * @returns {Date}
 */
export function endOfYear(date) {
    return new Date(date.getFullYear() + 1, 0, 0);
}

/**
 * 求日期是该年的第几天
 * @param date: Date
 * @returns {number}
 */
export function dayOfYear(date) {
    return (date - beginOfYear(date)) / divisors.days;
}

/**
 * 求日期该年共多少天
 * @param date: Date
 * @returns {number}
 */
export function daysInYear(date) {
    return (endOfYear(date) - beginOfYear(date)) / divisors.days;
};

/**
 * 求2个日期秒数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffSeconds(dateLeft, dateRight) {
    return (dateLeft - dateRight) / divisors.seconds;
}

/**
 * 求2个日期分钟数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffMinutes(dateLeft, dateRight) {
    return (dateLeft - dateRight) / divisors.minutes;
}

/**
 * 求2个日期小时数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffHours(dateLeft, dateRight) {
    return (dateLeft - dateRight) / divisors.hours;
}

/**
 * 求2个日期天数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffDays(dateLeft, dateRight) {
    return (dateLeft - dateRight) / divisors.days;
}

/**
 * 求2个日期周数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffWeeks(dateLeft, dateRight) {
    return diffDays(dateLeft, dateRight) / 7;
}

/**
 * 求2个日期月数之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffMonth(dateLeft, dateRight) {
    let eom, ret;
    ret = (dateLeft.getFullYear() - dateRight.getFullYear()) * 12;
    ret += dateLeft.getMonth() - dateRight.getMonth();
    eom = endOfMonth(dateRight).getDate();
    ret += (dateLeft.getDate() / eom) - (dateRight.getDate() / eom);
    return ret;
}

/**
 * 求2个日期年份之差
 * @param dateLeft: Date
 * @param dateRight: Date
 * @returns {number}
 */
export function diffYears(dateLeft, dateRight) {
    let ret = dateLeft.getFullYear() - dateRight.getFullYear();
    ret += (dayOfYear(dateLeft) - dayOfYear(dateRight)) / daysInYear(dateRight);
    return ret;
}