// getInstance 实现单例模式
class Singleton {
    constructor(name) {
        this.name = name;
    }
    getName() {
        alert(this.name);
    }
}
Singleton.getInstance = (function() {
    let instance = null;
    return function(name) {
        if (!instance) {
            instance = new Singleton(name);
        }
        return instance;
    }
})();

const a = Singleton.getInstance('a'),
    b = Singleton.getInstance('b');

console.log(a === b);

// 透明的单例模式、代理实现单例
class CreateDiv {
    constructor() {
        // ...
    }
    // ...
}

const ProxySingletonCreateDiv = (function() {
    let instance;
    return class {
        constructor() {
            if (!instance) instance = new CreateDiv();

            return instance;
        }
    }
}());

const c = new ProxySingletonCreateDiv(),
    d = new ProxySingletonCreateDiv();

console.log(c === d);

// 惰性单例
// 非惰性
const loginLayer = (function() {
    const div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
})();

document.getElementById('loginBtn').onclick = function() {
    loginLayer.style.display = 'block';
}

// 惰性
const createLoginLayer = (function() {
    let div;
    return function() {
        if (!div) {
            div = document.createElement('div');
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        return div;
    }
}());

document.getElementById('loginBtn').onclick = function() {
    const loginLayer = createLoginLayer();
    loginLayer.style.display = 'block';
};

// 通用单例
const getSingle = function(fn) { 
    let result; 
    return function(){ 
        return result || (result = fn.apply(this, arguments)); 
    } 
};

const createLogin = function() {
    const div = document.createElement( 'div' ); 
    div.style.display = 'none'; 
    document.body.appendChild( div ); 
    return div;
}

const createSingleLogin = getSingle(createLogin);

document.getElementById('loginBtn').onclick = function() {
    const loginLayer = createSingleLogin();
    loginLayer.style.display = 'block';
};

const createIframe = function() {
    const iframe = document.createElement( 'iframe' ); 
    iframe.style.display = 'none'; 
    document.body.appendChild( iframe ); 
    return iframe;
}

const createSingleIframe = getSingle(createIframe);

// one
const bindEvent = getSingle(function() { 
    console.log(1);
    document.getElementById('app').onclick = function(){ 
        console.log(1);
    } 
    return true; 
});