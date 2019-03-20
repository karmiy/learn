/*头部header导航栏展开导航明细*/
var headerNavUl = document.querySelector("#header .h-main .h-nav");
var headerDetailNav = document.querySelector("#header .detailNav");
headerNavUl.onmouseenter = function () {
    headerDetailNav.style.visibility = "visible";
}
headerNavUl.onmouseleave = function (e) {
    //判断是不是从UL左右侧离开的，是的话直接隐藏
    var ev = e || window.event;
    var ex = ev.clientX;
    var ulLeft = headerNavUl.getBoundingClientRect().left;
    var ulRight = headerNavUl.getBoundingClientRect().right;
    if(ex<=ulLeft || ex>=ulRight){
        headerDetailNav.style.visibility = "hidden";
        return;
    }else {
        //不是的话表示鼠标进入了明细，不隐藏
    }
}
headerDetailNav.onmouseleave = function () {
    headerDetailNav.style.visibility = "hidden";
}
/*头部header登录展开个人中心*/
var headerUser = document.querySelector("#header .h-main .h-user");
var headerPersonal = document.querySelector("#header .h-main .h-user .user-drop");

/*综合资讯轮播图*/
var homePicUl = document.querySelector("#home .carousel .pic");
var homeNavLis = document.querySelectorAll("#home .carousel .nav li");
for(var i=0,len=homeNavLis.length;i<len;i++){
    (function(i){
        homeNavLis[i].onmouseenter = function() {
            //先清除全部li的.on
            for(var j=0;j<len;j++){
                homeNavLis[j].classList ? homeNavLis[j].classList.remove("on") : removeClass(homeNavLis[j],"on");
                //homeNavLis[j].classList.remove('on');
            }
            homeNavLis[i].classList ? homeNavLis[i].classList.add("on") : addClass(homeNavLis[i],"on");
            //homeNavLis[i].classList.add('on');
            homePicUl.style.marginLeft = -820*i+"px";
        }
    })(i);
}
/*最新资讯切换*/
var newsNavLis = document.querySelectorAll("#information .news .news-tab .nav li");
var newsContents = document.querySelectorAll("#information .news .news-contents");
for(var i=0,leng=newsNavLis.length;i<leng;i++){
    (function(i){
        newsNavLis[i].onmouseenter = function() {
            //先清除全部li的.on，content的.currentNews
            for(var j=0;j<leng;j++){
                newsNavLis[j].classList ? newsNavLis[j].classList.remove("on") : removeClass(newsNavLis[j],"on");
                //newsNavLis[j].classList.remove('on');
                newsContents[j].classList ? newsContents[j].classList.remove("currentNews") : removeClass(newsContents[j],"currentNews");
                //newsContents[j].classList.remove('currentNews');
            }
            newsNavLis[i].classList ? newsNavLis[i].classList.add("on") : addClass(newsNavLis[i],"on");
            //newsNavLis[i].classList.add('on');
            newsContents[i].classList ? newsContents[i].classList.add("currentNews") : addClass(newsContents[i],"currentNews");
            //newsContents[i].classList.add('currentNews');
        }
    })(i);
}

/*绑定周免英雄的下拉按钮*/
function bindHeroDrapButtom() {
    var freeButton = document.querySelector("#information .hero .hero-content.currentHero .suspend .free-buttom");
    if(!freeButton){
        return;
    }
    var suspend = freeButton.parentNode;
    var freeHeroUl = freeButton.parentNode.querySelector('ul');
    var freeHeroLis = freeButton.parentNode.querySelectorAll('ul li');
    //展开前的高度是10（默认10个）/2*(li高度+10)（10是margin-bottom）
    var smallUlHeight = (10 / 2) * (freeHeroLis[0].offsetHeight + 10);
    //展开后的高度是li数量/2*(li高度+10)（10是margin-bottom）
    var bigUlHeight = (freeHeroLis.length / 2) * (freeHeroLis[0].offsetHeight + 10);
    var flag = -1;
    //默认初始化UL为未展开状态
    freeHeroUl.style.height = smallUlHeight + "px";
    freeButton.classList?freeButton.classList.remove("up-buttom"):removeClass(freeButton,"up-buttom");
    //freeButton.classList.remove("up-buttom");
    freeButton.classList?freeButton.classList.add("down-buttom"):addClass(freeButton,"down-buttom");
   // freeButton.classList.add("down-buttom");

    freeButton.onclick = function () {
        //点击后ul展开或缩小
        if (flag + 1) {
            freeHeroUl.style.height = smallUlHeight + "px";
            //改变箭头方向
            freeButton.classList?freeButton.classList.remove("up-buttom"):removeClass(freeButton,"up-buttom");
            //freeButton.classList.remove("up-buttom");
            freeButton.classList?freeButton.classList.add("down-buttom"):addClass(freeButton,"down-buttom");
            //freeButton.classList.add("down-buttom");
            //改变背景
            suspend.classList?suspend.classList.remove("suspend-on"):removeClass(suspend,"suspend-on");
            //suspend.classList.remove("suspend-on");
        } else {
            freeHeroUl.style.height = bigUlHeight + "px";
            freeButton.classList?freeButton.classList.remove("down-buttom"):removeClass(freeButton,"down-buttom");
            //freeButton.classList.remove("down-buttom");
            freeButton.classList?freeButton.classList.add("up-buttom"):addClass(freeButton,"up-buttom");
            //freeButton.classList.add("up-buttom");
            //改变背景
            suspend.classList?suspend.classList.add("suspend-on"):addClass(suspend,"suspend-on");
            //suspend.classList.add("suspend-on");
        }
        flag *= -1;
    }
}
/*最新皮肤、最新英雄、周免英雄切换*/
var heroNavLis = document.querySelectorAll("#information .hero .hero-tab ul.nav li");
var heroContents = document.querySelectorAll("#information .hero .hero-content");
for(var i=0,leg=heroNavLis.length;i<leg;i++){
    (function(i){
        heroNavLis[i].onmouseenter = function() {
            //先清除全部li的.on，content的.currentHero
            for(var j=0;j<leg;j++){
                heroNavLis[j].classList ? heroNavLis[j].classList.remove("on") : removeClass(heroNavLis[j],"on");
                //heroNavLis[j].classList.remove('on');
                heroContents[j].classList ? heroContents[j].classList.remove("currentHero") : removeClass(heroContents[j],"currentHero");
                //heroContents[j].classList.remove('currentHero');
            }
            heroNavLis[i].classList ? heroNavLis[i].classList.add("on") : addClass(heroNavLis[i],"on");
            //heroNavLis[i].classList.add('on');
            heroContents[i].classList ? heroContents[i].classList.add("currentHero") : addClass(heroContents[i],"currentHero");
            //heroContents[i].classList.add('currentHero');
            //绑定下拉按钮
            bindHeroDrapButtom();
        }
    })(i);
}
/*最新推荐切换（视频推荐，活动推荐）*/
var recommendNavLis = document.querySelectorAll("#recommend .rec-tab ul li");
var recommendContents = document.querySelectorAll("#recommend .rec-content");
for(var i=0,lg=recommendNavLis.length;i<lg;i++){
    (function(i){
        recommendNavLis[i].onmouseenter = function() {
            for(var j=0;j<lg;j++){
                recommendNavLis[j].classList ? recommendNavLis[j].classList.remove("on") : removeClass(recommendNavLis[j],"on");
                //recommendNavLis[j].classList.remove('on');
                recommendContents[j].classList ? recommendContents[j].classList.remove("currentContent") : removeClass(recommendContents[j],"currentContent");
                //recommendContents[j].classList.remove('currentContent');
            }
            recommendNavLis[i].classList ? recommendNavLis[i].classList.add("on") : addClass(recommendNavLis[i],"on");
            //recommendNavLis[i].classList.add('on');
            recommendContents[i].classList ? recommendContents[i].classList.add("currentContent") : addClass(recommendContents[i],"currentContent");
            //recommendContents[i].classList.add('currentContent');
        }
    })(i);
}
/*兼容IE8无法识别classList*/
function hasClass(ele, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}