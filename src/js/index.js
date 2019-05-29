var click = false,
  continuePlayNum = 10 ,
  playNum = 0,
  objectedId = '';

/*奖品情况*/
var coins = {
  6:300,
  4:888,
  1:5000
};

/*时间限定*/
var loginTime = new Date("2018-12-21 00:00:00");//定义新朋友注册时间
var startTime = new Date("2018-12-21 00:00:00").getTime();
var endTime = new Date("2019-03-15 23:59:59").getTime();

/*抽奖对象*/
var lottery = {
  index: -1,    //当前转动到哪个位置，起点位置
  count: 0,    //总共有多少个位置
  timer: 0,    //setTimeout的ID，用clearTimeout清除
  speed: 100,    //初始转动速度
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
      $lottery.find(".start span").text(continuePlayNum);
    }
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
    $(lottery).find(".lottery-unit-" + index).addClass("active");
    this.index = index;
    return false;
  },
  start: function(){
    var self = lottery;
    self.times += 1;
    self.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
    if (self.times > self.cycle + 10 && self.prize == self.index) {
      clearTimeout(self.timer);
      gameOverFn(self.prize);
      self.prize = -1;
      self.times = 0;
      click = false;
    } else {
      if (self.times < self.cycle) {
        self.speed -= 10;
      } else if (self.times == self.cycle) {
        var random = Math.random() * 100;
        var index = parseInt(random) | 0;//中奖物品通过一个随机数生成
        debug_print("random: "+random+" index: "+index)
        if (index === 0) {
          self.prize = 1;
        } else if (index > 0 && index <= 5) {
          self.prize = 4;
        } else {
          self.prize = 6;
        }
      } else {
        if (self.times > self.cycle + 10 && ((self.prize == 0 && self.index == 7) || self.prize == self.index + 1)) {
          self.speed += 110;
        } else {
          self.speed += 20;
        }
      }
      if (self.speed < 40) {
        self.speed = 40;
      }
      self.timer = setTimeout(self.start, self.speed);//循环调用
    }
    return false;
  },
  stop: function (index) {
    this.prize = index;
    return false;
  }
};

window.onload = function () {
  /*初始化抽奖转盘*/
  lottery.init('lottery');
  initLoggedIn();
}

/*滚动影藏按钮*/
$(window).scroll(function(){
  var min_height = 40;
  var s =$(window).scrollTop();
  if(s < min_height){
    $("section.btn").show()
  }else{
    $("section.btn").hide()
  }
});

/**
 * 判断是否登录
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
      linkFn(false);
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    /*悬浮按钮点击*/
    linkFn(true);
    /*开始抽奖点击*/
    $("#lottery a").click(function () {
      _czc.push(['_trackEvent', '端午活动', 'click', '我要抽奖', '', '']);
      if (click || continuePlayNum <= 0) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
        return false;
      } else {
        lottery.speed =100;//初始化速度
        lottery.start();    //转圈过程不响应click事件，会将click置为false
        click = true; //一次抽奖完成后，设置click为true，可继续抽奖
      }
    });
    /*setTimeout(function () {
      pcInitUmeUser(function () {
        getGameInfo()
      });
    }, 20);*/
  }
}
/*悬浮按钮点击函数*/
function linkFn(isLogin){
  $("#shareBtn").click(function () {
    _czc.push(['_trackEvent', '端午活动', 'click', '分享好友', '', '']);
    if(!isLogin){
      getToLogin()
    }  else {
      debug_print("shareBtn click!");
      window.location.href = "http://browser.umeweb.com/v6/ume/active/20180621/index.html";
    }
  });
  $("#registerBtn").click(function () {
    _czc.push(['_trackEvent', '端午活动', 'click', '吃粽子领金币', '', '']);
    if(!isLogin){
      getToLogin()
    } else {
      debug_print("registerBtn click!");
      window.location.href = "http://browser.umeweb.com/v6/ume/wealth.html";
    }
  });
}
/*获取用户信息*/
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
function gameOverFn(prize){
  //显示抽奖次数
  var num = parseInt(prize);
  continuePlayNum--;
  $(".start span").text(continuePlayNum);
  //postCoin(objectedId, coins[num])
  gameOverPopup(coins[num])

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

