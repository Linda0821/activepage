
var canvasObj = $('#canvas');//$ canvas对象
var ca = document.getElementById("canvas"); //js canvas对象;

var ctx = ca.getContext("2d");
import bgURL from '../img/bg-min.png'
import renURL from '../img/people.png'
//var bgURL = './img/bg-min.png'
//var renURL = './img/people.png'

var interval;//计时器
//var interval1;//定时器

var game = {
  B: 0.56,//调整系数
  isFirstPlay:false,
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
    range:300 //金币横坐标范围
  },
  init: function(isFirst){
    /*背景*/
    this.img.bg.src = bgURL;
    //this.img.bg.src = './img/bj.png'
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
    //this.people.img.src = './img/ren.png'
    this.people.width = 86*0.6;
    this.people.height = 218*0.6;
    this.people.x= 0;
    this.people.y = this.canvas.canvasH-this.people.height;

    this.coin.range = this.canvas.canvasW - 55; //去除金币宽度的的长度
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
  start: function (isFirst){
    var self = this;
    self.init();
    if(isFirst == true)  self.isFirstPlay = true ;
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
    var p = 0, q = 3;
    for(var i=0;i<self.tu.length;i++){
      if(self.jianche(self.people,self.tu[i])) {//碰撞时消失
        if ( self.tu[i].q === 1 ) {//每接一个积极词汇
          self.coin.fs+=5;//fs+=1;
          self.coin.fc+=1;
        } else {//每接一个消极词汇
          self.coin.fs-=3;//fs+=10;
          self.coin.rc+=1;
        }
        self.tu[i].y+=200;
      }else if(!self.jianche(self.people,self.tu[i])){
        //ctx.drawImage(tu[i].image,tu[i].x,tu[i].y,60*B,60*B);
        self.tu[i].y+=self.coin.sudu;
      }
      if(self.tu[i].q ===1){
        fillRoundRect(ctx, self.tu[i].x, self.tu[i].y, 50, 55, 10, self.cuyu[p], '#be2a2a' );
        p++;
        if(p===3) p=0;
      } else {
        fillRoundRect(ctx, self.tu[i].x, self.tu[i].y, 50, 55, 10, self.cuyu[q] , '#407c30');
        q++;
        if(q===6) q=3;
      }
      //ctx.fillRect(self.tu[i].x, self.tu[i].y, 50, 55);
      //ctx.drawImage(self.tu[i].image,self.tu[i].x,self.tu[i].y,60*0.7,60*0.7);
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
            while(Math.abs(i-self.tu[2*self.coin.chi].x)<55){//Math.abs()绝对值
              i=Math.round(Math.random()*self.coin.range);
            }
          }
          var k=Math.round(Math.random()*self.coin.zl);//100随机选择积极消极
          if(k < 70){//90
            //self.tu[j].image.src='http://browser.umeweb.com/v6/ume/game/coingame/images/1.png';
            self.tu[j].q = 1;
          } else {
            //self.tu[j].image.src='http://browser.umeweb.com/v6/ume/game/coingame/images/3.png';
            self.tu[j].q = 2;
          }
          //设定金币初始位置
          self.tu[j].x=i;
          self.tu[j].y=-Math.round(Math.random()*300);
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
    //console.info(this)
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
      if(self.isFirstPlay == false) postGoldMedal(objId);
      popUpEnd(self.coin.fs);
    },300)
  }
}
var objId = '';
try {
  objId = window.App.getObjectId();
} catch (e) {
  debug_print("201:\r\n" + e);
  objId = 'd9fb4fbaa4b9ce1852ef8a2c';
}
window.onload = function(){
  popUpStart(true);
  /*checkUid(objId,function(isPlayToday){
    popUpStart(isPlayToday);
  });*/
}
/**该方法用来绘制一个有填充色的圆角矩形
 * 封装矩形圆角
 *@param cxt:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param fillColor:填充颜色
 **/
function fillRoundRect(cxt, x, y, width, height, radius, txt, /*optional*/ fillColor) {

  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) { return false; }

  cxt.save();
  cxt.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(cxt, width, height, radius);
  cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
  cxt.fill();
  cxt.restore();
  cxt.fillStyle= '#e7cea8';
  ctx.font="16px Verdana";
  cxt.fillText(txt, x+10, y+32, width);
}
/*绘制图形*/
function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath(0);
  //从右下角顺时针绘制，弧度从0到1/2PI
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

  //矩形下边线
  cxt.lineTo(radius, height);

  //左下角圆弧，弧度从1/2PI到PI
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

  //矩形左边线
  cxt.lineTo(0, radius);

  //左上角圆弧，弧度从PI到3/2PI
  cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

  //上边线
  cxt.lineTo(width - radius, 0);

  //右上角圆弧
  cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

  //右边线
  cxt.lineTo(width, height - radius);
  cxt.closePath();
  /*ctx.stroke();
  ctx.font="20px Verdana";
  ctx.strokeStyle = "red";
  ctx.strokeText("勤劳", 2/width, 2/height,width);
  ctx.stroke();*/
}
/*开始游戏弹框*/
function popUpStart(isPlayToday){
  var txt='快来领取专属于你的辛苦指数吧30秒内，作为劳动人民的你想做什么就接住这项任务', h='10.11111';
  var html = '<div class="notice">'
    + txt+'</div><div class="notice2">参与即可获得一枚光荣勋章</div>'+'<button class="startbtn"></button>'
  popup.open({
    width: 11.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#be2a2a",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "height":"1.6rem"
  });
  $(".popUp_close ").hide();
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#e7cea8",
    "padding": "0 .84444rem 0.88889rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#e7cea8",
    "padding": "0.33333rem .84444rem 0.22222rem",
    "line-height": "1rem"
  });
  $(".startbtn").click(function(){
    deletePop();
    $("#f").show();
    $("#r").show();
    game.start(isPlayToday);
  })
}

function popUpEnd(percent){
  var txt = '',
    h='12.66666';
  if( percent<=20 ){
    txt = '总觉得自己的性格不适合上班，只适合领工资';
  } else if( (percent>= 21 ) && (percent<=40)){
    txt = '成长就是你哪怕难过的快挂了还依然向前';
  }else if( (percent>= 41) && (percent<=60)){
    txt='成功要学，健康要学，创业要学，你的努力注定了你的不平凡！'
  }else if( (percent>= 61) && (percent<=80)){
    txt = '有理想在的地方，<br>地狱就是天堂'
  } else {
    txt = '人生累，不拼不博人生白活，不苦不累人生无味'
  }
  var yi = game.isFirstPlay == true ? '已':'';
  var html = '<button class="glory-big"></button>'
    +'<div class="notice3">'+yi+'获得一枚光荣勋章<br>今年五一的辛苦指数：<span style="color:rgba(255,234,90,1)">'
    + percent + '%</span></div>'
    +'<div class="notice">'+ txt+'</div>'
    +'<button class="sharebtn"></button>'
    +'<button class="endbtn"></button><div class="clear:both;"></div>'
    +'<div class="notice2">.分享图片到朋友圈并发给微微可快速提现</div>'
  popup.open({
    width: 11.44444, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#be2a2a",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "height":".6rem"
  });
  $(".popUp_close ").hide();
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#e7cea8",
    "padding": "0 .84444rem 0.88889rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"center",
    "font-size": ".48888rem",
    "color":"#e7cea8",
    "padding": "2rem .22222rem 0.22222rem",
    "line-height": "1rem"
  });
  $(".notice3").css({
    "text-align":"center",
    "font-size": ".58889rem",
    "color":"#e7cea8",
    "padding": ".22222rem .22222rem 0.22222rem",
    "line-height": "1rem"
  });
  $(".sharebtn").click(function(){
    deletePop();
    _czc.push(['_trackEvent', '收徒活动', 'click', '朋友圈邀请', '', '']);
    window.App.shareToWeChatFriends("http://browser.umeweb.com/v6/ume/game/labourgame/active.html", 0);
  })
  $(".endbtn").click(function(){
    deletePop();
    game.isFirstPlay = true;
    game.start(false);
  })
}

function checkUid(objectId, callback) {

  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/wy/api/check/" + objectId,
    dataType: 'json',
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      debug_print("sucess:" + JSON.stringify(data));
      var isPlayToday = false ;
      if(data.Code == 0){
        debug_print(data.User.lastplaytime);
        isPlayToday = isTodayToDot(data.User.lastplaytime);
      }
      callback(isPlayToday);
    },
    error: function(xhr, type) {
      debug_print(type);
      callback(false);
    }
  });
}
//兑换零钱
function postGoldMedal(objectId) {
  var url = "http://browser.umeweb.com/cn_ume_api/wy/api/reward/" + objectId;
  postGoldMedalJSON(url, { //post是用对象传值
    uid: objectId
  }).catch(function(error) {
    debug_print("error: " + JSON.stringify(error));
  }).then(function(value) {
    debug_print("postMoonVote value: " + JSON.stringify(value));
  });
}


function postGoldMedalJSON(url, data) {
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

