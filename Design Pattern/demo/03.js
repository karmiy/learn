// 奖金-基本实现
/* const calculateBonus = functionrformanceLevel, salary) {
    if (performanceLevel === 'S') {
        return salary * 4;
    }
    if (performanceLevel === 'A') {
        return salary * 3;
    }
    if (performanceLevel === 'B') {
        return salary * 2;
    }
}; */

// 奖金-组合函数
/* const performanceS = functionalary) {
    return salary * 4;
};
const performanceA = functionalary) {
    return salary * 3;
};
const performanceB = functionalary) {
    return salary * 2;
};
const calculateBonus = functionerformanceLevel, salary) {
    if (performanceLevel === 'S') {
        return performanceS(salary);
    }
    if (performanceLevel === 'A') {
        return performanceA(salary);
    }
    if (performanceLevel === 'B') {
        return performanceB(salary);
    }
}; */

// 奖金-策略模式
const strategies = {
    "S": function (salary) {
        return salary * 4;
    },
    "A": function (salary) {
        return salary * 3;
    },
    "B": function (salary) {
        return salary * 2;
    }
};

const calculateBonus = function (level, salary) {
    return strategies[level](salary);
};

calculateBonus('B', 3000);
calculateBonus('S', 4000);

// 表单验证-初始
/* const registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function() {
    if (registerForm.userName.value === '') {
        alert('用户名不能为空');
        return false;
    }
    if (registerForm.password.value.length < 6) {
        alert('密码长度不能少于 6 位');
        return false;
    }
    if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
        alert('手机号码格式不正确');
        return false;
    }
} */

// 表单校验-策略模式
const strategies = {
    isNonEmpty: function (value, errorMsg) { // 不为空
        if (value === '') return errorMsg;
    },
    minLength: function (value, length, errorMsg) { // 限制最小长度
        if (value.length < length) return errorMsg;
    },
    isMobile: function (value, errorMsg) { // 手机号码格式
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) return errorMsg;
    }
};

registerForm.onsubmit = function() {
    let errorMsg = 
        strategies.isNonEmpty(registerForm.userName.value, '用户名不能为空')
    || strategies.minLength(registerForm.password.value, 6, '密码长度不能少于 6 位')
    || strategies.isMobile(registerForm.phoneNumber.value, '手机号码格式不正确');
    if (errorMsg) {
        alert(errorMsg);
        return false;
    }
}