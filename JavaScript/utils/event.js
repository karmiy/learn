/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export const triggerEvent = function(elm, name, ...opts) {
    let eventName;
  
    if (/^mouse|click/.test(name)) {
      eventName = 'MouseEvents';
    } else if (/^key/.test(name)) {
      eventName = 'KeyboardEvent';
    } else {
      eventName = 'HTMLEvents';
    }
    const evt = document.createEvent(eventName);
    
    // event.initEvent(eventType,canBubble,cancelable)
    // canBubble: 事件是否起泡
    // cancelable: 是否可以用 preventDefault() 方法取消事件
    evt.initEvent(name, ...opts);
    elm.dispatchEvent
      ? elm.dispatchEvent(evt)
      : elm.fireEvent('on' + name, evt);
  
    return elm;
};

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {Element} elm
 * @param {*} opts
 */
export const triggerClick = function(elm, ...opts) {
    triggerEvent(elm, 'mousedown', ...opts);
    triggerEvent(elm, 'mouseup', ...opts);
  
    return elm;
};

/**
 * 触发 keydown 事件
 * @param {Element} elm
 * @param {keyCode} int
 */
export const triggerKeyDown = function(el, keyCode) {
    const evt = document.createEvent('Events');
    evt.initEvent('keydown', true, true);
    evt.keyCode = keyCode;
    el.dispatchEvent(evt);
};