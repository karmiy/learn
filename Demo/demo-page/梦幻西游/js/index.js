//IE下不运行JS。。。
if (!(!!window.ActiveXObject || "ActiveXObject" in window)){

/*官方资讯轮播图效果*/
var featureLis = document.querySelectorAll("#consult .c-main .c-feature ul li");
var featureUl = document.querySelector("#consult .c-main .c-feature ul");
var flag = [1,1,1,1,1];
var  curLi = null;

featureLis.forEach(function (item, index) {
    item.addEventListener("mouseenter", function () {
        //console.log(flag, index);
        if (flag[index]) {
            //如果已经展开了，则不触发
            if (item.offsetWidth == 900)
                return;
            //移入LI后，先把它后面的li开关全部置为0，以防UL位移后鼠标触发后面LI的移入事件
            for (var i = index + 1; i < 5; i++) {
                flag[i] = 0;
            }
            //判断其他LI有没有展开的，有的话先收起来
            var hasOpen = false;
            for (var i = 0; i < 5; i++) {
                if (featureLis[i].offsetWidth == 900 && i != index) {
                    featureLis[i].children[1].style.width = "0";
                    hasOpen = true;
                }
            }
            //如果前面Li有需要收缩的，过.5s秒动画后，再看展开自己的内容，没有则立马展开。
            //展开时还要移动UL
            if (hasOpen) {
                setTimeout(function () {
                    item.children[1].style.width = "600px";
                    if (index == 4) {
                        featureUl.style.transform = "translate(-900px)";
                    } else {
                        featureUl.style.transform = "translate(-" + 300 * index + "px)";
                    }
                    //自己的内容展开动画.5s，后，再把它后面的LI开关都打开
                    setTimeout(function () {
                        // for(var i=index+1;i<5;i++){
                        //     flag[i] = 1;
                        // }
                        if (index != 4) {
                            flag[index + 1] = 1;
                        }
                    }, 700);
                }, 500);
            } else {
                item.children[1].style.width = "600px";
                if (index == 4) {
                    featureUl.style.transform = "translate(-900px)";
                } else {
                    featureUl.style.transform = "translate(-" + 300 * index + "px)";
                }
                //自己的内容展开动画.5s，后，再把它后面的LI开关打开
                setTimeout(function () {
                    // for(var i=index+1;i<5;i++){
                    //     flag[i] = 1;
                    // }
                    if (index != 4) {
                        flag[index + 1] = 1;
                    }
                }, 700);//为何防止开关和动画一致结束，开关晚点再开
            }

        }
    });
    item.addEventListener("mouseleave", function () {
        //离开LI后开关打开
        // flag[index] = 1;
        // console.log(flag);
    });
});
featureUl.addEventListener("mouseleave",function(){
    //开关重新打开
    for(var i=0;i<5;i++){
        flag[i] = 1;
    }
    //全部LI收起，UL回到原位置
    featureLis.forEach(function(item,index){
        item.children[1].style.width="0";
    });
    featureUl.style.transform = "";
});



/*梦幻图库、梦幻视频的遮挡层效果*/
var galleryLis = document.querySelectorAll("#gallery .g-main .picSlice .p-pics ul li,#video .v-main .videoSlice .v-pics ul li");
//var galleryUl = document.querySelector("#gallery .g-main .picSlice .p-pics ul");
//var picSlice = document.querySelector("#gallery .g-main .picSlice");
//var g_main = document.querySelector("#gallery .g-main");
galleryLis.forEach(function(item,index){
    item.addEventListener("mouseenter",function(e){
        //计算鼠标相对于UL的水平、垂直数值
        //var ex = e.clientX-g_main.getBoundingClientRect().x-picSlice.offsetLeft-galleryUl.offsetLeft;
       // var ey = e.clientY-g_main.getBoundingClientRect().y-picSlice.offsetTop-galleryUl.offsetTop;
        //得到鼠标进入位置的水平、垂直数值
        var ex = e.clientX;
        var ey = e.clientY;
        //得到进入的方向
        var direct = getDirection(ex,ey,item);

        var barrier = item.children[1];
        //先把transition过渡清除，让遮挡层可以瞬间调整位置到各个方向处
        barrier.style.transition = "";
        // barrier.style.top = "";
        // barrier.style.left = "";
        // barrier.style.top = "";
        // barrier.style.bottom = "";

        switch (direct){
            case 'left':
                barrier.style.top = "0";
                barrier.style.left = "-200px";
                break;
            case 'top':
                barrier.style.top = "-150px";
                barrier.style.left = "0";
                break;
            case 'right':
                barrier.style.top = "0";
                barrier.style.left = "200px";
                break;
            case 'bottom':
                barrier.style.top = "150px";
                barrier.style.left = "0";
                break;
        }
        //加个0秒延迟，与上方调整位置的代码分隔开，防止直接覆盖上方调整位置没有作用
        setTimeout(function(){
            barrier.style.transition = "0.3s";
            barrier.style.top = "0";
            barrier.style.left = "0";
        },0);
    });
    item.addEventListener("mouseleave",function(e){
        //计算鼠标相对于UL的水平、垂直数值
        //var ex = e.clientX-g_main.getBoundingClientRect().x-picSlice.offsetLeft-galleryUl.offsetLeft;
        //var ey = e.clientY-g_main.getBoundingClientRect().y-picSlice.offsetTop-galleryUl.offsetTop;
        //得到鼠标进入位置的水平、垂直数值
        var ex = e.clientX;
        var ey = e.clientY;
        //得到进入的方向
        var direct = getDirection(ex,ey,item);

        var barrier = item.children[1];
        switch (direct){
            case 'left':
                barrier.style.top = "0";
                barrier.style.left = "-200px";
                break;
            case 'top':
                barrier.style.top = "-150px";
                barrier.style.left = "0";
                break;
            case 'right':
                barrier.style.top = "0";
                barrier.style.left = "200px";
                break;
            case 'bottom':
                barrier.style.top = "150px";
                barrier.style.left = "0";
                break;
        }
    });
});
//计算进入元素的方向
function getDirection(ex,ey,ele){
    var w = ele.offsetWidth;
    var h = ele.offsetHeight;
    var eleX = ele.getBoundingClientRect().x;
    var eleY = ele.getBoundingClientRect().y;
    //var x = (ex - ele.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
    //var y = (ey - ele.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
    var x = (ex - eleX - (w / 2)) * (w > h ? (h / w) : 1);
    var y = (ey - eleY - (h / 2)) * (h > w ? (w / h) : 1);
    var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    var directArr = ['top','right','bottom','left'];
    return directArr[direction];
}


/*游戏资料和玩家攻略下方"更多"的弹窗*/
var moreLinks = document.querySelectorAll("#information .i-main .i-data .content ul li .catalog a.more-win");
moreLinks.forEach(function(item,index){
    item.addEventListener("mouseenter",function(){
        var win = item.parentElement.children[3];
        win.style.display = "block";
        win.addEventListener("mouseleave",function(){
            this.style.display = "none";
        })
    });
});
}