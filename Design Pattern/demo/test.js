const header = (function() { // header 模块
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置 header 模块的头像');
        }
    }
})();
const nav = (function() { // nav 模块
    login.listen('loginSucc', function(data) {
        nav.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(avatar) {
            console.log('设置 nav 模块的头像');
        }
    }
})();

const address = (function() { // address 模块
    login.listen('loginSucc', function(obj) {
        address.refresh(obj);
    });
    return {
        refresh: function(avatar) {
            console.log('刷新收货地址列表');
        }
    }
})();