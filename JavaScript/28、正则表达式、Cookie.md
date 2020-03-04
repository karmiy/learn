## 正则表达式

正则表达式是**对象**

通常用来校验字符串是否匹配某个规则

### 定义正则表达式

    1、双斜杠定义
    
    var r1 = /abc/
    
    2、构造RegExp实例定义
    
    var r2 = new RegExp('karmiy');
    
    // 区别
    var s = 'karmiy';
    var r1 = /s/; // 这样无法得到s变量，而是s字符
    var r2 = new RegExp(s); // 可以得到s变量去做匹配

    
    // 注
    RegExp生成的实例，会解析为双斜杠正则
    
    var r = new RegExp('abc');
    console.log(r); // 输出/abc/
    
    也就是说：
    var r = new RegExp('\\n') 不等价于 /\\n/
    因为：
    字符串'\\n'的\\是转义\，所以实则是字符串 \n
    即：
    var r = new RegExp('\\n') 等价于 /\n/
    如果要等价/\\n/，则应该是var r = new RegExp('\\\\n');
    
    
### test

    // 说明
    检测字符串是否符合规则，返回boolean
    
    // 示例
    var r = /abc/;
    console.log(r.test('abcd')); // true
    console.log(r.test('abd')); // false
    
### match

    // 说明
    返回匹配的内容的数组
    var s = '4567811a556781';
    console.log(s.match(/\d{2,5}/)); // [0: "45678", groups: undefined, index: 0, input: "4567811a556781", length: 1]
    
    // 注
    返回的是个数组，只是有groups、index、input这些自定义属性
    如上例，其实就是返回["45678"]， 这个数组有自定义属性{groups: undefined, index: 0, input: "4567811a556781", length: 1}
    以下的案例中就不把自定义属性写出来了
    
### \s、\S

    // 说明
    \s 匹配所有空格字符
    \S 匹配所有非空格字符
    
    // 示例
    var r = /\s/;
    console.log(r.test('  ')); // true
    
### \d、\D

    // 说明
    \d 匹配数字
    \D 匹配非数字
    
    // 示例
    var r = /\d/;
    console.log(r.test('1a')); // true
    
### \w、\W

    // 说明
    \w 匹配字符（字母、数字、下划线）
    \W 匹配非字符
    
    // 示例
    var r = /\w/;
    console.log(r.test('呵呵_')); // true
    console.log(r.test('12')); // true
    console.log(r.test('aa')); // true

### \b、\B

    // 说明
    \b 匹配单词边界(除了\w不是单词边界，其他都是单词边界，包括起始和结尾)
    \B 匹配非单词边界
    
    // 示例
    var r = /\byou\b/;
    console.log(r.test('what are youhh doing?')); // false，hh属于\w，不是单词边界
    console.log(r.test('what are you11 doing?')); // false，11属于\w，不是单词边界
    console.log(r.test('what are you_ doing?')); // false，_属于\w，不是单词边界
    console.log(r.test('what are you-k doing?')); // true，-是单词边界
    console.log(r.test('what are you doing?')); // true，空格是单词边界
    console.log(r.test('you are doing?')); // true，起始是单词边界
    console.log(r.test('If you')); // true，结尾是单词边界
    
### .点符号

    // 说明
    匹配所有字符，除了\n \r \t这些
    
    // 示例
    console.log(/./.test('a1-')); // true，这里.是任意字符
    console.log(/\./.test('.')); // true，这里.是正常的字符.（被\转义了）
    
### {}量词

    // 示例一：{n} 匹配连续n个
    var r = /\d{10}/; // 匹配连续10个数字
    console.log(r.test('1234567890')); // true
    console.log(r.test('1234567a890')); // false
    console.log(r.test('123456789')); // false
    
    // 示例二：{n,m} 匹配连续n~m个，最少n，最多m
    var r = /\d{1,2}/; // 匹配连续2~8个数字
    console.log(r.test('1')); // true
    console.log(r.test('12')); // true
    console.log(r.test('123')); // true，因为'12'、'3'都满足，有这2种匹配项
    
    // 示例三：{n,} 最少n个，没有最大限制
    console.log(/\d{3,}/.test('12')); // false
    console.log(/\d{3,}/.test('123')); // true
    
### 特殊量词

    // 1、+号，等同于{1,}，至少一个
    console.log(/\d+/.test('')); // false
    console.log(/\d+/.test('1')); // true
    
    // 2、?号，等同于{0, 1}，有一个或没有
    console.log(/\d?/.test('')); // true
    console.log(/\d?/.test('1')); // true
    console.log(/\d?/.test('12')); // true，因为'1', '2', ''都满足
    
    // 3、*号，等同于{0,}，有无皆可
    console.log(/\d*/.test('')); // true
    console.log(/\d*/.test('1')); // true
    
### 贪婪量词、惰性量词

    // 1、默认是贪婪量词，往多的去匹配
    var s = '4567811a556781';
    console.log(s.match(/\d{2,}/));
    // 匹配到'4567811'，输出 ["4567811"]
    
    // 2、调整为惰性匹配
    var s = '4567811a556781';
    console.log(s.match(/\d{2,}?/));
    // 匹配到'45'，输出 ["45"]
    
### 修饰词g、i、m

    // 说明
    g 全局匹配
    i 不区分大小写
    m 换行匹配，比较少用
    
    // 示例一，修饰词g
    var s = 'karmiy456karloy9999';
    console.log(s.match(/\d+/)); // 输出 ["456"]
    console.log(s.match(/\d+/g)); // 输出 ["456", "9999"]
    console.log(s.match(new RegExp('\\d+', 'g'))); // RegExp是放在这二个参数
    
    // 注
    加了修饰词g后，返回的数组就不带那些index、input自定义属性了
    
    // 示例二，修饰词i
    var s = 'Karmiy666';
    console.log(s.match(/kARmiy/i)); // 输出 ["Karmiy"]
    
    // 示例三，组合ig
    var s = `karMiy456karloy9999`;
    console.log(s.match(/karmiy\d/ig)); // ["karMiy4"]
    
### 组
    
    // 说明
    正则表达是里()代表一个组
    
    // 示例一
    var s = 'ababab';
    console.log(s.match(/ab+/)); // 输出["ab"]
    // 这里+代表b而不是ab
    
    // 示例二
    var s = 'ababab';
    console.log(s.match(/(ab)+/)); // 输出 ["ababab", "ab"]
    // 这里括号(ab)就是一个组
    // 如果正则里还有组，match也没有g修饰，那match返回的数组第二位开始会是组的内容。即返回的数组是["ababab", "ab"]，第一项是匹配项，第二项是组
    
    // 示例三
    var s = 'ababababc';
    console.log(s.match(/(ab)+(c)/)); // 输出 ["ababababc", "ab", "c"]
    
    // 示例三
    var s = 'ababababc';
    console.log(s.match(/(ab)+(c)/g)); // 输出 ["ababababc"]，加了修饰词g后，返回的数组不带组
    
    // 示例四
    var s = 'ababababc';
    console.log(s.match(/((ab)c)+/)); // 输出["abc", "abc", "ab"]，大的组在前，子组在后
    
### |符号

    // 说明
    或
    
    // 示例一
    var s = 'abc';
    console.log(s.match(/aa|c/)); // 匹配aa或c，输出["c"]
    
    // 示例二
    var s = 'abc';
    console.log(s.match(/a(h|b)/)); // 匹配ah或ab，输出["ab", "b"]
    
### []字符集

    // 示例一，[...]表示[]里任意一个，相当于|或，也可以，隔开
    var s = 'abcde';
    console.log(s.match(/[abc]/g)); // ["a", "b", "c"]，相当于a|b|c
    console.log(s.match(/[a,b,c]/g)); // ["a", "b", "c"]，相当于a|b|c
    
    // 示例二，[...]+表示里面这些字符任意组成
    var s = 'abbbcde';
    console.log(s.match(/[abc]+/g)); // ["abbbc"]

    var s = 'a123bd';
    console.log(s.match(/[ab]+/g)); // ["a", "b"]

    var s = 'a123bd';
    console.log(s.match(/[a31b]+/g)); // ["a1", "3b"]，因为a能在[a31b]里找到，1也可以，2不行，所以先得出a1，接着3可以在[a31b]里找到，b也可以，d不行，所以得出3b
    
    // 示例三，[^...]表示除了[]里的字符
    var s = 'abcdef';
    console.log(s.match(/[^abc]+/g)); // ["def"]，除了abc
    
    // 示例四，[ - ]表示一个区间字段
    console.log('01547'.match(/[0-5]/g)); // ["0", "1", "5", "4"]，表示0-5的数字
    console.log('abcd123'.match(/[a-z]/g)); // ["a", "b", "c", "d"]，表示a-z的字符
    console.log('ABcd123'.match(/[A-Z]/g)); // ["A", "B"]，表示A-Z的字符

    区间遵循ASCII码对照表顺序，所以可以如[A-z]，不能[a-Z]
    
    // 示例五，匹配中文
    console.log('或许这就是绅士ba'.match(/[\u4e00-\u9fa5]/g)); // ["或", "许", "这", "就", "是", "绅", "士"]
    
    // 注
    大部分有特殊意义的字符，在字符集里都没有特殊意义，如{}、()在[]里，只是普通的字符，而不是量词和组
    var s = '{5}';
    console.log(s.match(/[{5}]+/)); // ["{5}"]，不需要转义{}
    
### ^、$符号

    // 说明
    ^ 起始位置
    $ 终止位置
    
    // 示例
    var s = 'karmiy';
    console.log(/^ka/.test(s)); // true
    console.log(/y$/.test(s)); // true
    
### replace

    // 说明
    替换匹配内容
    
    // 示例一，g修饰词全替换
    var s = '你可真是个绅士，绅士真像你'
    var ns = s.replace(/你/g, '我');
    console.log(s); // '你可真是个绅士，绅士真像你'，不会改变原字符串
    console.log(ns); // '我可真是个绅士，绅士真像我'
    
    // 示例二，只替换一个
    var s = '你可真是个绅士，绅士真像你'
    var ns = s.replace(/你/, '我');
    console.log(ns); // '我可真是个绅士，绅士真像你'
    
    // 示例三，第二个参数是函数，则每个匹配项都会调用这个函数，return值作为替换值
    var s = '你可真是个绅士，绅士真像你'
    var ns = s.replace(/你/g, function(r) {
        return r + '们';
    });
    console.log(ns); // '你们可真是个绅士，绅士真像你们'
    
    // 示例四，*替换敏感词
    var s = '我艹，你也是牛批，说你智障都有点侮辱智障这个词'
    var ns = s.replace(/艹|牛批|智障/g, function(r) {
        var len = r.length;
        return Array(len).fill('*').join('');
    })
    console.log(ns); // '我*，你也是**，说你**都有点侮辱**这个词'
  
### 捕获组
    
#### 捕获组\X
    // 说明
    每个组()，都有自己的序号：1、2、3...，捕获组即是用\1、\2、\3...去匹配每一个组
    
    // 示例一
    var s = 'abcabc';
    var r = /(abc)\1/; 这里\1代表第一个捕获组，即(abc)，所以相当于/(abc){2}/
    console.log(s.match(r)); // ["abcabc", "abc"]
    
    // 示例二
    var s = 'abcabcc';
    var r = /(ab)(c)\2/; // 这里\2是(c)
    console.log(s.match(r)); // ["abcc", "ab", "c"]
    
    // 示例三
    var s = 'abcjkjkabcjkk';
    var r = /(ab)(c)(j(k))\4/; // 嵌套关系，外面先编号，所以\4是(k)
    console.log(s.match(r)); // ["abcjkk", "ab", "c", "jk", "k"]
    
    // 示例四，捕获组与量的差别
    var s = 'a1b2';
    var r = /([a-z]\d){2}/;
    console.log(s.match(r)); // ["a1b2", "b2"]
    
    r = /([a-z]\d)\1/;
    console.log(s.match(r)); // null，这样只能匹配到如a1a1，因为捕获组\1和组的内容是相同的。如(\d)(a)\1，可以匹配9a9，不能匹配9a8
    
#### 跳过当前捕获组?:

    // 说明
    跳过当前捕获组，不编号
    
    // 示例
    var s = 'a454d6dgaga4d6';
    var r = /(a4)(?:54).*(ga)\2/; // ?:是跳过这个组，不编号，即\1是(a4)，\2是(ga)，而(54)不被编号
    console.log(s.match(r)); // ["a454d6dgaga", "a4", "ga"]
    
#### 不捕获组?=、?<=

    // 说明
    (?=XXX) 匹配以某字符结尾的字符串，该字符以XXX开头，并且不捕获到分组中
    
    // 示例一：?=
    var s = 'Windows10';
    var r = /Windows(?=10)/; // 匹配10结尾，但是不把(10)放到匹配到的结果里
    console.log(s.match(r)); // ["Windows"]

    var s = 'Windows10ab291';
    var r = /Windows(?=10)/; // 匹配10XXX结尾，但是不把(10XXX)放到匹配到的结果里
    console.log(s.match(r)); // ["Windows"]
    
    // 示例二：?=
    var s = 'Windows98';
    var r = /Windows(?=10)/;
    console.log(s.match(r)); // null，匹配不到
    
    // 注
    ?= 
    1、在规定的表达式后面必须带上
    2、但是不显示在匹配的内容后面
    3、这个组也不会被编号
    
    // 说明
    (?<=XXX) 匹配以某字符开头的字符串，该字符串以XXX结尾，并且不捕获到分组中
    
    // 示例
    var s = '10Windows';
    var r = /(?<=10)Windows/; // 和?=相同，只是匹配的是开头
    console.log(s.match(r)); // ["Windows"]
    
    // 搭配示例 ?=、?<=，匹配如vue中{{XXX}}中间的XXX内容
    var s = 'abc{{username}}das';
    var r = /(?<={{).+(?=}})/;
    console.log(s.match(r)); // ["username"]
    
#### 不捕获组?!、?<!

    // 说明
    (?!XXX) 与?=相同，不同的是(?!XXX)匹配不以XXX结尾的字符串
    
    // 示例
    var s = 'Windows90';
    var r = /Windows(?!10)/; // 匹配不以10结尾，且不把(...)放到匹配到的结果里
    console.log(s.match(r)); // "Windows"
    
    // 说明
    (?<!XXX) 与?<=相同，不同的是(?<!XXX)匹配不以XXX开头的字符串
    
    // 示例
    var s = '66Windows90';
    var r = /(?!10)Windows/; // 匹配不以10开头，且不把(...)放到匹配到的结果里
    console.log(s.match(r)); // "Windows"
    

### 案例

    // 1、用户名：仅支持中文、英文、数字、下划线、分割符"-"、小数点
    /^[\w-\.\u4e00-\u9fa5]+$/
    
    // 2、QQ号：开头不为0，最小5位，最大10
    /^[1-9]\d[4,9]$/
    
    // 3、手机号：11位，第一位1，第二位3-9
    /^1[3-9]\d{9}$/
    
    // 4、账号：最低6最大16位，数字字母下划线，不能数字开头
    /^[a-z_]\w{5,15}$/i
    
    // 5、密码：最低6位，最大18位，不允许中文字符
    /^[\w\.\\\-\],?/|+*()[{}!"';<>@#$%^&`~=:]{6,18}$/
    
    // 6、身份证：18位，开头不为0
    /^[1-9]\d{5}(18|19|20)\d{2}(02(0[1-9]|[12][0-9])|(0[1,3-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))\d{3}[\dxX]$/
    
    // 7、邮箱
    /^[1-9a-z_]\w*@[a-z0-9]{2,}\.[a-z]{2,6}(\.cn)?$/i
    
## Cookie

    // 说明
    Cookie是前端存储数据的一种方式
    不是很安全
    一般用来存储某些校验信息同数据一起发送给后端做判断
    存储的是字符串（很关键，不要以为是对象，经常有人以为可以存对象，导致存取出错）
    大部分浏览器需要在服务器环境下才能存储（webstorm打开的HTML页面默认是个服务器），火狐可以不在
    以域名（不同域名不共享）为单位存储
    存在磁盘里
    不同浏览器不共用
    关闭浏览器也在，时间到了才会消失，或手动清除
    
![Alt text](./imgs/28-01.png)


    // 存储
    document.cookie = 'name=karmiy'; // 默认浏览会话结束失效（关闭浏览器）
    
    // 设置时长
    var date = new Date(Date.now() + 24 * 60 * 60 * 1000); // 设置时长一天
    document.cookie = 'name=karmiy;expires=' + date.toUTCString(); // 要转为格林威治时间

    // 取值
    console.log(document.cookie); // "name=karmiy"，是个字符串
    
    // 关于存值是否覆盖
    我们设置document.cookie时，并不会将之前的cookie覆盖
    document.cookie = 'name=karmiy';
    document.cookie = 'code=7';
    
    后者并不会覆盖前者
    不要当做普通对象一样: obj.a = 1; obj.a = 2; console.log(obj.a);  --- 输出2
    cosnole.log(document.cookie); // 'name=karmiy; code=7'
    
    // 删除
    document.cookie = 'name=;expires=Thu, 01 Jan 1970 00:00:01 GMT'; // 内容置空，过期时间设置在当前时间之前
    
    // 封装Cookie的get、set方法
    const Cookie = {
      /**
       * set Cookie
       * @param json: object(如{name: 'karmiy'})
       * @param time: number，天数
       * @param path: string，路径
       */
      set : function(json, time, path) {
        let date = new Date(Date.now() + (time ? time : 0) * 24 * 60 * 60 * 1000);
        for (let key in json){
          document.cookie = (key + '=' + json[key] + ';')
            + (time ? ('expires=' + date.toUTCString() + ';') : '')
            + (path ? ('path=' + path + ';'): 'path=/');
        }
      },
      /**
       * get Cookie
       * @param key: string
       */
      get : function(key){
        const val = document.cookie.match(new RegExp("(^|\\s)" + key + "=([^;]*)(;|$)"));
        return val && val[2];
      },
      /**
       * delete Cookie
       * @param key: string
       */
      delete : function(key){
        document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }
    
    // 用法示例
    Cookie.set({
        name: 'karmiy',
        code: 379,
    })
    console.log(Cookie.get('code')); // '379'
    Cookie.delete('code');
    console.log(Cookie.get('code')); // null
