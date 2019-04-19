/**
 * 格式化日期
 * @param date: Date
 * @param fmt: String, 如'YYYY-MM-DD hh:mm:ss'
 * @returns {string}
 */
export function formatDate(date, fmt) {
    const o = {
        "M+": date.getMonth() + 1, //月份
        "D+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
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
    let rDate = data, time = '', cloneDate = null;
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
            cloneDate = new Date(data.valueOf());
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