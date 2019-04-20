const availablePrefix = ['moz', 'ms', 'webkit'];

const requestAnimationFramePolyfill = () => {
    let lastTime = 0;
    return function (callback) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(() => {
            callback(currTime + timeToCall);
    }, timeToCall);
        return id;
    }
}

const getRequestAnimationFrame = () => {
    if(typeof window === 'undefined') {
        return () => null;
    }
    if(window.requestAnimationFrame) {
        return window.requestAnimationFrame.bind(window);
    }

    const prefix = availablePrefix.filter(key => `${key}RequestAnimationFrame` in window)[0];

    return prefix
        ? window[`${prefix}RequestAnimationFrame`]
        : requestAnimationFramePolyfill();
}

const cancelRequestAnimationFrame = (id) => {
    if(typeof window === 'undefined') {
        return null;
    }
    if(window.cancelAnimationFrame) {
        return window.cancelAnimationFrame(id);
    }

    const prefix = availablePrefix.filter(key =>
        `${key}CancelAnimationFrame` in window || `${key}CancelRequestAnimationFrame` in window
)[0];

    return prefix ?
        (
            window[`${prefix}CancelAnimationFrame`] ||
            window[`${prefix}CancelRequestAnimationFrame`]
        ).call(this, id) : clearTimeout(id);
}

const raf = getRequestAnimationFrame();
raf.cancel = cancelRequestAnimationFrame;
export default raf;