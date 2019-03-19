//人物类---begin
function AnimatePlane(param){
	//结构
	/*this.div = param.div;*/
	this.img = param.img;
	this.parent = param.parent;////用于定位的父级div（游戏框）
	//按键
	this.leftKey = param.leftKey?param.leftKey:65;//左方向按键
	this.topKey = param.topKey?param.topKey:87;//上方向按键
	this.rightKey = param.rightKey?param.rightKey:68;//右方向按键
	this.downKey = param.downKey?param.downKey:83;//下方向按键
	this.attackLeftKey = param.attackLeftKey?param.attackLeftKey:37;//左方向攻击键
	this.attackRightKey = param.attackRightKey?param.attackRightKey:39;//右方向攻击键
	this.attackTopKey = param.attackTopKey?param.attackTopKey:38;//上方向攻击键
	this.attackDownKey = param.attackDownKey?param.attackDownKey:40;//下方向攻击键
	//图片
	this.waitImg = param.waitImg;//静止图
	this.horizonImg = param.horizonImg;//水平移动时图片
	this.verticalImg = param.verticalImg;//垂直移动时图片
	this.attackLeftImg = param.attackLeftImg;//左侧攻击时图片
	this.attackRightImg = param.attackRightImg;//左侧攻击时图片
	this.attackTopImg = param.attackTopImg;//上方攻击时图片
	this.attackDownImg = param.attackDownImg;//下方攻击时图片
	this.attackMoveLeftImg = param.attackMoveLeftImg;//移动时左侧攻击时图片
	this.attackMoveRightImg = param.attackMoveRightImg;//移动时左侧攻击时图片
	this.attackMoveTopImg = param.attackMoveTopImg;//移动时上方攻击时图片
	this.attackMoveDownImg = param.attackMoveDownImg;//移动时下方攻击时图片
	this.attackedImgSrc = param.attackedImgSrc;//被攻击时图片
	//属性
	this.speed = 3;//速度
	this.timerArr = [];//上下左右动画
	this.attackArr = [];//正在攻击的方向
	this.minLeft = param.minLeft?param.minLeft:0;//最小左定位
	this.maxLeft = param.maxLeft?param.maxLeft:0;//最大左定位
	this.minTop = param.minTop?param.minTop:0;//最小上定位
	this.maxTop = param.maxTop?param.maxTop:0;//最大上定位
	this.curAttackPosition = null;
	this.bulletPosition = param.bulletPosition?param.bulletPosition:null;//子弹在各个上下的top,left
	this.attackAnimateArr = [];//X方向正在攻击
	this.bulletProperty = param.bulletProperty?param.bulletProperty:{}//子弹对象Bullet的属性
	this.attackedAnimateTime = param.attackedAnimateTime?param.attackedAnimateTime:300;//被攻击动画时长
	this.blood = param.blood?param.blood:null;//人物气血
	this.deadCallback = param.deadCallback?param.deadCallback:null;//死亡时调用的回调函数
}
AnimatePlane.prototype = {
	bindKeydown:function(keyCode){
		switch (keyCode)
		{
			case this.leftKey:
				this.move(0,keyCode);//方向移动
				break;
			case this.topKey:
				this.move(1,keyCode);//方向移动
				break;
			case this.rightKey:
				this.move(2,keyCode);//方向移动
				break;
			case this.downKey:
				this.move(3,keyCode);//方向移动
				break;
			case this.attackLeftKey:
				this.attack(keyCode,"left");
				break;
			case this.attackRightKey:
				this.attack(keyCode,"right");
				break;
			case this.attackTopKey:
				this.attack(keyCode,"top");
				break;
			case this.attackDownKey:
				this.attack(keyCode,"down");
				break;
		}
		this.changeImg(keyCode);//改变图片
	},
	//移动
	move:function(index,keyCode){
		//定时器实现方向动画
		var arr = ["Left","Top"][index%2];
		var spd = index<2?-this.speed:this.speed;
		if(this.timerArr[keyCode] == undefined){
			this.timerArr[keyCode] = setInterval(function(){
				//不能超过left、top范围
				if((spd < 0&&this.img["offset"+arr]>(this["min"+arr]+this.speed)) || (spd > 0&&this.img["offset"+arr]<(this["max"+arr]-this.speed))){
					this.img.style[arr.toLowerCase()] = this.img["offset"+arr] + spd + "px";
				}
			}.bind(this),1000/60);
		}
	},
	//攻击
	attack:function(keyCode,position){
		//按下一个方向攻击键时，应该先停止其他方向的攻击
		var this_ = this;
		this.attackAnimateArr.forEach(function(item,index,t){//当前遍历的项，下标，整个数组
			if(index != keyCode){
				this_.stopAttack(index);
			}
		});
		if(this.attackAnimateArr[keyCode] == undefined){
			//先立马生成，再创建定时器（因为定时器第一次触发会先延迟）
			var bulletIndex = 0;//每个方向有两种子弹，每次发射切换一种
			this.createBullet(position,bulletIndex);
			this.attackAnimateArr[keyCode] = setInterval(function(){
				if(bulletIndex){
					bulletIndex = 0;
				}else{
					bulletIndex = 1;
				}
				this.createBullet(position,bulletIndex);
			}.bind(this),400);
			
		}
	},
	//被攻击
	attacked:function(){
		//判断被攻击时是否需要切换图
		if(this.attackedImgSrc){
			var preImgSrc = this.img.src;
			this.img.src = this.attackedImgSrc;
			setTimeout(function(){
				this.img.src = preImgSrc;
			}.bind(this),this.attackedAnimateTime);
		}
	},
	die:function(){
		this.deadCallback&&this.deadCallback();
	},
	//创建子弹
	createBullet:function(position,index){
		//创建一个子弹图
		//得到当前方向的偏移量
		var arr = this.bulletPosition[position][index];
		//计算top和left
		var top = this.img["offsetTop"]+arr[1];
		var left = this.img["offsetLeft"]+arr[0];
		//分析z-index，左右方的第一个子弹和上方的两个子弹z-index都是1（在人物底下），其他为11（人物是10）
		var zIndex = 11;
		if(((position=='left' || position=='right') && index==0) || position=='top'){
			zIndex = 1;
		}
		var b_param = {
			top : top,
			left : left,
			parent : this.parent,
			position : position,
			zIndex : zIndex
		}
		Object.assign(b_param,this.bulletProperty);//ES5,对象合并方法,后者会覆盖或添加前者的属性
		var bullet = new Bullet(b_param);
		bullet.init();
	},
	//停止X方向的攻击
	stopAttack:function(keyCode){
		clearInterval(this.attackAnimateArr[keyCode]);
		this.attackAnimateArr[keyCode] = undefined;
	},
	//改变动作图片
	changeImg:function(keyCode){
		if(keyCode == this.leftKey || keyCode == this.rightKey){//左右键
			if(this.img.src.indexOf(this.horizonImg)==-1){
				//攻击的权重大于水平
				//console.log(this.isAttack());
				if(!this.isAttack()){
					//没有在攻击状态，则正常水平移动
					this.img.src = this.horizonImg;
				}else{
					//在攻击状态，则切换为移动式攻击图（正在朝哪攻击就是哪侧的移动攻击图）
					if(this.curAttackPosition){
						if(this.img.src.indexOf(this["attackMove"+this.curAttackPosition+"Img"])==-1){
							this.img.src = this["attackMove"+this.curAttackPosition+"Img"];
						}
					}
				}
			}
		}else if(keyCode == this.topKey || keyCode == this.downKey){//上下键
			if(this.img.src.indexOf(this.verticalImg)==-1&&this.img.src.indexOf(this.attackRightImg)==-1){
				//攻击的权重大于水平
				if(!this.isAttack()){
					//水平的权重大于垂直
					if(this.img.src.indexOf(this.horizonImg)==-1){
						this.img.src = this.verticalImg;
					}
				}else{
					//在攻击状态，则切换为移动式攻击图（正在朝哪攻击就是哪侧的移动攻击图）
					if(this.curAttackPosition){
						if(this.img.src.indexOf(this["attackMove"+this.curAttackPosition+"Img"])==-1){
							this.img.src = this["attackMove"+this.curAttackPosition+"Img"];
						}
					}
				}
			}
		}else if(keyCode == this.attackLeftKey){//左侧攻击
			this.curAttackPosition = "Left";//记录当前攻击方向
			//判断是否在移动
			if(this.isMove()){
				//移动的话则使用移动攻击图
				if(this.img.src.indexOf(this.attackMoveLeftImg)==-1){
					this.img.src = this.attackMoveLeftImg;
					this.attackArr[keyCode]=true;
				}
			}else{
				if(this.img.src.indexOf(this.attackLeftImg)==-1){
					this.img.src = this.attackLeftImg;
					this.attackArr[keyCode]=true;
				}
			}
		}else if(keyCode == this.attackRightKey){//右侧攻击
			this.curAttackPosition = "Right";//记录当前攻击方向
			//判断是否在移动
			if(this.isMove()){
				//移动的话则使用移动攻击图
				if(this.img.src.indexOf(this.attackMoveRightImg)==-1){
					this.img.src = this.attackMoveRightImg;
					this.attackArr[keyCode]=true;
				}
			}else{
				if(this.img.src.indexOf(this.attackRightImg)==-1){
					this.img.src = this.attackRightImg;
					this.attackArr[keyCode]=true;
				}
			}
		}else if(keyCode == this.attackTopKey){//上方攻击
			this.curAttackPosition = "Top";//记录当前攻击方向
			//判断是否在移动
			if(this.isMove()){
				//移动的话则使用移动攻击图
				if(this.img.src.indexOf(this.attackMoveTopImg)==-1){
					this.img.src = this.attackMoveTopImg;
					this.attackArr[keyCode]=true;
				}
			}else{
				if(this.img.src.indexOf(this.attackTopImg)==-1){
					this.img.src = this.attackTopImg;
					this.attackArr[keyCode]=true;
				}
			}
		}else if(keyCode == this.attackDownKey){//下方攻击
			this.curAttackPosition = "Down";//记录当前攻击方向
			//判断是否在移动
			if(this.isMove()){
				//移动的话则使用移动攻击图
				if(this.img.src.indexOf(this.attackMoveDownImg)==-1){
					this.img.src = this.attackMoveDownImg;
					this.attackArr[keyCode]=true;
				}
			}else{
				if(this.img.src.indexOf(this.attackDownImg)==-1){
					this.img.src = this.attackDownImg;
					this.attackArr[keyCode]=true;
				}
			}
		}
	},
	bindKeyup:function(keyCode){
		//清除放开的按键方向的定时器
		clearInterval(this.timerArr[keyCode]);
		this.timerArr[keyCode] = undefined;

		//清除攻击键
		this.attackArr[keyCode] = undefined;
		//停止攻击
		this.stopAttack(keyCode);

		//放开按键时，没有正在攻击，才可以切换行动或静止的图片（攻击权重最大）。
		if(!this.isAttack()){
			//水平的权重大于垂直。如果当前还在水平移动则水平图，没有水平如果有垂直则垂直图
			if(this.timerArr[this.leftKey] || this.timerArr[this.rightKey]){
				this.img.src = this.horizonImg;
			}else if(this.timerArr[this.topKey] || this.timerArr[this.downKey]){
				this.img.src = this.verticalImg;
			}
		

			//将图片改为静止
			//如果定时器都没了，则静止
			var noExistTimer = true;
			for(var i=0,len=this.timerArr.length;i<len;i++){
				if(this.timerArr[i]){
					noExistTimer = false;
					break;
				}
			}
			if(noExistTimer && this.img.src.indexOf(this.waitImg)==-1){
				this.img.src = this.waitImg;
			}
		}else{
			//如果正在攻击，且没有再行动，则切换为静止的攻击图（朝哪攻击就哪方向的攻击图）
			var noExistTimer = true;
			for(var i=0,len=this.timerArr.length;i<len;i++){
				if(this.timerArr[i]){
					noExistTimer = false;
					break;
				}
			}
			if(noExistTimer && this.img.src.indexOf(this["attack"+this.curAttackPosition+"Img"])==-1){
				this.img.src = this["attack"+this.curAttackPosition+"Img"];
			}
		}
	},
	//判断是否是攻击状态
	isAttack:function(){
		/*for(var i=0,leng=this.attackArr.length;i<leng;i++){
			if(this.attackArr[i]){
				return true;
			}
		}*/
		if(this.attackArr[this.attackLeftKey] || this.attackArr[this.attackRightKey]){
			return true;
		}
		if(this.attackArr[this.attackTopKey] || this.attackArr[this.attackDownKey]){
			return true;
		}
		return false;
	},
	//清空全部方向攻击的数组
	/*clearAttack:function(){
		this.attackArr[this.attackLeftKey] = undefined;
		this.attackArr[this.attackRightKey] = undefined;
		this.attackArr[this.attackTopKey] = undefined;
		this.attackArr[this.attackDownKey] = undefined;
	},
	//攻击方向
	attackPosition:function(){
		if(this.attackArr[this.attackLeftKey]){
			return "Left";
		}else if(this.attackArr[this.attackRightKey]){
			return "Right";
		}else if(this.attackArr[this.attackTopKey]){
			return "Top";
		}else if(this.attackArr[this.attackDownKey]){
			return "Down";
		}else{
			return "";
		}
	},*/
	//判断是否在移动,方向（同时有水平和垂直返回水平的）
	isMove:function(){
		if(this.timerArr[this.leftKey] || this.timerArr[this.rightKey]){
			return "horizon";
		}else if(this.timerArr[this.topKey] || this.timerArr[this.downKey]){
			return "vertical";
		}else{
			return "";
		}
	},
	//移动方向
	movePosition:function(){
		if(this.timerArr[this.leftKey]){
			return "Left";
		}else if(this.timerArr[this.rightKey]){
			return "Right";
		}else if(this.timerArr[this.topKey]){
			return "Top";
		}else if(this.timerArr[this.downKey]){
			return "Down";
		}else{
			return "";
		}
	}
}
//人物类---end

//子弹类---begin
function Bullet(param){
	/*必填项*/
	this.top = param.top;//*定位top
	this.left = param.left;//*定位left
	this.parent = param.parent;//*用于定位的父级div（游戏框）
	this.imgSrc = param.imgSrc;//*子弹图片路径
	this.position = param.position;//*攻击方向left、right、top、down、lt(左上)、rt(右上)、rd(右下)、ld(左下)
	/*this.isCustomPosition = param.isCustomPosition?param.isCustomPosition:false;//是否是自定义方向lt(左上)、rt(右上)、rd(右下)、ld(左下)*/

	/*基础属性*/
	this.speed = param.speed?param.speed:6;//子弹水平速度
	this.verSpeed = param.verSpeed?param.verSpeed:6;//子弹垂直速度
	this.zIndex = param.zIndex?param.zIndex:1;
	this.animateTime = param.animateTime?param.animateTime:760;//子弹从出现消失所用时间
	this.horizonMinLimit = param.horizonMinLimit?param.horizonMinLimit:40;//水平方向碰壁位置
	this.horizonMaxLimit = param.horizonMaxLimit?param.horizonMaxLimit:580;//水平方向碰壁位置
	this.verticalMinLimit = param.verticalMinLimit?param.verticalMinLimit:120;//垂直方向碰壁位置
	this.verticalMaxLimit = param.verticalMaxLimit?param.verticalMaxLimit:420;//垂直方向碰壁位置
	this.bombImg = param.bombImg?param.bombImg:null;//子弹正常爆开图
	this.bombedImg = param.bombedImg?param.bombedImg:null;//子弹碰壁时爆开图
	this.bombedImgClearTime = param.bombedImgClearTime?param.bombedImgClearTime:900;//子弹爆开后消失时间
	this.goals = param.goals?param.goals:null;//子弹攻击目标
}
Bullet.prototype = {
	//初始化
	init:function(){
		var img = new Image();
		img.src = this.imgSrc;
		img.className = "bullet";
		img.style.position = "absolute";
		img.style.zIndex = this.zIndex;
		img.style.top = this.top + "px";
		img.style.left = this.left + "px";
		this.img = img;//新增图片元素属性
		this.parent.appendChild(img);
		
		this.animate(this.position);//进行动画
		
	},
	//子弹动作
	animate:function(position){
		switch (position)
		{
			case "left":
				this.move(0);//左方向移动
				break;
			case "top":
				this.move(1);//上方向移动
				break;
			case "right":
				this.move(2);//右方向移动
				break;
			case "down":
				this.move(3);//下方向移动
				break;
			case "lt":
				this.customMove(0,1);//左上方向移动
				break;
			case "rt":
				this.customMove(2,1);//右上方向移动
				break;
			case "rd":
				this.customMove(2,3);//右下方向移动
				break;
			case "ld":
				this.customMove(0,3);//左下方向移动
				break;
		}
	},
	//子弹水平/垂直移动，参数left:0,top:1,right:2,down:3
	move:function(index){
		//定时器实现方向动画
		var arr = ["Left","Top"][index%2];//arr=0:left,right;arr=1:top,down
		var spd = 0;
		//判断是水平方向还是垂直方向
		if(arr == "Left"){
			spd = index<2?-this.speed:this.speed;
		}else if(arr == "Top"){
			spd = index<2?-this.verSpeed:this.verSpeed;
		}
		var time = 0;//累计时间
		var timer = setInterval(function(){
			//碰壁或达到最远距离时子弹消失
			if(arr == "Left"){
				if(this.img["offsetLeft"]<this.horizonMinLimit||this.img["offsetLeft"]>this.horizonMaxLimit){		
					this.boomClearBullet(timer,0);
					
				}else if(time>this.animateTime){
					this.boomClearBullet(timer,1);
				}
			}else if(arr == "Top"){
				if(this.img["offsetTop"]<this.verticalMinLimit||this.img["offsetTop"]>this.verticalMaxLimit){
					this.boomClearBullet(timer,0);
				}else if(time>this.animateTime){
					this.boomClearBullet(timer,1);
				}
			}
			if(this.isToAttackGoals()){
				//判断是否攻击到目标
				this.boomClearBullet(timer,0);
			}
			this.img.style[arr.toLowerCase()] = this.img["offset"+arr] + spd + "px";
			
			/*if(arr == "Left"){//水平方向还有垂直下落的速度
				var topS = this.img.style["top"];
				topS = parseFloat(topS.substring(0,topS.length-2));
				this.img.style["top"] = topS + this.verSpeed + "px";
			}*/
			//console.log(this.img.offsetTop);

			time += 1000/60;
		}.bind(this),1000/60);
	},
	//自定义子弹移动,参数horizonIndex(left:0,right:2),verticalIndex(top:1,down:3)
	customMove(horizonIndex,verticalIndex){
		//定时器实现方向动画
		var horizonSpeed = horizonIndex<2?-this.speed:this.speed;//水平方向速度
		var verticalSpeed = verticalIndex<2?-this.verSpeed:this.verSpeed;//垂直方向速度
		var time = 0;//累计时间
		var timer = setInterval(function(){
			//碰壁或达到最远距离时子弹消失
			if(this.img["offsetLeft"]<this.horizonMinLimit||this.img["offsetLeft"]>this.horizonMaxLimit){		
				this.boomClearBullet(timer,0);
			}else if(time>this.animateTime){
				this.boomClearBullet(timer,1);
			}else if(this.img["offsetTop"]<this.verticalMinLimit||this.img["offsetTop"]>this.verticalMaxLimit){
				this.boomClearBullet(timer,0);
			}else if(time>this.animateTime){
				this.boomClearBullet(timer,1);
			}else if(this.isToAttackGoals()){
				//判断是否攻击到目标
				this.boomClearBullet(timer,0);
			}
			/*this.img.style["left"] = this.img["offsetLeft"] + horizonSpeed + "px";
			this.img.style["top"] = this.img["offsetTop"] + verticalSpeed + "px";*/
			//为了更精准，用left、top，不适用offsetLeft、offsetTop，因为只能取整数
			var curLeftPx = this.img.style["left"];//含px单位要特殊处理为数值
			var curTopPx = this.img.style["top"];
			this.img.style["left"] = parseFloat(curLeftPx.substring(0,curLeftPx.length-2)) + horizonSpeed + "px";
			this.img.style["top"] = parseFloat(curTopPx.substring(0,curTopPx.length-2)) + verticalSpeed + "px";

			time += 1000/60;
		}.bind(this),1000/60);
	},
	//爆开并清除子弹
	boomClearBullet:function(timer,type){//type:0是碰墙的爆开图,1是正常爆开图
		clearInterval(timer);
		//因为子弹爆破图比子弹大，要调整下img位置
		var preWidth = this.img.offsetWidth;
		var preHeight = this.img.offsetHeight;
		if(type && this.bombImg!=null){
			//正常爆开
			this.img.src = this.bombImg+"?"+new Date().getTime();
		}else if(!type && this.bombedImg!=null){
			//碰壁爆开
			this.img.src = this.bombedImg+"?"+new Date().getTime();
		}
		
		var this_ = this;
		this.img.onload = function(){
			var curWidth = this_.img.offsetWidth;
			var curHeight = this_.img.offsetHeight;
			//console.log(preWidth,curWidth);
			var toLeft = (curWidth-preWidth)/2;
			var toTop = (curHeight-preHeight)/2;
			this_.img.style["left"] = this_.img["offsetLeft"] - toLeft + "px";
			this_.img.style["top"] = this_.img["offsetTop"] - toTop + "px";
			
			setTimeout(function(){
				this_.parent.removeChild(this_.img);
			},this_.bombedImgClearTime);
		}
	},
	//判断是否攻击到目标
	isToAttackGoals:function(){
		//遍历目标数组
		var isHit = false;
		if(this.goals){
			this.goals.forEach(function(item,index){
				//console.log(item.attackImg);
				//目标的矩形（因为静止图和攻击图是相互用display:none切换的，可能当前是静止图和攻击图，要判断）
				var a = {};
				var curImg = "img";
				if(item.img.style.display!='none'){
					curImg = "img";
				}else if(item.attackImg.style.display!='none'){
					curImg = "attackImg";
				}
				a.x1 = item[curImg]["offsetLeft"];
				a.y1 = item[curImg]["offsetTop"];
				a.x2 = item[curImg]["offsetLeft"] + item[curImg]["offsetWidth"];
				a.y2 = item[curImg]["offsetTop"] + item[curImg]["offsetHeight"];
				//子弹的矩形
				var b = {};
				b.x1 = this.img["offsetLeft"];
				b.y1 = this.img["offsetTop"];
				b.x2 = this.img["offsetLeft"] + this.img["offsetWidth"];
				b.y2 = this.img["offsetTop"] + this.img["offsetHeight"];
				if(this.judgeRectMix(a,b)){
					isHit = true;
					item.attacked();//触发被攻击的动画
					//扣目标气血
					if(item.blood){
						item.blood -= 1;
						if(item.blood == 0){
							item.die();
						}
					}
				}
			}.bind(this));
		}
		return isHit;
	},
	//判断2个矩形是否有交集,a[x1,y1,x2,y2],b[x1,y1,x2,y2];(x1,y1)和(x2,y2)分别是矩形左上角和右下角的点坐标
	judgeRectMix:function(a,b){
		//a和b物理中心点x,y方向的距离为Lx,Ly
		var Lx = Math.abs( (a.x1+a.x2)/2 - (b.x1+b.x2)/2 );
		var Ly = Math.abs( (a.y1+a.y2)/2 - (b.y1+b.y2)/2 );
		//a和b在x.y方向的边长为 Sax,Say,Sbx,Sby
		var Sax = Math.abs(a.x1-a.x2);
		var Say = Math.abs(a.y1-a.y2);
		var Sbx = Math.abs(b.x1-b.x2);
		var Sby = Math.abs(b.y1-b.y2);
		if(Lx<(Sax+Sbx)/2 && Ly<(Say+Sby)/2){
			return true;
		}else{
			return false;
		}
	}
}
//子弹类---end


//敌人类---begin
function Enemy(param){
	this.top = param.top;//定位top
	this.left = param.left;//定位left
	this.zIndex = param.zIndex?param.zIndex:10;//z-index
	this.parent = param.parent;//用于定位的父级div（游戏框）
	this.prey = param.prey?param.prey:null;//攻击的猎物，一般传'玩家AnimatePlane对象'，用于怪物自动导航时去攻击自己
	this.imgSrc = param.imgSrc;//怪物静止时图片路径
	this.attackImgSrc = param.attackImgSrc;//怪物攻击时图片路径
	this.attackedImgSrc = param.attackedImgSrc;//怪物被攻击时的图片路径
	this.attackedAnimateTime = param.attackedAnimateTime?param.attackedAnimateTime:300;//被攻击动画时长
	this.horizonMinLimit = param.horizonMinLimit?param.horizonMinLimit:40;//水平方向碰壁位置
	this.horizonMaxLimit = param.horizonMaxLimit?param.horizonMaxLimit:580;//水平方向碰壁位置
	this.verticalMinLimit = param.verticalMinLimit?param.verticalMinLimit:120;//垂直方向碰壁位置
	this.verticalMaxLimit = param.verticalMaxLimit?param.verticalMaxLimit:420;//垂直方向碰壁位置
	this.awDistanceX = param.awDistanceX?param.awDistanceX:-9;//静止图和攻击动作图的img大小在水平方向的偏差调整值,如-10表示水平方向攻击图向左移动10px
	this.awDistanceY = param.awDistanceY?param.awDistanceY:-8;//静止图和攻击动作图的img大小在垂直方向的偏差调整值,如-10表示垂直方向攻击图向上移动10px
	this.bwDistanceX = param.bwDistanceX?param.bwDistanceX:-9;//静止图和子弹图的img大小在水平方向的偏差调整值,如-10表示水平方向子弹图向上移动10px
	this.bwDistanceY = param.bwDistanceY?param.bwDistanceY:-8.5;//静止图和子弹图的img大小在垂直方向的偏差调整值,如-10表示垂直方向子弹图向上移动10px

	/*自动攻击功能 begin*/
		//basic
	this.isAutoAttack = param.isAutoAttack?param.isAutoAttack:false;//是否自动攻击
	this.autoAttackTimer =  null;//是否自动攻击的定时器
	this.autoAttackAnimateTime = param.autoAttackAnimateTime?param.autoAttackAnimateTime:400;//自动攻击动画的时长
	this.autoAttackInterval = param.autoAttackInterval?param.autoAttackInterval:1200;//多久自动攻击一次
	this.autoAttackPosition = param.autoAttackPosition?param.autoAttackPosition:"down";//自动攻击的方向
	this.attackHorizonSpeed = param.attackHorizonSpeed?param.attackHorizonSpeed:6;//子弹水平方向攻击速度
	this.attackVerticalSpeed = param.attackVerticalSpeed?param.attackVerticalSpeed:6;//子弹垂直方向攻击速度
		//special
	this.isAutoNavigation = param.isAutoNavigation?param.isAutoNavigation:false;//是否开启自动导航
	this.attackTotalSpeed = param.attackTotalSpeed?param.attackTotalSpeed:6//攻击时子弹总速度（勾股定理。√(水平^2+垂直^2) ，用于自动导航时求水平和垂直分速度）
	this.bulletProperty = param.bulletProperty?param.bulletProperty:{}//子弹对象Bullet的属性
	/*自动攻击功能 end*/

	this.blood = param.blood?param.blood:null;//怪物气血

}
Enemy.prototype = {
	//初始化
	init:function(){
		//创建静止时的图片
		var img = new Image();
		img.src = this.imgSrc+'?'+new Date().getTime();
		img.className = "enemy";
		img.style.position = "absolute";
		img.style.zIndex = this.zIndex;
		img.style.top = this.top + "px";
		img.style.left = this.left + "px";
		this.img = img;//新增图片元素属性
		this.parent.appendChild(img);
		//创建攻击时的图片
		var attackImg = new Image();
		attackImg.src = this.attackImgSrc+'?'+new Date().getTime();
		attackImg.className = "enemy";
		attackImg.style.position = "absolute";
		attackImg.style.zIndex = this.zIndex;
		attackImg.style.top = this.top + this.awDistanceY + "px";//调整top
		attackImg.style.left = this.left + this.awDistanceX + "px";//调整left
		attackImg.style.display = "none";
		this.attackImg = attackImg;//新增攻击时图片元素属性
		this.parent.appendChild(attackImg);

		if(this.isAutoAttack){//判断是否自动攻击
			this.autoAttackTimer = setInterval(function(){
				//判断是否开启自动瞄准
				if(this.isAutoNavigation){
					this.autoNavigation();//自动瞄准
				}
				this.attack(this.autoAttackPosition);
				this.img.style.display = "none";
				this.attackImg.style.display = "block";
				setTimeout(function(){
					if(this.img.src.indexOf(this.imgSrc) == -1){
						this.img.src = this.imgSrc;
					}
					this.attackImg.style.display = "none";
					this.img.style.display = "block";
				}.bind(this),this.autoAttackAnimateTime);
			}.bind(this),this.autoAttackInterval);
		}
	},
	//攻击
	attack:function(attackPosition){
		var top = this.img.offsetTop + this.img.offsetHeight/2 + this.bwDistanceY;
		var left = this.img.offsetLeft + this.img.offsetWidth/2 + this.bwDistanceX;
		var b_param = {
			top : top,
			left : left,
			parent : this.parent,
			position : attackPosition,//方向
			speed : this.attackHorizonSpeed,//水平速度
			verSpeed : this.attackVerticalSpeed,//垂直速度
			zIndex : 11,
			goals : [this.prey]
		}
		Object.assign(b_param,this.bulletProperty);//ES5,对象合并方法,后者会覆盖或添加前者的属性
		var bullet = new Bullet(b_param);
		bullet.init();
	},
	//自动导航功能，计算出当前的水平速度、垂直速度、方向
	autoNavigation:function(){
		//得到怪物与玩家中心点的当前坐标，计算相对偏移量sx,sy
		var enemyCenterPoint = {
			x:this.img.offsetLeft + this.img.offsetWidth/2,
			y:this.img.offsetTop + this.img.offsetHeight/2
		}
		var preyCenterPoint = {
			x:this.prey.img.offsetLeft + this.prey.img.offsetWidth/2,
			y:this.prey.img.offsetTop + this.prey.img.offsetHeight/2
		}
		//console.log(preyCenterPoint);
		var sx = preyCenterPoint.x - enemyCenterPoint.x;
		var sy = preyCenterPoint.y - enemyCenterPoint.y;
		//计算水平和垂直方向的分速度
		//公式:z=this.attackTotalSpeed,t=sx/sy -----> x= tz/√(t^+1) , y= z/√(t^+1) 
		var z = this.attackTotalSpeed;
		var t = Math.abs(sx/sy);
		var speedX = parseFloat( ( (t*z)/(Math.sqrt(Math.pow(t,2)+1)) ).toFixed(5) );//保留2位小数
		var speedY = parseFloat( ( z/(Math.sqrt(Math.pow(t,2)+1)) ).toFixed(5) );//保留2位小数
		//console.log(speedX,speedY);
		this.attackHorizonSpeed = speedX;
		this.attackVerticalSpeed = speedY;
		//判断方向
		if(sx>=0 && sy>=0){//右下
			this.autoAttackPosition = "rd";
		}else if(sx>0 && sy<0){//右上
			this.autoAttackPosition = "rt";
		}else if(sx<0 && sy>=0){//左下
			this.autoAttackPosition = "ld";
		}else if(sx<0 && sy<0){//左上
			this.autoAttackPosition = "lt";
		}
	},
	//被攻击
	attacked:function(){
		//判断被攻击时是否需要切换图
		if(this.attackedImgSrc){
			var preImgSrc = this.img.src;
			this.img.src = this.attackedImgSrc;
			setTimeout(function(){
				this.img.src = preImgSrc;
			}.bind(this),this.attackedAnimateTime);
		}
	},
	//死亡
	die:function(){
		clearInterval(this.autoAttackTimer);
		this.parent.removeChild(this.attackImg);
		this.parent.removeChild(this.img);
	}
}
//敌人类---end