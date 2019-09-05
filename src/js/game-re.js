//全局变量
var wheel = document.getElementById('wheel'); // 转盘
var arrow = document.getElementById('arrow'); // 转盘按钮
var luckDrawCountDom = document.querySelector('.luckDrawCount span'); // 抽奖次数dom
var luckDrawCount= 5;   //  剩余抽奖次数（页面显示）
var playNum = 5; // 可玩的游戏数目
var countNumberDom = document.querySelector('#count-num span'); // 总抽奖剩余次数dom
var countNumber = 0;//总抽奖剩余次数
var gameState = false;          //  游戏状态

/*时间参数*/
var loginTime = new Date("2018-03-15 00:00:00");//定义新朋友注册时间
var startTime = new Date("2018-03-15 00:00:00").getTime();
var endTime = new Date("2019-05-01 23:59:59").getTime();
var _czc = _czc || [];
_czc.push(["_setAccount", "1273327993"]);

const prize = [          //  奖品设置 传入一个奖项，0，1，2，3，4， 分别是12345等奖
  {
    title: '手气不错哟～恭喜获得',
    num: 5000,
    prize: '5000金币',
  },
  {
    title: '手气不错哟～恭喜获得',
    num: 300,
    prize: '300金币',
  },
  {
    title: '手气不错哟～恭喜获得',
    num: 8888,
    prize: '8888元现金',
  },
  {
    title: '手气不错哟～恭喜获得',
    num: 1,
    prize: '中心手机',
  },
  {
    title: '手气不错哟～恭喜获得',
    num: 8,
    prize: '8元现金',
  }
];
// 奖品指针位置
// 20   一等奖，
// 158  二等奖，
// 200  二等奖，
// 112  三等奖，
// 68   四等奖，
// 计算归着，每次抽奖最终rotateZ值 + 相应的奖品值位置 = (rotateZCount + rotateZPosition[0]) 等于一等奖
var game = {
  // 转盘游戏属性
  rotateZPositionCount : 0,   //  当前转盘的rotateZ 值
  preUseRotateZ: 0,          //  上一次已抽奖中奖奖品的RotateZ
  rotateZ: 360,              //  一圈360deg
  rotateZCount: 10,          //  旋转圈数的倍数
  runTime: 6,                //  游戏过度时间
  rotateZPosition: [20, 158, 200, 112, 68],
  gameAction:function(objectId, rotateZPositionIndex){// 运行游戏
    // 转盘位置计算规则 一圈360deg 乘以 10圈，加上 奖品 rotateZ值，再减去上一次中奖rotateZ值
    var toRotateZCount = (this.rotateZPositionCount - this.preUseRotateZ + this.rotateZPosition[rotateZPositionIndex]) + this.rotateZ * this.rotateZCount; // 达到圈数位置
    wheel.style.transition = 'transform '+ this.runTime +'s ease-in-out 0s'; // 过度时间
    wheel.style.transform = 'rotateZ(' + toRotateZCount + 'deg)'; // 旋转
    this.preUseRotateZ = this.rotateZPosition[rotateZPositionIndex]; // 上传抽奖的中奖rotateZ
    this.rotateZPositionCount = toRotateZCount; // 保存当前转盘值
    luckDrawCount--;  // 游戏次数减一
    // 页面更新抽奖次数
    luckDrawCountDom.innerHTML = luckDrawCount;
    //页面更新总体抽奖次数
    countNumber--;
    countNumberDom.innerHTML = countNumber
    //  弹出中奖信息
    setTimeout(function(){
      gameState = false; // 设置游戏当前状态
      console.info(prize[rotateZPositionIndex].title+ '\r\n' + prize[rotateZPositionIndex].num);
      postCoin(objectId, prize[rotateZPositionIndex].num)
    }, this.runTime*1000);
  }
}

window.onload=function(){
  //带天数的倒计时
  getCurentTime();
  //判断登录
  initLoggedIn();
}

function getRotateZPositionIndex(){
  // 模拟抽奖
  var random = Math.random() * 100;
  var index = parseInt(random) | 0;//中奖物品通过一个随机数生成
  console.info(random +"-----"+ index)
  if (index >= 0 && index <= 4) {
    console.info("5000金币")
    return 0;
  } else {
    console.info("300金币")
    return 1;
  }
}
function getCurentTime(){
  var t  = new Date(),
   endT= t.getFullYear()+"-"+parseInt(t.getMonth()+1)+"-"+t.getDate()+" "+"23:59:59",
   d= new Date(endT),
   s = d.getTime()-t.getTime();
  countNumber = parseInt(s/(60*1000))*68;
  console.info(endT+" D-T:"+s+"  countNumber:"+countNumber);
  countDown(s);
  countNumberDom.innerHTML = countNumber;
  var timer_count = null;
  timer_count = setInterval(function(){
    var random =  parseInt(( Math.random() * 5)+1);
    countNumber = countNumber-random;
    countNumberDom.innerHTML = countNumber;
  },1000)
  if(countNumber <= 0){
    clearInterval(timer_count);
  }
}
//倒数计时
function countDown(times) {
  var timer = null;
  timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0, //时间默认值
      msecond = 0;
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24 * 1000));
      hour = Math.floor(times / (60 * 60 * 1000)) - (day * 24);
      minute = Math.floor(times / (60 * 1000)) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times / 1000) - (day * 24 * 60) - (hour * 60 * 60) - (minute * 60);
      msecond = Math.floor(times) - (day * 24 * 60 * 60 * 1000) - (hour * 60 * 60 * 1000) - (minute * 60 * 1000) - (second * 1000);
    }
    if (day <= 9)
      day = '0' + day;
    if (hour <= 9)
      hour = '0' + hour;
    if (minute <= 9)
      minute = '0' + minute;
    if (second <= 9)
      second = '0' + second;
    if (msecond <= 9)
      msecond = '0' + msecond;
    document.getElementById("timer").innerHTML = '<span>' + hour + "</span><span>" + minute + "</span><span>" + second + " </span> <span>" + parseInt(msecond / 10) + "</span>";
    times = times - 50;
  }, 50);
  if (times <= 0) {
    clearInterval(timer);
  }
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
      clickBtnFn();
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    //clickBtnFn();
    setTimeout(function () {
      pcInitUmeUser(function () {
        getGameInfo()
      });
    }, 20);
  }
}
/*点击按钮处理*/
function clickBtnFn(time){
  $("#shareBtn").click(function () {
    _czc.push(['_trackEvent', '幸运大转盘', 'click', '分享邀请好友赢手机', '', '']);
    if(!time){
      try {
        window.App.login();
      } catch (e) {
        console.info("window.App.login()" + e);
      }
    } else if(time >= loginTime){
      console.info("分享邀请好友赢手机");
      window.location.href = "http://browser.umeweb.com/v6/ume/active/20180621/index.html";
    } else {
      debug_print("shareBtn click!");
      window.location.href = "http://browser.umeweb.com/v6/ume/active/20180621/index.html";
    }
  });
  $("#registerBtn").click(function () {
    _czc.push(['_trackEvent', '幸运大转盘', 'click', '新注册参与抽奖', '', '']);
    if(!time){
      try {
        window.App.login();
      } catch (e) {
        console.info("window.App.login()" + e);
      }
    } else if (time && time < loginTime){
      console.info("新注册参与抽奖");
      window.location.href = "http://browser.umeweb.com/v6/ume/wealth.html";
    } else {
      debug_print("registerBtn click!");
      window.location.href = "http://browser.umeweb.com/v6/ume/wealth.html";
    }
  });
}
function getGameInfo(){
  UMeUser.getUMeUser().then(function (user) {
    debug_print("user: " + JSON.stringify(user));
    if (user == null ) return;
    objectedId = user.objectId();
    var time = user["properties"]["_CreationTime"];
    time = new Date(time);
    debug_print("umeuser _CreationTime:" + time);
    var canPlayNum = 0;
    var NewbiesApprenticsIdArr = [],
      ActiveApprenticsIdArr =[];
    user.getNewbiesApprentics(startTime, endTime, 500, 0).then(function(Appr) {
      debug_print("getNewbiesApprentics" + JSON.stringify(Appr));
      if (Appr.length > 0) {
        for (var i = 0; i < Appr.length; i++) {
          NewbiesApprenticsIdArr[i] = Appr[i]["ApprenticeObjectId"];
        }
        //debug_print("NewbiesApprenticsIdArr: " + NewbiesApprenticsIdArr);
        var cond = DroiBaaS.DroiCondition.gtOrEq("Coin", 100);
        var order = {
          "Coin": false
        };
        user.queryApprenticeList(cond, 500, 0, order).then(function(Apprs) {
          debug_print("  getApprenticeWithEnoughTribute" + JSON.stringify(Apprs));
          if (Apprs.length > 0) {
            for (var i = 0; i < Apprs.length; i++) {
              ActiveApprenticsIdArr[i] = Apprs[i]["ApprenticeObjectId"];
            }
            //debug_print("ActiveApprenticsIdArr: " + ActiveApprenticsIdArr);
            debug_print("Appr.length :" +Appr.length +" Apprs.length "+Apprs.length);
            for (var i = 0; i < Appr.length; i++) {
              if (ActiveApprenticsIdArr.indexOf(NewbiesApprenticsIdArr[i]) >= 0) {
                canPlayNum = canPlayNum + 1;
                debug_print("canPlayNum:"+canPlayNum +"  第"+parseInt(i+1)+"个新徒弟；");
              }
            }
            debug_print("canPlayNum :" +canPlayNum);
            checkUid(objectedId, canPlayNum, time);
            clickBtnFn(time);
          } else {
            debug_print("Apprs null!!");
          }
        }).catch(function(e) {
          debug_print("03:" + e);
        });
      } else {
        debug_print("newAppr is null!!");
        checkUid(objectedId, canPlayNum, time);
        clickBtnFn(time);
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
        debug_print("times playNum :" +playNum);
        debug_print("times canPlayNum :" +canPlayNum);
        luckDrawCount = (time >= loginTime) ? canPlayNum+1-playNum: canPlayNum-playNum;
        debug_print("times luckDrawCount :" +luckDrawCount);
        luckDrawCount = luckDrawCount > 0 ? luckDrawCount : 0;
        debug_print("luckDrawCount :" +luckDrawCount);
      } else{
        luckDrawCount = 0;
      }
      luckDrawCount = 5;//测试
      luckDrawCountDom.innerHTML = luckDrawCount;
      arrow.addEventListener('click', function(){
        _czc.push(['_trackEvent', '幸运大转盘', 'click', '我要抽奖', '', '']);
        // 判断游戏是否进行中 判断是否还有抽奖资格
        if(gameState || luckDrawCount <= 0) return;
        gameState = true; // 设置游戏当前状态
        // run game
        //var rotateZPositionIndex = Math.round(Math.random()* 4);
        var rotateZPositionIndex = getRotateZPositionIndex();
        game.gameAction(objectId, rotateZPositionIndex);
      }, false)
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
      width: 5.88889, //设置弹出层宽度，如果不填写为300
      height: 2.44444, //设置弹出层高度，如果不填写为150
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
        width: 5.88889, //设置弹出层宽度，如果不填写为300
        height: 2.44444, //设置弹出层高度，如果不填写为150
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
function gameOverPopup(coin) {
  debug_print("抽奖结果：" + coin);
  var text = '<div class="notice"><p class="coin"><span style="font-size: 0.5rem">'+coin+'</span>金币</p>'
    +'<p>金币将于1天内存入你的微米账户</p></div> <button class="btn_ck">去查看</button>';
  popup.open({
    width: 6.44444, //设置弹出层宽度，如果不填写为300
    height: 4.16667, //设置弹出层高度，如果不填写为150
    title: "恭喜你！抢到", //设置标题
    content: text //设置内容
  });
  $(".popUp_c").attr("id", "pop_game");
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
    "background-color": "#FFE1BE"
  });
  $("#pop_game h2").css({
    "height": "1.4rem",
    "line-height": "1.4rem",
    "color": "#c8831f",
    "font-weight":'normal',
    "font-size": ".6rem"
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
    "font-size": ".3rem",
    "text-align": "center"
  });
  $("#pop_game button").css({
    "font-size": ".3rem",
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
function getUmeUserInfo(callback) {
  // 获取token和objID
  var token = "";
  var objectId = "";
  //获取token
  try {
    token = window.App.getToken(); //需要确认
    objectId = window.App.getObjectId();
  } catch (e) {
    debug_print("getUmeUserInfo 101: " + e);
  }
  debug_print("token: " + token +" objectId: "+objectId);
  // 初始化objID
  if (token != "" && objectId != "") {
    UMeUser.initUser(token, objectId).then(function (init_user) {
      debug_print("linitUser user: " + JSON.stringify(init_user));
      postDid(init_user.InviteCode)
      callback(init_user);
    }).catch (function (err) {
      if (err._code == "30002") {
        debug_print("linitUser user: 30002" + JSON.stringify(err));
        getume(function (user) {
        });
      } else if (err._code == "1040006") {
        getume(function (user) {
          if (user != null) {
            user.logout().then(function (user_logout) {
              debug_print("logout user: " + JSON.stringify(user_logout));
              getUmeUserInfo();
            }).catch (function (err) {
              debug_print("104" + err);
            });
          }
        });
      }
      callback(null);
    });
  } else {
    debug_print("getUmeUserInfo 103: " + e);
    callback(null);
  }

  function getume(callback) {
    // 获取umeuser
    try {
      UMeUser.getUMeUser().then(function (data) {
        debug_print("getume() common" + JSON.stringify(data));
        postDid(data.InviteCode)
        callback(data);
      }).catch (function (e) {
        debug_print("getume() common error: " + e);
        callback(null);
      });
    } catch (e) {
      debug_print("getUmeUserInfo 102: " + e);
      callback(null);
    }

  }
}

/*pc端测试*/
function pcInitUmeUser(callback) {
  var token = "30bef9000815fe8f",
    objectId = "0f1c4e2aa4cd1a8a7977f324";
  UMeUser.initUser(token, objectId).then(function (init_user) {
    debug_print("linitUser user: " + JSON.stringify(init_user));
    postDid(init_user.InviteCode)
    callback(init_user);
  }).catch (function (err) {
    debug_print("linitUser user err: " + err);
    if (err._code == "30002") {
      getume(function (user) {
      });
    } else if (err._code == "1040006") {
      getume(function (user) {
        if (user != null) {
          user.logout().then(function (user_logout) {
            debug_print("logout user: " + JSON.stringify(user_logout));
            pcInitUmeUser();
          }).catch (function (err) {
            debug_print("104" + err);
          });
        }
      });
    }
    callback(null);
  });

  function getume(callback) {
    // 获取umeuser
    try {
      UMeUser.getUMeUser().then(function (data) {
        debug_print("getume() " + JSON.stringify(data));
        postDid(data.InviteCode)
        callback(data);
      }).catch (function (e) {
        debug_print("getume() error: " + e);
        callback(null);
      });
    } catch (e) {
      debug_print("getUmeUserInfo 102: " + e);
      callback(null);
    }

  }
}
function postDid(ic) {
  var url = "http://browser.umeweb.com/cn_ume_api/device/api/v1/save";
  var did = '';
  try {
    did = window.App.getUUID();
  } catch (e_we) {
    debug_print(e_we);
    did = localStorage.getItem('did');
  }
  debug_print("ic:" + ic + "  did: " + did);
  axios.post(url, { //post是用对象传值
    ic: ic,
    did: did
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error);
  });
}
/*局部刷新 2018-03-27*/
window.onRefreshPage = function() {
  debug_print("luckdraw shuaxin onRefreshPage()");
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("shuaxin 正常");
      getGameInfo();
    } else if (isLoggedIn == -1) {
      debug_print("shuaxin 未登录");
    }
  } catch (e) {
    debug_print("shuaxin isLoggedIn " + e);
  }
}
window.debug_print = function(log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}

