//全局变量
var wheel = document.getElementById('wheel'); // 转盘
var luckDrawCountDom = document.querySelector('.luckDrawCount'); // 抽奖次数dom
var luckDrawCount = 5;   //  剩余抽奖次数（页面显示）
var gameState = false;  //  游戏状态

var appSecrect = "PRIZEACTIVE-V7";

const crypto = require('crypto')

/*50水滴=1 / 100水滴=2 / 100金币=3 / 200金币=4 / 1元红包=5 / 2元红包=6 / 这次没有中奖哦=7*/
var prize = [
  {
    title: '',
    des: '很遗憾，未中奖，下次加油！',
    num: 0,
    idx: 1,
    prize: '这次没有中奖哦',
    rate_r: 0.085,
    rate_e: 0.10,
  },
  {
    title: '中奖啦!',
    des: '您可在摇钱树——金币庄园查看。',
    num: 1,
    idx: 2,
    prize: '50g水滴',
    className: 'img-water',
    rate_r: 0.25,
    rate_e: 0.25,
  },
  {
    title: '中奖啦!',
    des: '您可在摇钱树——金币庄园查看。',
    num: 2,
    idx: 0,
    prize: '60水滴',
    className: 'img-water',
    rate_r: 0.25,
    rate_e: 0.20
  }, {
    title: '中奖啦!',
    des: '您可在我的财富——金币查看。',
    num: 3,
    idx: 3,
    prize: '60金币',
    className: 'img-coin',
    rate_r: 0.25,
    rate_e: 0.25
  }, {
    title: '中奖啦!',
    des: '您可在我的财富——金币查看。',
    num: 4,
    idx: 6,
    prize: '80金币',
    className: 'img-coin',
    rate_r: 0.15,
    rate_e: 0.20,
  }, {
    title: '中奖啦!',
    des: '您可在我的财富——零钱查看。',
    num: 5,
    idx: 5,
    prize: '0.88元红包',
    className: 'img-bag',
    rate_r: 0.01,
    rate_e: 0,
  }, {
    title: '中奖啦!',
    des: '您可在我的财富——零钱查看。',
    num: 6,
    idx: 4,
    prize: '1.21元红包',
    className: 'img-bag',
    rate_r: 0.005,
    rate_e: 0
  },

];

// 计算归着，每次抽奖最终rotateZ值 + 相应的奖品值位置 = (rotateZCount + rotateZPosition[0]) 等于一等奖
var game = {
  // 转盘游戏属性
  rotateZPositionCount: 0,   //  当前转盘的rotateZ 值
  preUseRotateZ: 0,          //  上一次已抽奖中奖奖品的RotateZ
  rotateZ: 360,              //  一圈360deg
  rotateZCount: 10,          //  旋转圈数的倍数
  runTime: 6,                //  游戏过度时间
  rotateZPosition: [25, 75, 128, 180, 230, 285, 330],//[330, 286, 230, 180, 128, 75, 25]
  gameAction: function (objectId, rotateZPositionIndex) {// 运行游戏
    // 转盘位置计算规则 一圈360deg 乘以 10圈，加上 奖品 rotateZ值，再减去上一次中奖rotateZ值
    var toRotateZCount = (this.rotateZPositionCount - this.preUseRotateZ + this.rotateZPosition[rotateZPositionIndex]) + this.rotateZ * this.rotateZCount; // 达到圈数位置
    wheel.style.transition = 'transform ' + this.runTime + 's ease-in-out 0s'; // 过度时间
    wheel.style.transform = 'rotateZ(' + toRotateZCount + 'deg)'; // 旋转
    this.preUseRotateZ = this.rotateZPosition[rotateZPositionIndex]; // 上传抽奖的中奖rotateZ
    this.rotateZPositionCount = toRotateZCount; // 保存当前转盘值
    //  弹出中奖信息
    setTimeout(function () {
      gameState = false; // 设置游戏当前状态
      console.info("rotateZPositionIndex:" + rotateZPositionIndex)
      console.info(prize[rotateZPositionIndex].idx + '\r\n' + prize[rotateZPositionIndex].num + '\r\n' + prize[rotateZPositionIndex].title + '\r\n' + prize[rotateZPositionIndex].prize);
      postCoin(objectId, prize[rotateZPositionIndex].num, prize[rotateZPositionIndex].idx)
    }, this.runTime * 1000);
  },
  gameRandomPrize: function(objectId) {
    // 模拟抽奖
    var prizeNum = 4;
    var random = Math.random() * 100;
    var index = parseInt(random) | 0;//中奖物品通过一个随机数生成
    console.info(random + "-----" + index)
    if (index >= 0 && index < 20) {
      prizeNum = 1;//未中奖
    } else if (index < 40) {
      prizeNum = 0;//60水滴
    } else if (index < 65) {
      prizeNum = 3;//60金币
    } else if (index < 80) {
      prizeNum = 6;//80金币
    } else if (index < 100) {
      prizeNum = 2;//50水滴
    }
    game.gameAction(objectId, prizeNum);

  }
}

window.onload = function () {
  /*处理奖品问题*/
  prize.sort(function (a, b) {
    a = a.idx
    b = b.idx
    return a - b;
  });
  console.info(prize);
  /*判断是否登录*/
  initLoggedIn()
}


/**
 * 1.判断是否登录
 * */
function initLoggedIn() {
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("正常");
      /*获取抽奖信息*/
      loginInFn();

    } else if (isLoggedIn == -1) {
      debug_print("未登录");
      luckDrawCountDom.innerHTML='未登录<br> 请先登录';
      clickFn(false);
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    loginInFn();
  }
}
function loginInFn(){
  /*获取抽奖信息*/
  try {
    var objectId = window.App.getObjectId();
  } catch (e) {
    debug_print("getUmeUserInfo 101: " + e);
    var objectId = "5e0ee2c90f7b5e71934fa84c";
  }
  checkUid(objectId);
}

/**
 * 验证objected id
 * Code=E001表示请求参数错误
 * Code=E002~E006表示系统错误
 */
function checkUid(objectId) {
  $.ajax({
    type: 'post',
    url: "http://browser.umeweb.com/ume_user_service/api/v1/active/prize/info",
    data:{
      "uid": objectId
    },
    success: function(data) {
      debug_print("checkUid: " + JSON.stringify(data));
      if(data.success ==true){
        debug_print("sucess playNum :" + data.data.playNumber);
        luckDrawCount = parseInt(data.data.taskFinishArr.length)+1;//测试
        debug_print("sucess canPlayNum :" +luckDrawCount);
        luckDrawCount = luckDrawCount -parseInt(data.data.playNumber)
        // luckDrawCount = 5; //测试
        luckDrawCountDom.innerHTML='抢豪礼<br>还有<span>'+luckDrawCount+'</span>次';
        clickFn(true, objectId);
      } else {
        busyPopup(data.msg,2.44444);
      }
    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}

/*
 * Code=E001 请求参数错误
 * Code=E002、E003 Cookie无效或者超时
 * Code=E004、E005 系统错误
 * Code=E006 用户不存在（未调用接口1）
 * Code=E007(Card) 翻牌机会已经用完
 * Code=E007(Lottery) 抽奖机会已经用完
 * Code=E008(Card) 翻牌活动达到上限
 * Code=E008(Lottery) 抽奖活动达到上限
 * Code=E009(Card) 翻牌奖品发放处理失败
 * Code=E009(Lottery) 抽奖奖品发放处理失败
 */
function postCoin(objectId, prizeId,idx) {
  const timestamp = new Date().getTime();
  let str = objectId+ prizeId+ +appSecrect+"#*#"+timestamp;
  let ume_sign = crypto.createHash('md5').update(str, 'utf-8').digest('hex');
  console.info(ume_sign)
  var url = 'http://browser.umeweb.com/ume_user_service/api/v1/active/prize/post';
  debug_print(objectId + "  prizeId：  " + prizeId+ "  idx：  " +idx);
  $.ajax({
    type: 'post',
    url: url,
    data:{
      "uid": objectId,
      "eventId": prizeId,
      "sign": ume_sign,
      "timestamp":timestamp
    },
    success: function(data) {
      debug_print("checkUid: " + JSON.stringify(data));
      if(data.success ==true){
        luckDrawCount--;  // 游戏次数减一
        // 页面更新抽奖次数
        luckDrawCountDom.innerHTML = '抢豪礼<br>还有<span>'+luckDrawCount+'</span>次';
        gameOverPopup(idx);//抽奖结果
      } else {
        busyPopup(data.msg,2.44444);
      }

    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}

function clickFn(isLogin,objectId,arr){
  $('#arrow').unbind("click").click(function(){
    debug_print("clickFn arrow");
    if(isLogin == true){
      if (gameState || luckDrawCount <= 0) return;
      gameState = true; // 设置游戏当前状态
      // run game
      game.gameRandomPrize(objectId, arr)
    } else{
      try {
        window.App.login();
      } catch (e) {
        console.info("window.App.login()" + e);
      }
    }
  });
}
function busyPopup(code,h) {
  var p = code ? code:'';
  var html = '<div class="notice_pop">'+p+'</div>';
  popup.open({
    width: 5.88889, //设置弹出层宽度，如果不填写为300
    height: h, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  $("#submitBtn").html("确认");
}

function gameOverPopup(num) {
  debug_print("抽奖结果：" + prize[num].prize + 'num:' + prize[num].num);
  if (prize[num].num == 7) {
    var text = '<div class="notice" style="padding: 0.8rem 0 .6rem;">'
      + '<p>' + prize[num].des + '</p></div> <button class="btn_ck">去查看</button>';
    popup.open({
      width: 6.11111, //设置弹出层宽度，如果不填写为300
      height: 3.16667, //设置弹出层高度，如果不填写为150
      title: '', //设置标题
      content: text //设置内容
    });
    $(".popUp_c h2").hide();
  } else {
    var text = '<div class="notice"><span class="' + prize[num].className + '"></span>'
      + '<p>恭喜您获得' + prize[num].prize + ',</p>'
      + '<p>' + prize[num].des + '</p></div> <button class="btn_ck">去查看</button>';
    popup.open({
      width: 6.111111, //设置弹出层宽度，如果不填写为300
      height: 4.66667, //设置弹出层高度，如果不填写为150
      title: prize[num].title, //设置标题
      content: text //设置内容
    });
    $(".popUp_c").attr("id", "pop_game");
    $("#pop_game h2").css({
      "height": "1.4rem",
      "line-height": "1.4rem"
    });
  }

  $(".popUp_c").attr("id", "pop_game");
  $("#pop_game h2").css({
    "height": "1.4rem",
    "line-height": "1.4rem",
    "color": "#653d20",
    "font-weight": 'normal',
    "font-size": ".6rem"
  });
  $("#cancelBtn").show().css({
    "width": ".6rem",
    "height": ".6rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": ".6rem .6rem",
    "position": " absolute",
    "top": "-1.02222rem",
    "right": "0rem"
  });
  $("#pop_game").css({
    "background-color": "#FCD494"
  });

  $("#pop_game .notice").css({
    "text-align": "left",
    "font-size": ".6rem",
    "color": "#653d20"
  });
  $("#pop_game p").css({
    "font-size": ".33rem",
    "text-align": "center"
  });
  $("#pop_game button").css({
    "width": "2rem",
    "height": ".7rem",
    "line-height": ".7rem",
    "font-size": ".3rem",
    "text-align": "center",
    "border": "none",
    "color": "#fff",
    'margin-top': '.2rem',
    "background-color": "#FF6B60",
    "border-radius": ".6rem"
  });
  $("#pop_game button").click(function () {
    deletePop();
    if (prize[num].className == "img-water") {
      window.location.href = "http://browser.umeweb.com/v7/ume/active/estate/index.html";
    } else if (prize[num].className == "img-coin" || prize[num].className == "img-bag") {
      window.location.href = "http://browser.umeweb.com/v7/ume/index.html";
    } else {
      window.location.href = "http://browser.umeweb.com/v7/ume/index.html";
    }
  });

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

/*局部刷新*/
window.onRefreshPage = function () {
  debug_print("luckdraw shuaxin onRefreshPage()");
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("shuaxin 正常");
      luckDrawCountDom.innerHTML='抢豪礼<br>还有<span>0</span>次';
      loginInFn();
    } else if (isLoggedIn == -1) {
      debug_print("shuaxin 未登录");
    }
  } catch (e) {
    debug_print("shuaxin isLoggedIn " + e);
  }
}
window.debug_print = function (log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}

