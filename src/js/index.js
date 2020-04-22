var data_ac = {
    "success": true,
    "data": {
      "water01":1,
      "water02":1,
      "water03":0,
      "water04":0,
      "watered":0,
      "watered_total":0,
      "point":0,
      "totalPoint":200365,
      "isFirstTime":false
    }
};
var isShareClick = false;
var myCoin = 0;
const crypto = require('crypto')
const img1_pop = require('../img/img1_pop.png')
const img2_pop = require('../img/img2_pop.png')
var appSecrect = "ESTATEACTIVE-V7";

// var img1_pop = './img/img1_pop.png',
// img2_pop = './img/img2_pop.png';

$(function () {
  // 定时器
  //定义3秒后隐藏loading
  setInterval(function () {
    $(".loader").hide();
  }, 1500);
  IsLoginIn();
});

function IsLoginIn(){
  console.info("判断是否登录");
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      console.info("正常");
      isShareClick = true;
      var objectId ="";
      try {
        objectId = window.App.getObjectId();
      } catch (e) {
        objectId ="5e0eadd40f7b5e71934fa849";
        debug_print("getUmeUserInfo 101: " + e);
      }
      checkUid(objectId);
      share(".part-share");
    } else if (isLoggedIn == -1) {
      console.info("未登录");
      $(".tree-box").eq(0).show().siblings('.tree-box').hide();
      clickFn('', false, data_ac.data);
    }
  } catch (e) {
    /*/*pc端*/
    var objectId ="";
    try {
      objectId = window.App.getObjectId();
    } catch (e) {
      objectId ="5e0eadd40f7b5e71934fa849";
      debug_print("getUmeUserInfo 101: " + e);
    }
    checkUid(objectId);
    share(".part-share");
  }
}
function renderFromData(objectId,obj){
  /*显示种树*/
  if(obj.isFirstTime === true){
    $(".tree-box").eq(0).show().siblings('.tree-box').hide();
  } else {
    /*显示总金币数*/
    $(".coin-mine").show().find('span').text(obj.totalPoint);
    /*显示金币数*/
    if(obj.point>0) {
      $(".coin").show().attr("data-show","1").attr("data-g",obj.point);
      $(".time-count").hide();
    } else {
      $(".time-count").show();
    }
    /*显示大树小树*/
    if(obj.watered_total <= 2000){
      $(".tree-box").eq(1).show().siblings('.tree-box').hide();
    } else if(obj.watered_total <= 5000){
      $(".tree-box").eq(2).show().siblings('.tree-box').hide();
    } else if(obj.watered_total > 5000){
      $(".tree-box").eq(3).show().siblings('.tree-box').hide();
    }
    /*水滴显示状态*/
    if(obj.water01 === 1) {
      $(".water1").show().attr("data-show","1");

      var d = new Date().getDay();//1585288567849+(2*24*60*60*1000)
      console.info(d)
      if( (d == 0) || (d == 6)){
        $(".water1").attr("data-g","20g")
      }
    }
    if(obj.water02 === 1) {
      $(".water2").show().attr("data-show","1");
    }
    if(obj.water03 === 1) {
      $(".water3").show().attr("data-show","1");
      var d = new Date().getDay();//1585288567849+(2*24*60*60*1000)
      console.info(d)
      if( (d == 0) || (d == 6)){
        $(".water1").attr("data-g","20g")
      }
    }
    if(obj.water04 === 1) {
      $(".water4").show().attr("data-show","1");
    }
    /*距离凌晨00:30时间*/
    var timeNow = new Date() / 1000;
    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var oneDayAfter = timeStamp +86400 * 1+31*60;
    console.log(oneDayAfter);
    countDown((oneDayAfter-timeNow)*1000);

    /*控制水滴位置*/
    var len = $(".water[data-show$='1']").length;
    var arr  = [];
    if(len === 6 ){
      arr  = ['32%','38%','46%','53%','62%','70%'];
    } else if(len === 5 ){
      arr  = ['36%','42%','53%','62%','70%'];
    } else if(len === 4 ){
      arr  = ['36%','42%','53%','66%'];
    } else if(len === 3 ){
      arr  = ['36%','45%','55%'];
    } else if(len === 2 ){
      arr  = ['40%','55%'];
    } else if(len === 1 ){
      arr  = ['46%'];
    }
    for(var i =0 ;i<len; i++){
      $(".water[data-show$='1']").eq(i).css('left',arr[i]);
    }
  }
  if(objectId && objectId.length>0){
    clickFn(objectId, true, obj);
  } else {
    clickFn('', false, obj);
  }
}
function clickFn(objectId, isLogin, obj){
  debug_print('clickFn isLogin: '+isLogin);
  debug_print("clickFn objectId: " + objectId);
  $(".coin-mine").unbind("click").click(function(){
    debug_print("clickFn coin-mine");
    window.location.href = 'http://browser.umeweb.com/v6/ume/wealth.html';
  });
  $('.water-btn').unbind("click").click(function(){
    debug_print("clickFn water-btn");
    if(!isLogin){
      getToLogin();
    } else {
      window.location.href = 'http://browser.umeweb.com/v7/ume/task.html';
    }
  });
  $(".recording-btn").unbind("click").click(function(){
    debug_print("clickFn recording-btn");
    if(!isLogin){
      getToLogin();
    } else {
      window.location.href = 'recording.html';
    }
  });
  $('.part-task li span').unbind("click").click(function(){
    var n = $(this).attr('data-id');
    console.info(n);
    if(!isLogin){
      getToLogin();
    } else {
      switch(parseInt(n)){
        case 0:
          window.location.href = 'http://browser.umeweb.com/v7/ume/index.html';
          break;
        case 1:
          window.location.href = 'http://browser.umeweb.com/v7/ume/task.html';
          break;
        case 2:
          goToTab1();
          break;
        case 3:
          window.location.href = 'http://browser.umeweb.com/v7/ume/index.html';
          break;
        default : break;
      }
    }
  });
  $('.tree-box .tree-btn').unbind("click").click(function () {
    debug_print('tree-btn isLogin: '+isLogin);
    if(!isLogin){
      popUpgetToLogin();
    } else {
      popUpGetTree(objectId, obj);
    }
  });
  $(".water").unbind("click").click(function () {
    //if(objectId.length<=0) return;
    var self = $(this);
    self.css('animation', 'drop 1s ease-in 0s 1 normal none running');
    var str = $(this).attr('class');
    var idx = str.substr(str.length-1,1);
    console.info(str + ' '+ parseInt(idx));
    postWater(objectId, parseInt(idx));
    setTimeout(function () {
      self.hide();
      $(".tree-s .tree-top").css('animation', 'swing 1s ease-in 0s 1 normal none running');
      setTimeout(function () {
        $(".tree-s .tree-top").css("animation","");
      }, 1000);
    }, 1000);
  });
  $(".coin").unbind("click").click(function () {
    //if(objectId.length<=0) return;
    var self = $(this);
    self.css('animation', 'drop 1s ease-in 0s 1 normal none running');
    postCoin(objectId,$(".coin").attr("data-g"));
    setTimeout(function () {
      self.hide();
      $(".time-count").show();
    }, 1000);
  });
}

/*验证objected id*/
function checkUid(objectId) {
  $.ajax({
    type: 'post',
    url: "http://browser.umeweb.com/ume_user_service/api/v1/active/estate/info",
    data:{
      "uid": objectId
    },
    success: function(data) {
      debug_print("checkUid: " + JSON.stringify(data));
      if(data.success ==true){
        var obj = data.data? data.data: data_ac.data;
        debug_print("checkUid: " +objectId);
        renderFromData(objectId,obj);
      } else {
        alert(data.msg)
      }

    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}

function postWater(objectId, idx) {
  const timestamp = new Date().getTime();
  let str = objectId+ idx+ +appSecrect+"#*#"+timestamp;
  let ume_sign = crypto.createHash('md5').update(str, 'utf-8').digest('hex');
  console.info(ume_sign)
  $.ajax({
    type: 'POST',
    url: "http://browser.umeweb.com/ume_user_service/api/v1/active/estate/water",
    dataType: 'json',
    data:{
      "uid": objectId,
      "eventId": idx,
      "sign": ume_sign,
      "timestamp": timestamp
    },
    success: function(data) {
      console.info(data);
    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}
function postCoin(objectId,reward) {
  const timestamp = new Date().getTime();
  let str = objectId+ reward+ +appSecrect+"#*#"+timestamp;
  let ume_sign = crypto.createHash('md5').update(str, 'utf-8').digest('hex');
  $.ajax({
    type: 'POST',
    url: "http://browser.umeweb.com/ume_user_service/api/v1/active/estate/coin",
    dataType: 'json',
    data:{
      "uid": objectId,
      "reward": reward,
      "sign": ume_sign,
      "timestamp": timestamp
    },
    success: function(data) {
      console.info(data);
      var c = $(".coin").attr("data-g");
      myCoin = parseInt(myCoin) + parseInt(c);
      $(".coin-mine").show().find('span').text(myCoin);
    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}

//带天数的倒计时
function countDown(times) {
  var timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0; //时间默认值
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24 * 1000));
      hour = Math.floor(times / (60 * 60 * 1000)) - (day * 24);
      minute = Math.floor(times / (60 * 1000)) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times / 1000) - (day * 24 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (day <= 9)
      day = '0' + day;
    if (hour <= 9)
      hour = '0' + hour;
    if (minute <= 9)
      minute = '0' + minute;
    if (second <= 9)
      second = '0' + second;
    $(".time-count").find('span').text(hour+':'+minute+':'+second);
    times = times - 50;
  }, 50);
  if (times <= 0) {
    clearInterval(timer);
  }
}
/*领树苗弹框*/
function popUpGetTree(objectId, obj){
  var h='17.66666';
  var html = '<div class="notice">金币庄园种金树 每天翻倍拿金币</div>'+
    '<img class="img2_pop" src="'+img2_pop+'" alt="">'+
    '<img class="img1_pop" src="'+img1_pop+'" alt="">'+
    '<div class="notice2">每天做任务赚水滴帮助种子成长；</div>'+
    '<div class="notice2">每天都有成熟的金币可以领取哟；</div>'+
    '<button class="startbtn">种一颗会赚钱的树</button>';
  popup.open({
    width: 20.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false);
  $(".popUp_c").css({
    "background-color":"#fff",
    "border-radius":'.8rem'
  });
  $(".popUp_c h2").hide();
  $(".popUp_c .img1_pop").css({
    "height":"76px",
    "padding": "0.4444rem 0"
  });
  $(".popUp_c .img2_pop").css({
    "height":"16px",
    "padding": "0.2222rem 0"
  });
  $("#cancelBtn").hide().css({
    "width": "1.4rem",
    "height": "1.4rem",
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
    "padding": "1.6rem .44444rem 1rem",
    "line-height": "1rem"
  });
  $(".notice2").css({
    "text-align":"left",
    "font-size": ".8rem",
    "padding": "0.2222rem 1.04444rem 0.22222rem",
    "line-height": "1rem"
  });
  $(".startbtn").css({
    "width": "160px",
    "margin-top":"10px",
    "font-size": "16px",
    "border":"none",
    "background-color":"#57b82a",
    "border-radius":'8px',
    "color": "#fff",
    "height":"36px",
    "line-height":"36px"
  }).click(function(){
    deletePop();
    console.info(obj)
    obj.isFirstTime = false;
    renderFromData(objectId, obj)
  })
}
/*未登录*/
function popUpgetToLogin(){
  var h='10.66666';
  var html = '<div class="notice">登录微米获得一颗能长得小树苗哟~<br>每天完成任务翻倍领金币！</div>'+
    '<button class="startbtn">去登录</button>'
  popup.open({
    width: 20.22222, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  var popMask = document.getElementById("popMask");
  popMask.removeEventListener('click', popup.closeDiv,false)
  $(".popUp_c").css({
    "background-color":"#fff",
    "border-radius":'.8rem'
  });
  $(".popUp_c h2").hide();
  $("#cancelBtn").show().css({
    "width": "1.8rem",
    "height": "1.8rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $(".popUp_btn ").hide();
  $(".notice").css({
    "text-align":"center",
    "font-size": "1rem",
    "padding": "1.8rem .44444rem 1rem",
    "line-height": "1.8rem"
  });
  $(".startbtn").css({
    "width": "120px",
    "margin-top":"10px",
    "font-size": "14px",
    "border":"none",
    "background-color":"#57b82a",
    "border-radius":'8px',
    "color": "#fff",
    "height":"36px",
    "line-height":"36px"
  }).click(function(){
    deletePop();
    getToLogin();
  })
}
/*common*/
/*app 打印信息*/
window.debug_print = function(log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}
/*跳转tab1*/
function goToTab1(){
  try {
    window.App.readNews("ume://news");
  } catch (e) {
    debug_print("15:" + e);
  }
}
function getToLogin(){
  try {
    window.App.login();
  } catch (e) {
    console.info("window.App.login()" + e);
  }
}

/*删除弹框*/
function deletePop() {
  var popUp = document.getElementById("popUp");
  var popMask = document.getElementById("popMask");
  document.body.removeChild(popUp);
  document.body.removeChild(popMask);
  $("body").css({
    "overflow": "auto"
  });
}
function share(objstr) {
  console.info($(objstr));
  $(objstr+' ul.share li').unbind("click").click(function () {
    console.info($(this).attr("data-share"));
    var num = $(this).attr("data-share");
    var url = "http://browser.umeweb.cn/";
    try {
      debug_print("邀请收徒" + url);
      // console.info("邀请收徒"+url);
      switch (num) {
        case "WeChat":
          try {
            debug_print("微信邀请");
            _czc.push(['_trackEvent', '收徒活动', 'click', '微信邀请', '', '']);
            window.App.shareToWeChat("", "来看微米浏览器看资讯，看完有现金拿!", url, 0);
          } catch (e) {
            debug_print(e);
          };

          break;
        case "qq":
          try {
            debug_print("QQ邀请");
            _czc.push(['_trackEvent', '收徒活动', 'click', 'QQ邀请', '', '']);
            window.App.shareToQQ("", "来看微米浏览器看资讯，看完有现金拿!", url, 0);
          } catch (e) {
            debug_print(e);
          };
          break;
        case "WeChatFriends":
          try {
            debug_print("朋友圈邀请");
            _czc.push(['_trackEvent', '收徒活动', 'click', '朋友圈邀请', '', '']);
            window.App.shareToWeChatFriends(url, 0);
          } catch (e) {
            debug_print(e);
          };
          break;
        case "faceToFace":
          try {
            var ic_url = url.replace("redbag.html","faceToFace.html");
            debug_print("面对面邀请"+ic_url);
            _czc.push(['_trackEvent', '收徒活动', 'click', '面对面邀请', '', '']);
            window.location.href = ic_url;
          } catch (e) {
            debug_print(e);
          };
          break;
        default:
          debug_print("分享：default");
          break;
      }

    } catch (e) {
      debug_print(e);
    }
  });
}
/*局部刷新*/
window.onRefreshPage = function() {
  debug_print("20190701-activePage shuaxin onRefreshPage()");
  if(isShareClick) return;
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("shuaxin true");
      isShareClick = true;
      var objectId ="";
      try {
        objectId = window.App.getObjectId();
      } catch (e) {
        objectId ="5e0eadd40f7b5e71934fa849";
        debug_print("getUmeUserInfo 101: " + e);
      }
      checkUid(objectId);
      share(".part-share");
    } else if (isLoggedIn == -1) {
      debug_print("shuaxin false");
    }
  } catch (e) {
    debug_print("shuaxin isLoggedIn: " + e);
  }
};