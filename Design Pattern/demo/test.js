const HttpUtils = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            url += params ? '?' + HttpUtils.createData(params) : '';
            fetch(url)
                .then(res => res.json())
                .then(resolve)
                .catch(reject);
        })
    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: HttpUtils.createData(params),
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject);
        })
    },
    createData(obj = {}) {
        return Object.keys(obj).reduce((str, prop, index) => {
            return str += (index === 0 ? '' : '&') + prop + '=' + obj[prop];
        }, '');
    }
}

function ajax(obj) {
    const method = obj.method || 'get',
        data = obj.data,
        success = obj.success,
        error = obj.error;

    let str = '', url = obj.url;
    if (data) {
        // 处理数据
        for (let key in data) {
            str += key + '=' + data[key] + '&';
        }
    }
    if (method.indexOf('get') > -1) {
        url += '?' + str + 't_=' + Date.now(); // 解决get缓存问题
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.send(str || null);
    xhr.onreadystatechange = function () {
        console.log(xhr);
        if (xhr.readyState !== 4)
            return;
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            success && success(JSON.parse(xhr.responseText));
        } else {
            error && error(xhr.status);
        }
    }
}

function ajaxAdapter(obj) {
    const noop = () => {};
    try {
        const method = obj.method || 'get',
            url = obj.url,
            data = obj.data,
            success = obj.success || noop,
            error = obj.error || noop;
        HttpUtils[method](url, data)
            .then(success)
            .catch(error);
    } catch(err) {
        error(err);
    }
}

function ajax(obj) {
    ajaxAdapter(obj);
}

ajax({
    method: 'get',
    url: 'https://www.wangsucloud.com/base-portal/frontpages/searchitems/query',
    success(msg) {
        console.log(msg);
    },
    error(msg) {
        console.log(msg);
    },
});

ajax({
    method: 'post',
    url: 'https://www.wangsucloud.com/base-portal/search',
    data: {
        keyword: '云服务器', 
        searchType: 0,
    },
    success(msg) {
        console.log(msg);
    },
    error(msg) {
        console.log(msg);
    },
});