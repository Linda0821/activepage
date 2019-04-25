var lottery = {
  index: -1,    //当前转动到哪个位置，起点位置
  count: 0,    //总共有多少个位置
  timer: 0,    //setTimeout的ID，用clearTimeout清除
  speed: 20,    //初始转动速度
  times: 0,    //转动次数
  cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize: -1,    //中奖位置
  init: function (id) {
    if ($("#" + id).find(".lottery-unit").length > 0) {
      $lottery = $("#" + id);
      $units = $lottery.find(".lottery-unit");
      this.obj = $lottery;
      this.count = $units.length;
      $lottery.find(".lottery-unit-" + this.index).addClass("active");
    }
    ;
  },
  roll: function () {
    var index = this.index;
    var count = this.count;
    var lottery = this.obj;
    $(lottery).find(".lottery-unit-" + index).removeClass("active");
    index += 1;
    if (index > count - 1) {
      index = 0;
    }
    ;
    $(lottery).find(".lottery-unit-" + index).addClass("active");
    this.index = index;
    return false;
  },
  stop: function (index) {
    this.prize = index;
    return false;
  }
};

function roll() {
  lottery.times += 1;
  lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
  if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
    clearTimeout(lottery.timer);
    gameOverFn(lottery.prize);
    lottery.prize = -1;
    lottery.times = 0;
    click = false;

  } else {
    if (lottery.times < lottery.cycle) {
      lottery.speed -= 10;
    } else if (lottery.times == lottery.cycle) {
      //var index = Math.random()*(lottery.count)|0;//中奖物品通过一个随机数生成
      var random = Math.random() * 100;
      console.info(random)
      var index = parseInt(random) | 0;//中奖物品通过一个随机数生成
      console.info(index)
      if (index === 0) {
        lottery.prize = 7;
      } else if (index > 0 && index <= 5) {
        lottery.prize = 5;
      } else {
        lottery.prize = 3;
      }
    } else {
      if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
        lottery.speed += 110;
      } else {
        lottery.speed += 20;
      }
    }
    if (lottery.speed < 40) {
      lottery.speed = 40;
    }
    ;
    //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
    lottery.timer = setTimeout(roll, lottery.speed);//循环调用
  }
  return false;
}
function gameOverFn(prize){
  //显示抽奖次数
  var num = parseInt(prize);
  continuePlayNum--;
  $(".start span").text(continuePlayNum);
  var coins = {
    3:300,
    5:888,
    7:2000
  };
  postCoin(objectedId, coins[num])

}
var click = false,
  continuePlayNum = 0 ,
  playNum = 0,
  objectedId = '';

var loginTime = new Date("2018-12-21 00:00:00");//定义新朋友注册时间
var startTime = new Date("2018-12-21 00:00:00").getTime();
var endTime = new Date("2019-03-15 23:59:59").getTime();

window.onload = function () {
  lottery.init('lottery');
  jishuFn();
  initLoggedIn();
}
/**
 * 1.判断是否登录
 * 2.未登录 点击跳转新老用户都跳转登录
 * 3.登录了获取到信息，判断是新用户还是老用户
 * 4.新用户,活动期间收徒数+1-接口游戏数；提示，您已经登录，可以抽奖了
 * 5.老用户，活动期间收徒数-接口游戏数 可以跳转收徒页面
 * */
function initLoggedIn() {
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("正常");
      setTimeout(function () {
        getUmeUserInfo(function () {
          getGameInfo()
        });
      }, 20);

    } else if (isLoggedIn == -1) {
      debug_print("未登录");
      linkFn();
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    //linkFn();
    setTimeout(function () {
      pcInitUmeUser(function () {
        getGameInfo()
      });
    }, 20);
  }
}

function getGameInfo(){
  UMeUser.getUMeUser().then(function (user) {
    debug_print("user: " + JSON.stringify(user));
    if (user == null ) return;
    objectedId = user.objectId();
    var time = user["properties"]["_CreationTime"];
    time = new Date(time);
    debug_print("umeuser _CreationTime:" + time);
    share(".part-2", user.InviteCode);
    var canPlayNum = 0;
    var NewbiesApprenticsIdArr = [],
      ActiveApprenticsIdArr =[];
    user.getNewbiesApprentics(startTime, endTime, 100, 0).then(function(Appr) {
      debug_print("getNewbiesApprentics" + JSON.stringify(Appr));
      if (Appr.length > 0) {
        for (var i = 0; i < Appr.length; i++) {
          NewbiesApprenticsIdArr[i] = Appr[i]["ApprenticeObjectId"];
        }
        debug_print("NewbiesApprenticsIdArr: " + NewbiesApprenticsIdArr);
        var cond = DroiBaaS.DroiCondition.gtOrEq("Coin", 200);
        var order = {
          "Coin": false
        };
        user.queryApprenticeList(cond, 200, 0, order).then(function(Apprs) {
          debug_print("  getApprenticeWithEnoughTribute" + JSON.stringify(Apprs));
          if (Apprs.length > 0) {
            for (var i = 0; i < Apprs.length; i++) {
              ActiveApprenticsIdArr[i] = Apprs[i]["ApprenticeObjectId"];
            }
            debug_print("ActiveApprenticsIdArr: " + ActiveApprenticsIdArr);
            for (var i = 0; i < Appr.length; i++) {
              if (ActiveApprenticsIdArr.indexOf(NewbiesApprenticsIdArr[i]) >= 0) {
                canPlayNum = canPlayNum + 1;
                debug_print("canPlayNum:"+canPlayNum +"  第"+parseInt(i+1)+"个新徒弟；");
              }
            }
            checkUid(objectedId, canPlayNum, time);
            linkFn(time);
          } else {
            debug_print("Apprs null!!");
          }
        }).catch(function(e) {
          debug_print("03:" + e);
        });
      } else {
        debug_print("newAppr is null!!");
        checkUid(objectedId, canPlayNum, time);
        linkFn(time);
      }
    }).catch(function(e) {
      debug_print("02" + e);
    });

  }).catch(function (e) {
    debug_print("user error: " + e);
  });
}
function linkFn(time){
  $("#newFriend").click(function () {
    _czc.push(['_trackEvent', '双蛋活动', 'click', '新朋友，首次注册即可参与>>>', '', '']);
    if(!time){
      try {
        window.App.login();
      } catch (e) {
        console.info("window.App.login()" + e);
      }
    } else if(time >= loginTime){
      console.info("新朋友");
      window.location.href = "http://browser.umeweb.com/v6/ume/wealth.html";
    } else {
      debug_print("newFriend click!");
    }
  });
  $("#oldFriend").click(function () {
    _czc.push(['_trackEvent', '双蛋活动', 'click', '老朋友, 邀请一个朋友（进贡>200金币)=1次机会，这就去收徒>>>', '', '']);
    if(!time){
      try {
        window.App.login();
      } catch (e) {
        console.info("window.App.login()" + e);
      }
    } else if (time && time < loginTime){
      console.info("老朋友");
      window.location.href = "http://browser.umeweb.com/v6/ume/active/20180621/index.html";
    } else {
      debug_print("oldFriend click!");
    }
  });
}
/*验证objected id*/
function checkUid(objectId, canPlayNum, time) {
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
      getPlayNum(objectId, canPlayNum, time);
    },
    error: function(xhr, type) {
      debug_print(type);
    }
  });
}

function getPlayNum(objectId, canPlayNum, time) {
  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/newyear/api/times/" + objectId,
    cache: false,
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if (data.Code == 0) {
        playNum = data.playtimes;
        debug_print("playNum :" +playNum);
        continuePlayNum = (time >= loginTime) ? canPlayNum+1-playNum: canPlayNum-playNum;
        continuePlayNum = continuePlayNum > 0 ? continuePlayNum : 0;
      } else{
        continuePlayNum = 0;
      }
      //continuePlayNum = 5;//测试
      $(".start span").text(continuePlayNum);
      $("#lottery a").click(function () {
        _czc.push(['_trackEvent', '双蛋活动', 'click', '我要抽奖', '', '']);
        if (click || continuePlayNum <= 0) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
          return false;
        } else {
          lottery.speed = 100;
          roll();    //转圈过程不响应click事件，会将click置为false
          click = true; //一次抽奖完成后，设置click为true，可继续抽奖
          return false;
        }
      });
    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}
/*
 * E001：uid错误
 *E002：上报金币数缺失或为0
 *E003：cookie不存在
 *E004：认证失败
 */
function postCoin(objectId, coin) {
  var url = "http://browser.umeweb.com/cn_ume_api/newyear/api/coin/exchange";
  debug_print(objectId + "  coin：  " + coin);
  var data = {
    uid: objectId,
    coin: coin
  };

  postJSON(url, data).catch(function(error) {
    debug_print("error: " + JSON.stringify(error));
    var html = '<div class="notice_pop">亲，服务器繁忙，等会过来再试？</div>';
    popup.open({
      width: 13.11111, //设置弹出层宽度，如果不填写为300
      height: 4.88889, //设置弹出层高度，如果不填写为150
      title: "", //设置标题
      content: html //设置内容
    });
    $("#submitBtn").html("确认");

  }).then(function(value) {
    debug_print("postMoonVote value: " + JSON.stringify(value));
    if (value.Code == 0) {
      gameOverPopup(coin);//抽奖结果
    } else {
      var html = '<div class="notice_pop">亲，服务器繁忙，等会过来再试？</div>';
      popup.open({
        width: 13.11111, //设置弹出层宽度，如果不填写为300
        height: 4.88889, //设置弹出层高度，如果不填写为150
        title: "", //设置标题
        content: html //设置内容
      });
      $("#submitBtn").html("确认");
    }
  });
}

function postJSON(url, data) {
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
function jishuFn(){
  var d = new Date();
  var p = new Date("2019-02-16 00:00:00");
  var number_init= (d >= p) ? 3121+parseInt((d-p)/60000)*9:3121;
  console.info("count:"+number_init)
  $(".join-people-btn span").text(number_init);
  var Timer =setInterval(function(){
    number_init= number_init+9;
    $(".join-people-btn span").text(number_init);
    //console.info(number_init)
  },60000)
  if( d.getTime() > endTime ){
    window.clearInterval(Timer);
  }
}

/*未登录情况下的弹框*/
function gameOverPopup(coin) {
  debug_print("抽奖结果：" + coin);
  var text = '<div class="notice"><p class="coin"><span style="font-size: 1.6rem">'+coin+'</span>金币</p>'
    +'<p>金币将于1天内存入你的微米账户</p></div> <button class="btn_ck">去查看</button>';
  popup.open({
    width: 13.44444, //设置弹出层宽度，如果不填写为300
    height: 8.16667, //设置弹出层高度，如果不填写为150
    title: "恭喜你！抢到", //设置标题
    content: text //设置内容
  });
  $(".popUp_c").attr("id", "pop_game");
  $("#cancelBtn").show().css({
    "width": "1.1111rem",
    "height": "1.1111rem",
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $("#pop_game").css({
    "background-color": "#FFE1BE"
  });
  $("#pop_game h2").css({
    "height": "2.4rem",
    "line-height": "2.4rem",
    "color": "#c8831f",
    "font-weight":'normal',
    "font-size": ".93333rem"
  });
  $("#pop_game .notice").css({
    "margin": "0 .22222rem .66667rem .22222rem",
    "text-align": "left",
    "font-size": ".6rem",
    "color": "#c8831f"
  });
  $("#pop_game .notice .coin").css({
    "color": "#E2311E"
  });
  $("#pop_game p").css({
    "font-size": ".66667rem",
    "text-align": "center"
  });
  $("#pop_game button").css({
    "font-size": ".66667rem",
    "text-align": "center",
    "border":"none",
    "color": "#c8831f",
    "background-color":"transparent",
    "text-decoration": 'underline'
  });
  $("#pop_game button").click(function(){
    window.location.href = "http://browser.umeweb.com/v6/ume/wealth.html";
  });

}

$(window).scroll(function(){
  var min_height = 40;
  var s =$(window).scrollTop();
  if(s < min_height){
    $("section.btn").show()
  }else{
    $("section.btn").hide()
  }
});