
var canvasObj = $('#canvas');//$ canvas对象
var ca = document.getElementById("canvas"); //js canvas对象;

var ctx = ca.getContext("2d");
/*import bgURL from '../img/bg-min.png'
import renURL from '../img/people.png'
import coin1 from '../img/coin1.png'
import coin2 from '../img/coin2.png'*/
var bgURL = './img/bg-min.png'
var renURL = './img/people.png'
var coin1 = './img/coin1.png'
var coin2 = './img/coin2.png'

var interval;//计时器
//var interval1;//定时器

var canPlayNum = 3;
var playNumToday = 0;
var canContinuePlayNum =0;
var game = {
  B: 0.56,//调整系数
  isLoginUme:false,
  icUme:'',
  idUme:'',
  tu: new Array(),
  cuyu: new Array(),
  img:{
    bg: new Image()//背景图
  },
  canvas:{
    canvasW: window.innerWidth,
    canvasH: window.innerHeight
  },
  people: new Object(),
  time: {
    beginTime: new Date(),//游戏开始时间
    gameTime : 30, //游戏时间
    remainTime: 0  //游戏剩余时间
  },
  count: { /*玩游戏次数*/
    playNum: 0,
    canPlayNum: 3,
    continuePlayNum:0
  },
  coin:{
    gk: 1,
    h: 20,
    sudu: 10, //10 金币掉落速度
    zl: 100,// 金币\银币\铜币 选择随机数
    chi:0,
    shi:0,//总计数
    fs: 0,//获得总金币
    rc: 0,//获得微米图标金币
    sc:0,//获得银币图标
    fc:0,//获得金币图标
    sm:1,
    range:300, //金币横坐标范围
    width:40,
    height:40
  },
  init: function(){
    /*背景*/
    this.img.bg.src = bgURL;
    /*canvas*/
    this.canvas.canvasW = this.canvas.canvasW>420 ?420 : this.canvas.canvasW;
    this.canvas.canvasH = (this.canvas.canvasW/360)*567;
    this.canvas.canvasH = this.canvas.canvasH< window.innerHeight?window.innerHeight:this.canvas.canvasH;
    canvasObj.css('margin-top',(window.innerHeight-this.canvas.canvasH)/2);
    canvasObj.css('margin-left',(window.innerWidth-this.canvas.canvasW)/2);
    canvasObj.attr('width',this.canvas.canvasW);
    canvasObj.attr('height',this.canvas.canvasH);
    /*人*/
    this.people.img = new Image();
    this.people.img.src = renURL
    this.people.width = 86*0.6;
    this.people.height = 218*0.6;
    this.people.x= 0;
    this.people.y = this.canvas.canvasH-this.people.height;

    this.coin.range = this.canvas.canvasW - this.coin.width; //去除金币宽度的的长度
    /**/
    this.cuyu = ['爱国','知识','工作','睡觉','迟到','游戏'];
    console.info(this.people.y);
    console.info(this.canvas.canvasH);

    /*时间*/
    this.time.remainTime = this.time.gameTime;
    this.time.beginTime = new Date();

    /*金币数*/
    this.coin.fs = 0;
    this.coin.fc = 0;
    this.coin.sc = 0;
    this.coin.rc = 0;

  },
  start: function (ic,id,isLogin){
    var self = this;
    self.init();
    if(isLogin == true)  self.isLoginUme = true ;
    if(ic)  self.icUme = ic ;
    if(id)  self.idUme = id ;
    console.info(" icUme: "+self.icUme+" idUme: "+self.idUme+" isLoginUme: "+self.isLoginUme);
    interval = setInterval(function(){
      ctx.clearRect(0,0,self.canvas.canvasW,self.canvas.canvasH);//矩形 清空画布
      ctx.drawImage(self.img.bg, 0, 0, self.canvas.canvasW, self.canvas.canvasH);//背景图固定
      ctx.drawImage(self.people.img, self.people.x, self.people.y, self.people.width, self.people.height);//移动的任务对象 人
      self.draw();//金银铜币对象
      //console.info(self.coin.fc+'----'+self.coin.rc+'----'+self.coin.chi);
      document.getElementById("f").innerHTML= '获得金币数：'+ self.coin.fs;
      self.checkTime();
    },100);
    self.addListener(ca,'touchmove',self.move);//监听鼠标移动事件 ；ca为对象document.getElementById("canvas");  m为移动函数
  },
  draw: function(){
    var self = this;
    sudukongzhi();
    chansheng();
    for(var i=0;i<self.tu.length;i++){
      if(self.jianche(self.people,self.tu[i])) {//碰撞时消失
        console.info(self.coin.fs)
        if ( self.tu[i].q === 1 ) {//每接一金币
          self.coin.fs+=1;//fs+=1;
          self.coin.fc+=1;
        } else {//每接一个粽子
          self.coin.fs+=10;//fs+=10;
          self.coin.rc+=1;
        }
        self.tu[i].y+=180;
      }else if(!self.jianche(self.people,self.tu[i])){
        self.tu[i].y+=self.coin.sudu;
      }
      ctx.drawImage(self.tu[i].image,self.tu[i].x,self.tu[i].y,self.coin.width,self.coin.height);
    }
    function sudukongzhi(){//由游戏时间控制金币掉落的时间
      if(self.time.remainTime > 10){
        self.coin.sudu = 20;
        self.coin.h = 20;
      }else if(self.time.remainTime > 5){
        self.coin.sudu = 30;
        self.coin.h = 20;
      }else{
        self.coin.sudu = 50;
        self.coin.h = 20;

      }

    }
    function chansheng(){//产生金币
      if((self.coin.shi % self.coin.h) == 0){
        //console.info(shi+"   "+chi);
        for(var j=2*self.coin.chi;j<2*(self.coin.chi+1);j++){
          //console.info(chi);
          self.tu[j] = new object();
          var i = Math.round(Math.random()*self.coin.range);//Math.round()取整 ；Math.random()随机数
          if(j==2*self.coin.chi+1)
          {
            while(Math.abs(i-self.tu[2*self.coin.chi].x)<self.coin.width){//Math.abs()绝对值
              i=Math.round(Math.random()*self.coin.range);
            }
          }
          var k=Math.round(Math.random()*self.coin.zl);//100随机选择积极消极
          if(k < 70){//90
            self.tu[j].image.src=coin1;
            self.tu[j].q = 1;
          } else {
            self.tu[j].image.src=coin2;
            self.tu[j].q = 2;
          }
          //设定金币初始位置
          self.tu[j].x=i;
          self.tu[j].y=-Math.round(Math.random()*300);
          self.tu[j].image.width= self.coin.width;
          self.tu[j].image.height= self.coin.width;
        }
        self.coin.chi++;
        if( self.coin.chi == self.coin.h ) self.coin.chi=0;
      }
      self.coin.shi++;//总计数
    }
    function object(){
      this.x=0;
      this.y=0;
      this.l=11;
      this.image=new Image();
    }
  },
  jianche: function(a,b) {
    var c=a.x-b.x;
    var d=a.y-b.y;
    if(c < b.image.width && c>-a.width  && d<b.image.height && d>-a.height){/*二者是否相撞*/
      return true;
    }else{
      return false;
    }
  },
  checkTime: function(){
    var nowTime = new Date();
    this.time.remainTime = this.time.gameTime-parseInt((nowTime.getTime()-this.time.beginTime.getTime())/1000);//剩余时间的计算
    document.getElementById('r').innerHTML = '时间：'+this.time.remainTime+"s";//界面显示剩余时间
    if(this.time.remainTime<=0) {
      this.stop();
    }
  },
  addListener:function(element,e,fn){
    if(element.addEventListener){
      element.addEventListener(e,fn,false);
    } else {
      element.attachEvent("on" + e,fn);
    }
  },
  move: function(){//移动人物
    stopBubble(event);
    stopDefault(event);
    var point = event.touches ? event.touches[0] : event;
    if( point.pageY >= game.people.y && point.pageY<=game.canvas.canvasH){//移动对象在人
      game.people.x =  point.pageX-game.people.width/2;
      //sprite.x=event.clientX-playerWidth/2;
      if(game.people.x+game.people.width>=game.canvas.canvasW) {//移动到两边缘的处理
        game.people.x=game.canvas.canvasW-game.people.width;
      } else if(game.people.x<=game.people.width/2) {
        game.people.x=0;
      }
    }
    function stopBubble(e) {
      //如果提供了事件对象，则这是一个非IE浏览器
      if ( e && e.stopPropagation )
      //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
      else
      //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
    //阻止浏览器的默认行为
    function stopDefault(e) {
      //阻止默认浏览器动作(W3C)
      if ( e && e.preventDefault )
        e.preventDefault();
      //IE中阻止函数器默认动作的方式
      else
        window.event.returnValue = false;
      return false;
    }
  },
  stop:function(){//停止游戏
    clearInterval(interval);
    var self = this;
    setTimeout(function(){
      //if(self.isLoginUme == false) postGoldMedal(objId);
      if(self.isLoginUme == true){
        postCoin(self.icUme, self.idUme, self.coin.fs);
        //popUpEndLoginIn(self.icUme, self.idUme, self.coin.fs);
      } else{
        popUpEndNoLogin(self.coin.fs)
      }

    },300)
  }
}
window.onload = function(){
  initLoggedIn();
}

/**
 * 判断是否登录
 * */
function initLoggedIn() {
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("正常");
      getGameInfo();

    } else if (isLoggedIn == -1) {
      debug_print("未登录");
      popUpStart("","", false);
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    /*popUpStart("","", false);*/
    getGameInfo();
  }
}

/*获取用户信息*/
function getGameInfo(){
  UMeUser.getUMeUser().then(function (user) {
    debug_print("user: " + JSON.stringify(user));
    if (user == null ) return;
    var ic= user.InviteCode ?user.InviteCode:xxxxxxx;
    var objectId = user.objectId();
    checkUid(ic,objectId);
  }).catch(function (e) {
    debug_print("user error: " + e);
  });
}
/*开始游戏弹框*/
function popUpStart(ic,objectId,isLogin){
  var h='12.44444';
  var html = '<div class="notice">游戏规则，移动下方人物，完成吃粽子</div>'+
    '<div class="notice1"><p>1金币<span class="img1"></span>=1微米币<span class="img3"></span></p>'+
    '<p>1粽子<span class="img2"></span>=10微米币<span class="img3"></span></p></div>'+
    '<div class="notice2">ps：掉落不计分，仅限登录用户参与</div>'+
    '<button class="startbtn">开始游戏</button>'
  popup.open({
    width: 14.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "中华情 端午寄</br> 尽情放粽", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#dfd5a5",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "font-size": "1rem",
    "font-weight":"400",
    "height":"2.8rem",
    "padding-top":".6rem",
    "color":"#3a7c36"
  });
  $("#cancelBtn").show().css({
    "width": "1.1111rem",
    "height": "1.1111rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": ".68889rem",
    "color":"#3a7c36",
    "padding": ".66666rem .44444rem .66666rem",
    "line-height": "1rem"
  });
  $(".notice1 p").css({
    "text-align":"center",
    "font-size": ".68889rem",
    "color":"#3a7c36",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#3a7c36",
    "padding": "0.44444rem .84444rem 0.44444rem",
    "line-height": "1rem"
  });
  $(".startbtn").click(function(){
    deletePop();
    $("#f").show();
    $("#r").show();
    game.start(ic,objectId,isLogin);
  })
}

function popUpEndLoginIn(ic,id,fs){
  var h='11.66666';
  console.info(id);
  var t = canContinuePlayNum>0? '<button class="endbtn">再玩一次</button><div class="clear:both;"></div>':''
  var html = '<div class="notice">关注微米公众号，回复你的游戏截图，即可领取金币</div>'+
    '<button class="sharebtn">分享</button>'+t;
  popup.open({
    width: 13.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "恭喜你！</br> 获得"+fs+"微米币</br> 邀请码："+ic, //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false);
  if(canContinuePlayNum<=0){
    $(".popUp_c .sharebtn").css({
      "left":"4.4rem"
    });
  }
  $(".popUp_c").css({
    "background-color":"#dfd5a5",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "font-size": "1rem",
    "font-weight":"400",
    "height":"3.8rem",
    "padding-top":".6rem",
    "color":"#3a7c36"
  });
  $("#cancelBtn").show().css({
    "width": "1.1111rem",
    "height": "1.1111rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": ".68889rem",
    "color":"#3a7c36",
    "padding": ".66666rem .44444rem .66666rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#3a7c36",
    "padding": "0.44444rem .84444rem 0.44444rem",
    "line-height": "1rem"
  });
  canContinuePlayNum--;
  $(".sharebtn").click(function(){
    deletePop();
    _czc.push(['_trackEvent', '端午接金币活动', 'click', '朋友圈邀请', '', '']);
    window.App.shareToWeChatFriends("http://browser.umeweb.com/v6/ume/game/labourgame/active.html", 0);
  })
  $(".endbtn").click(function(){
    deletePop();
    _czc.push(['_trackEvent', '端午接金币活动', 'click', '再玩一次', '', '']);
    game.start(ic,id,true);
  })
}

function popUpEndNoLogin(fs){
  var h='11.66666';
  var html = '<div class="notice">由于您未登录，无法领取金币</div>'+
    '<div class="notice2">ps：登录后再玩一次领取</div>'+
    '<button class="gotologin">去登录</button>'+
    '<button class="endbtn">再玩一次</button><div class="clear:both;"></div>'
  popup.open({
    width: 13.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "恭喜你！</br> 获得"+fs+"微米币", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#dfd5a5",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "font-size": "1rem",
    "font-weight":"400",
    "height":"2.8rem",
    "padding-top":".6rem",
    "color":"#3a7c36"
  });
  $("#cancelBtn").show().css({
    "width": "1.1111rem",
    "height": "1.1111rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": ".68889rem",
    "color":"#3a7c36",
    "padding": ".66666rem .44444rem .66666rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#3a7c36",
    "padding": "0.44444rem .84444rem 0.44444rem",
    "line-height": "1rem"
  });
  $(".gotologin").click(function(){
    deletePop();
    _czc.push(['_trackEvent', '端午接金币活动', 'click', '去登录', '', '']);
    getToLogin();
  })
  $(".endbtn").click(function(){
    deletePop();
    _czc.push(['_trackEvent', '端午接金币活动', 'click', '再玩一次', '', '']);
    game.start("","",false);
  })
}
function popupGameOver(t1,t2){
  var h='7.66666';
  var html = '<div class="notice">'+t1+'</div>'+
    '<div class="notice2">'+t2+'</div>';
  popup.open({
    width: 12.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#dfd5a5",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "height":"1.8rem"
  });
  $("#cancelBtn").show().css({
    "width": "1.1111rem",
    "height": "1.1111rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": "1.2rem",
    "color":"#3a7c36",
    "padding": ".66666rem .44444rem .66666rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".71111rem",
    "color":"#3a7c36",
    "padding": "0 .84444rem 0.44444rem",
    "line-height": "1rem"
  });
}
/*验证objected id*/
function checkUid(ic,objectId) {

  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/newyear/api/check/" + objectId,
    dataType: 'json',
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      debug_print("sucess:" + JSON.stringify(data));
      debug_print("sucess objectId:" + objectId);
      getPlayNum(ic,objectId);
    },
    error: function(xhr, type) {
      debug_print(type);
      popUpStart("","", false);
     /* popupGameOver("系统繁忙","请稍后再试");*/
    }
  });
}

function getPlayNum(ic,objectId) {
  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/newyear/api/game/times/" + objectId,
    cache: false,
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if (data.Code == 0) {
        playNumToday = data.playtimes;
        debug_print("playNum :" +playNumToday);
        canContinuePlayNum = canPlayNum-playNumToday?canPlayNum-playNumToday:0 ;
        if(canContinuePlayNum>0){
          popUpStart(ic,objectId,true);
        } else {
          popupGameOver("Game over!","今天游戏次数已用完");
        }
      } else{
        console.info(data);
        popupGameOver("系统繁忙","请稍后再试");
      }
    },
    error: function(xhr, type) {
      console.info(type);
      popupGameOver("系统繁忙","请稍后再试");
    }
  });
}
/*
 * E001：uid错误
 *E002：上报金币数缺失或为0
 *E003：cookie不存在
 *E004：认证失败
 */
function postCoin(ic, objectId, coin) {
  var url = "http://browser.umeweb.com/cn_ume_api/newyear/api/game/coin/exchange";
  debug_print(objectId + "  coin：  " + coin);
  var data = {
    uid: objectId,
    coin: coin
  };
  postCoinJSON(url, data).catch(function(error) {
    debug_print("error: " + JSON.stringify(error));

  }).then(function(value) {
    debug_print("postMoonVote value: " + JSON.stringify(value));
    if(value.Code == 0){
      popUpEndLoginIn(ic, objectId, coin);
    } else {
      popupGameOver("系统繁忙","请稍后再试");
    }
  });
}

function postCoinJSON(url, data) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");

    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText), this);
          //debug_print("ajaxPromise(param) success: " +this.responseText);
        } else {
          var resJson = {
            code: this.status,
            response: this.response
          };
          reject(resJson, this);
        }
      }
    };
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(data));
  });
}


