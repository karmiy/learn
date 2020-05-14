const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay) {
        console.log('500 元定金预购, 得到 100 优惠券');
    } else {
        order200(orderType, pay, stock); // 将请求传递给 200 元订单
    }
}

const order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay) {
        console.log('200 元定金预购, 得到 50 优惠券');
    } else {
        orderNormal(orderType, pay, stock); // 将请求传递给普通订单
    }
}

const orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买, 无优惠券');
    } else {
        console.log('手机库存不足');
    }
}

order500(1, true, 500); // 输出：500 元定金预购, 得到 100 优惠券
order500(1, false, 500); // 输出：普通购买, 无优惠券
order500(2, true, 500); // 输出：200 元定金预购, 得到 500 优惠券
order500(3, false, 500); // 输出：普通购买, 无优惠券
order500(3, false, 0); // 输出：手机库存不足