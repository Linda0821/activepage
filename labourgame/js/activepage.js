var num = 0;
//var data_m = getMoonCouponList();
var isShareClick = false ;//是否登录标记

window.onload = function () {
  debug_print("activePage 20190501 come in!!!");
  pageClickFn('',true,100);
};
function init(){
  /*获取window.App.getObjectId*/
  var  objId ='';
  try {
    objId = window.App.getObjectId();
  } catch (e) {
    debug_print("201:\r\n" + e);
    objId = "56794f1bad30a7ad85bb12fc";
  }
  /*判断是否登陆了*/
  try {
    var isLoggedIn = window.App.getUserStatus();

    if (isLoggedIn == 0) {
      debug_print("apprenticeActive2 isLoggedIn ok");
      localStorage.setItem('hasLogout', false);
      checkUid(objId, function(ischeck,objectId){
        isShareClick = true;
        if (ischeck) {
          getMyMoonCouponList(objectId);
          pageClickFn(objId,true,100);
        }
      });
    } else if (isLoggedIn == -1) {
      pageClickFn(objId,false,0);
    }
  } catch (e) {
    debug_print("isLoggedIn error!!!");
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/QQ/i) == "qq") {
      console.info("weixin qq")
      $("body").click(function(){
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.ume.browser";
      })
    } else {
      pageClickFn(objId,true,100);
    }
    /*checkUid(objId, function(ischeck,objectId){
      if (ischeck) {
        getMyMoonCouponList(objectId);
        pageClickFn(objId,true,100);
      }
    });*/
  }
}
function pageClickFn(objectId,isLogin,money){
  $(".moon button").unbind('click').click(function(e){
    console.info($(this).attr("data-num"));
    num = $(this).attr("data-num");
    switch (parseInt(num)) {
      case 0 :
        _czc.push(['_trackEvent', '五一活动', 'click', '如何赚取劳动勋章', '', '']);
        window.location.href='rule.html';
        break;
      case 1 :
        _czc.push(['_trackEvent', '五一活动', 'click', '可快速提现', '', '']);
        popUpCash(objectId,isLogin,money)
        //
        break;
      case 2 :
        _czc.push(['_trackEvent', '五一活动', 'click', '赚取金勋章', '', '']);
        if (isLogin){
          window.location.href='http://browser.umeweb.com/v6/ume/active/20180621/index.html';
        } else{
          getToLogin()
        }
        break;
      case 3 :
        _czc.push(['_trackEvent', '五一活动', 'click', '玩游戏领勋章', '', '']);
        if (isLogin){
          window.location.href='game.html';
        } else{
          getToLogin()
        }
        break;
      default:
        console.info("default");
        break;
    }
  });
  $(".num-1").unbind('click').click(function(){
    popUpExchange(objectId);
  })
  $(".num-2").unbind('click').click(function(){
    popUpExchange(objectId);
  })

}
/*验证objected id*/
function checkUid(objectId, callback) {

  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/zq/api/check/" + objectId,
    dataType: 'json',
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      debug_print("sucess:" + JSON.stringify(data));
      debug_print("sucess objectId:" + objectId);
      //data_m = getMoonList(objectId);
      console.info(data_m);
      callback(true, objectId);

    },
    error: function(xhr, type) {
      debug_print(type);
      callback(false, objectId);
    }
  });
}
//获取月饼券
function getMoonCouponList() {
  var obj = {};
  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/zq/api/items",
    async:false,
    /*cache: false,
    xhrFields: {
        withCredentials: true
    },*/
    dataType: 'json',
    success: function(data) {
      debug_print("getMoonList: " + JSON.stringify(data));
      obj =  data ;
    },
    error: function(xhr, type) {
      debug_print("getCountryList error:" + type);
    }
  });
  return obj;

}
function getMyMoonCouponList(objectId) {
  $.ajax({
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/zq/api/coupons/" + objectId,
    cache: false,
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if (data.Code == 0) {
        debug_print("data.my_total_coupons: " + data.my_total_coupons);
        $(".moon-appr-num span").text(data.my_total_coupons+" 张");
      }
    },
    error: function(xhr, type) {
      console.info(type);
    }
  });
}
function popUpCash(objectId){
  var txt='', h='5.66667',money=100;
  if(money==0){
    txt='您还没有可快速提现的金额，赶紧去赚勋章兑换现金吧';
    h= '5.66667';
    popFn(txt, h);
  } else{
    var d = new Date();
    var p = new Date("2019-05-24 23:59:59");
    if(d<p){
      txt='您好，可快速提现金额的提现时间为5月25日 0:00-5月31日 23:59开通，请于规定时间内进行快速提现哦';
      h= '7.11111';
      popFn(txt, h);
    } else{

    }
  }
  function popFn() {
    var html = '<div class="notice">'
      + txt+'</div>'
    popup.open({
      width: 11.22222, //设置弹出层宽度，如果不填写为300
      height: h, //设置弹出层高度，如果不填写为150
      title: "", //设置标题
      content: html //设置内容
    });
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
      "text-align":"left",
      "font-size": ".58889rem",
      "color":"#e7cea8",
      "padding": "0 .84444rem 0.88889rem",
      "line-height": "1rem"
    });
  }
}
function popUpExchange(objectId){
  var optonHtml = '';
  var arr = ['15枚光荣勋章', '15枚金勋章' , '30枚光荣勋章', '40枚金勋章','125枚金勋章'];
  var arr1 = ['1', '10' , '2', '30','100','125'];
  for(var i = 0;i<arr.length;i++){
    optonHtml+='<option data-val="'+arr1[i]+'">'+arr[i]+'</option>'
  }
  var t= '<p class="num"><i class="gold-medal-num" ></i> '
    +'金勋章: <span>12</span>枚 </p><p class="num">'
    + '<i class="glory-medal-num"></i>光荣勋章:<span>12</span>枚</p>'
  var html = t+'<select  name="shengfen" id="myselect">'+optonHtml
    +'</select><p class="moon-money"><span>1元</span>现金</p>'
    +'<button id="btn_s" type="submit"></button>'
    +'<div class="notice">兑换后金额直接到您的“可立即提现金额”的余额，于25-31日期间可操作提现 </div>'

  popup.open({
    width: 12.44444, //设置弹出层宽度，如果不填写为300
    height: 13.46667, //设置弹出层高度，如果不填写为150
    title: "", //设置标题
    content: html //设置内容
  });
  $("#popUp").css({
    "margin-top": "-8rem"
  })
  $(".popUp_c").attr('id','exchange_popup').css({
    "background-color":"#be2a2a",
    "boeder-radius":'.8rem'
  });
  $(".popUp_c h2").css({
    "height":".6rem"
  });
  $(".popUp_cont").css({
    "padding-top": ".66667rem",
    "font-size": ".66667rem"
  })
  $(".notice").css({
    "text-align":"left",
    "font-size": ".58889rem",
    "color":"#e7cea8",
    "padding": "2.44444rem .84444rem 0.88889rem",
    "line-height": ".8rem"
  });
  $("#cancelBtn").hide()

  $("#btn_s").click(function() {
    var a = $("#myselect").val();
    deletePop();
    postMoonCoupon(objectId,parseInt(a));
  });
  $("#myselect").change(function(){
    var a = $("#myselect").val();
    console.info(a);
    switch(a){
      case arr[0]:$(".moon-money").html("<span>"+arr1[0]+"元</span>现金"); break;
      case arr[1]:$(".moon-money").html("<span>"+arr1[1]+"元</span>现金");break;
      case arr[2]:$(".moon-money").html("<span>"+arr1[2]+"元</span>现金");break;
      case arr[3]:$(".moon-money").html("<span>"+arr1[3]+"元</span>现金");break;
      case arr[4]:$(".moon-money").html("<span>"+arr1[4]+"元</span>现金");break;
      default:$(".moon-money").html("<span>"+arr1[0]+"元</span>现金");break;
    }
  });
}

//投票
/*E001：uid错误
E002：月饼券参数错误
E003：cookie不存在
E004：认证失败
E005：月饼券余额不足
E006：兑换的零钱或礼包不存在
E007：月饼券兑换处理失败*/
function postMoonCoupon(objectId, coupon) {
  var url = "http://browser.umeweb.com/cn_ume_api/zq/api/coupon/exchange";
  debug_print(objectId + "  coupon：  " + coupon);
  var data = {
    uid: objectId,
    coupon: coupon
  };
  postJSON(url, data).catch(function(error) {
    debug_print("error: " + JSON.stringify(error));
  }).then(function(value) {
    debug_print("postMoonVote value: " + JSON.stringify(value));
    var html ='';
    switch(value.Code){
      case 0:html = '<div class="notice1">兑换成功!</div>';break;
      case "E001":html = '<div class="notice1">参数出错，稍后再试</div>';break;
      case "E002":html = '<div class="notice1">参数出错，稍后再试</div>';break;
      case "E003":html = '<div class="notice1">参数出错，稍后再试</div>';break;
      case "E004":html = '<div class="notice1">网络异常!</div>';break;
      case "E005":html = '<div class="notice1">月饼券还不够，赶紧去赚~</div>';break;
      case "E006":html = '<div class="notice2">兑换的商品库存不足，请选其他商品兑换</div>';break;
      case "E007":html = '<div class="notice1">月饼券兑换处理失败</div>';break;
      default:html = '<div class="notice1">月饼券兑换处理失败</div>';break;
    }
    popup.open({
      width: 14.44444, //设置弹出层宽度，如果不填写为300
      height: 4.3333, //设置弹出层高度，如果不填写为150
      title: "", //设置标题
      content: html //设置内容
    });
    $(".notice1").css({
      "text-align":"ceter",
      "font-size": ".88889rem",
      "color":"#787878",
      "padding": ".44444rem 0.6667rem",
      "padding-top":"1.2rem",
      "line-height": "1.2rem"
    });
    $(".notice2").css({
      "text-align":"left",
      "font-size": ".88889rem",
      "color":"#787878",
      "padding": ".44444rem 0.6667rem",
      "padding-top":".8rem",
      "line-height": "1.2rem"
    });
    $("#cancelBtn").hide();
    $("#submitBtn").html("确认").css({
      "text-align":"center",
      "font-size": ".88889rem",
      "color":"#787878",
      "line-height": "1.2rem"
    });
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
function onRefreshPage() {
  debug_print("20190501-activePage shuaxin onRefreshPage()");
  if(isShareClick) return;
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("shuaxin true");
      checkUid(objId, function(ischeck,objectId){
        if (ischeck) {
          getMyMoonCouponList(objectId);
          pageClickFn(objId,true,100);
        }
      });
    } else if (isLoggedIn == -1) {
      debug_print("shuaxin false");
    }
  } catch (e) {
    debug_print("shuaxin isLoggedIn: " + e);
  }
}