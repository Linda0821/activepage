/*公共部分*/
//页面初始化
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth)
        return;
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
    };
  if (!doc.addEventListener)
    return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window); //rem.js

var UmePageUrl = window.location.href;

//用户信息
var data_c = {}; // umeuser命名空间

/*设置计数*/
function countInit() {
  debug_print("countUrl: " + UmePageUrl);
  var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " https://");
  document.write(unescape("%3Cspan id='cnzz_stat_icon_1273327993'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s19.cnzz.com/z_stat.php%3Fid%3D1273327993%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
  $('#cnzz_stat_icon_1273327993').css('display', 'none');
}
// 计数自执行
(function () {
  var myScript = document.createElement("script");
  myScript.async = true;
  myScript.type = "text/javascript";
  myScript.appendChild(document.createTextNode('countInit()'));
  var objDiv = document.body.lastChild;
  objDiv.parentNode.insertBefore(myScript, objDiv);
})()

/*app 打印信息*/
function debug_print(log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}
/*未登录情况下的弹框*/
function notLoginFn() {
  var token = "",
    objectId = "";
  try {
    token = window.App.getToken(); //需要确认
    objectId = window.App.getObjectId();
  } catch (e) {
    debug_print("getUmeUserInfo 101: " + e);
  }

  // TODO hasLogout 从Localstorage中获取
  debug_print("token: " +token +"; objectId:"+objectId);
  var hasLogout = localStorage.getItem('hasLogout');
  debug_print("hasLogout:" +hasLogout);
  if (token == null || token == "" || objectId == null || objectId == "" || hasLogout == "true") {
    notLoginPopFn();//未登陆弹框函数
  } else {
    notLoginBusyPopFn()
  }
}
function notLoginBusyPopFn(){
  var text = '<div class="serverce">服务器繁忙，请稍后再试。</div>';
  popup.open({
    width: 14.44444, //设置弹出层宽度，如果不填写为300
    height: 5.77777, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: text //设置内容
  });
  $(".popUp_c").attr("id", "pop_busy");
  $("#cancelBtn").hide();
  $("#pop_busy").css({
    "margin":"0",
    "width":"100%"
  });
  $("#pop_busy h2").css({
    "height":".88889rem"
  });
  $("#pop_busy div.serverce").css({
    "margin":"0 .22222rem",
    "text-align":"center",
    "height":"1.6rem",
    "line-height":"1.6rem",
    "font-size":".88889rem"
  });
  $("#pop_busy #submitBtn").html("确认").css({
    "height":"2.6rem",
    "font-size":".88889rem",
    "line-height":"2.6rem"
  });
}
/*未登录情况下的弹框*/
function notLoginPopFn() {
  debug_print("用户未登录：" + UmePageUrl);
  var text = '<img class="sucess" src="http://browser.umeweb.com/v6/ume/img/wealth/login.png" alt=""><div class="notice1">亲，请先登录再开始做任务赚钱吧！</div><div class="close_pop">取消</div><div class="login_pop">登录</div>';
  popup.open({
    width: 13.44444, //设置弹出层宽度，如果不填写为300
    height: 6.16667, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: text //设置内容
  });
  $(".popUp_c").attr("id", "popUp_1");
  //关闭按钮
  $(".close_pop").click(function () {
    deletePop();
    $(".popMaskIn").css({
      "display": "block"
    });
  });
  $(".login_pop").click(function () {
    deletePop();
    $(".popMaskIn").css({
      "display": "block"
    });
    try {
      window.App.login();
    } catch (e) {
      console.info("window.App.login()" + e);
    }
  })
  $("#popMask").click(function () {
    debug_print("hide popMask");
    $(".popMaskIn").css({
      "display": "block"
    });
  })
  $(".popMaskIn").click(function () {
    try {
      window.App.login();
    } catch (e) {
      console.info("window.App.login()" + e);
    }
  })
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

/*分享*/
function share(objstr,inviteCode) {
  console.info($(objstr));
  $(objstr+' ul.share li').click(function () {
    console.info($(this).attr("data-share"));
    var num = $(this).attr("data-share");
    var host = location.host;
    var url = "http://browser.umeweb.com/v6/ume/web/redbag.html?ic=*******";
    if (window.location.host == "browser.umeweb.com") {
      url = "http://browser.umeweb.com/v6/ume/web/redbag.html?ic=" + inviteCode;
    } else {
      url = "http://test.umeweb.com:8080/channel/ume/web/redbag.html?ic=" + inviteCode;
    }
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

/*设置banner*/
function setHomeBanner(apps, container) {
  debug_print(apps["BannerUrl"]);
  container.attr({
    "href": apps["DetailUrl"]
  }).css({
    "background": 'url("' + apps["BannerUrl"] + '") no-repeat',
    "background-size": "100% 100%"
  });

}
/*设置banner轮播*/
function setAutoPlayBanner(banners, container) {
  // 拼接dom
  var imgs = '';
  var points = '';
  //<div class="swiper-slide">slider1</div>
  $.each(banners, function (i, banner) {
    imgs += '<div class="swiper-slide"><a href="' + banners[i]["DetailUrl"] + '" class="_trackEvent" data-label="banner" data-name="' + banners[i]["Title"] + '" onclick="_czc.push([\'_trackEvent\',\'banner\',\'click\',\'' + banners[i]["Title"] + '\', \'\', \'\']);"><img src="' + banners[i]["BannerUrl"] + '" alt="' + banners[i]["title"] + '"></a></div>';

  });
  $(container + " .swiper-wrapper").html(imgs);
  // 初始化图片轮播
  if (banners.length > 1) {
    var mySwiper = new Swiper(container + " .swiper-container", {
      autoplay: 2000, //可选选项，自动滑动
      loop: true, //可选选项，开启循环
      autoplayDisableOnInteraction: false
    });
  }
}
/*日期是否是今天*/
function isTodayToDot(date) {
  var d = new Date(),
    nowYear = d.getFullYear(),
    nowMonth = d.getMonth(),
    nowDay = d.getDate();
  date = new Date(date);
  var y = date.getFullYear(),
    m = date.getMonth(),
    da = date.getDate();
  return (nowYear == y && nowMonth == m && nowDay == da);
}

/*2018-12-04*/
/*获取用户信息*/
function getUserInfo(callback) {
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
      postDid(data.InviteCode)
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
              getUserInfo();
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
  var token = "5c6d6c0007b62d6a",
    objectId = "8aaa4a9697d6991e9dd62397";
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
    did = window.App.getuuid();
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