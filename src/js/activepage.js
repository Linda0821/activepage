var num = 0;
var isShareClick = false ;//是否登录标记

/*获取window.App.getObjectId*/
var objId = '';
try {
  objId = window.App.getObjectId();
} catch (e) {
  debug_print("201:\r\n" + e);
}
window.onload = function () {
  debug_print("activePage 20190501 come in!!!");
  init();
};
function init(){
  /*判断是否登陆了*/
  try {
    var isLoggedIn = window.App.getUserStatus();

    if (isLoggedIn == 0) {
      debug_print("apprenticeActive20190501 isLoggedIn ok");
      localStorage.setItem('hasLogout', false);
      checkUid(objId, function(ischeck, data){
        isShareClick = true;
        pageClickFn(objId,ischeck,data);
      });
    } else if (isLoggedIn == -1) {
      pageClickFn(objId, false, null);
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
      //objId = '56794f1bad30a7ad85bb12fc';
      objId = 'd9fb4fbaa4b9ce1852ef8a2c';
      checkUid(objId, function(ischeck, data){
        pageClickFn(objId,ischeck,data);
      });
    }
    /**/
  }
}
function pageClickFn(objectId, isLogin, data){
  var money =  data && data.User && data.User.money ? data.User.money : 0 ;
  $(".btn1").unbind('click').click(function () {
    _czc.push(['_trackEvent', '五一活动', 'click', '如何赚取劳动勋章', '', '']);
    window.location.href = 'rule.html';
  })
  $(".btn2").unbind('click').click(function () {
    _czc.push(['_trackEvent', '五一活动', 'click', '可快速提现', '', '']);
    if (isLogin == true) {
      popUpCashText(objectId, money);
    } else {
      getToLogin()
    }
  })
  $(".btn3").unbind('click').click(function () {
    _czc.push(['_trackEvent', '五一活动', 'click', '赚取金勋章', '', '']);
    if (isLogin == true) {
      window.location.href = 'http://browser.umeweb.com/v6/ume/active/20180621/index.html';
    } else {
      getToLogin();
    }
  })
  $(".btn4").unbind('click').click(function () {
    _czc.push(['_trackEvent', '五一活动', 'click', '玩游戏领勋章', '', '']);
    if (isLogin == true) {
      window.location.href = 'game.html';
    } else {
      getToLogin()
    }
  })
  $(".num-1").unbind('click').click(function () {
    if (isLogin == true) {
      popUpExchange(objectId, data);
    } else {
      getToLogin()
    }
  })
  $(".num-2").unbind('click').click(function () {
    if (isLogin == true) {
      popUpExchange(objectId, data);
    } else {
      getToLogin()
    }
  })


}
/*验证objected id*/
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
     // debug_print("sucess objectId:" + objectId +" ====" +data.User.gold_medal+" ===="+data.User.glory_medal );
      if(data.Code == 0){
        $(".btn2 span").text(data.User.money);
        $(".gold-medal-num").text(data.User.gold_medal);
        $(".glory-medal-num").text(data.User.glory_medal);
        callback(true, data, objectId);
      } else {
        callback(true, null, objectId);
      }
    },
    error: function(xhr, type) {
      debug_print(type);
      callback(false, null, objectId);
    }
  });
}
function popUpCashText(objectId, money){
  /*money = 100*/ //测试
  var txt='', h='5.66667';
  if( money > 0 ){
    var d = new Date();
    var p = new Date("2019-05-24 23:59:59");
    //var p = new Date("2019-04-24 23:59:59");
    if(d<p){
      txt='您好，可快速提现金额的提现时间为5月25日 0:00-5月31日 23:59开通，请于规定时间内进行快速提现哦';
      h= '7.11111';
      popFn(txt, h);
    } else{
      popUpCashSure(objectId, money)
    }
  } else {
    txt='您还没有可快速提现的金额，赶紧去赚勋章兑换现金吧';
    h= '5.66667';
    popFn(txt, h);
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
function popUpExchange(objectId, data){
  var optonHtml = '';
  var goldNum = data && data.User && data.User.gold_medal?data.User.gold_medal:0;
  var gloryNum = data && data.User && data.User.glory_medal?data.User.glory_medal:0;
  var arr = ['10枚光荣勋章','18枚光荣勋章','25枚光荣勋章','31枚光荣勋章', '5枚金勋章' , '8枚金勋章', '15枚金勋章', '30枚金勋章',
    '50枚金勋章','100枚金勋章'];
  var arrNum = [10, 18, 25, 31, 5 , 8, 15, 30, 50, 100];
  var arrType = [0,0,0,0,1,1,1,1,1,1];//1金勋章和0光荣勋章
  var arr1 = [0.5, 1 , 1.5, 2, 2, 4, 9, 21, 40, 88.8];
  for(var i = 0; i<arr.length; i++){
    if(arrType[i] === arrType[0]){
      optonHtml+='<option data-val="'+arrNum[i]+'">'+arrNum[i]+'枚光荣勋章</option>'
    } else {
      optonHtml+='<option data-val="'+arrNum[i]+'">'+arrNum[i]+'枚金勋章</option>'
    }
  }
  var t= '<p class="num"><i class="gold-medal-num" ></i> '
    +'金勋章: <span>'+goldNum+'</span>枚 </p><p class="num">'
    + '<i class="glory-medal-num"></i>光荣勋章: <span>'+gloryNum+'</span>枚</p>'
  var html = t+'<select  name="shengfen" data-type="'+arrType[0]+'"  data-num="'+arrNum[0]+'" id="myselect">'+optonHtml
    +'</select><p class="moon-money"><span>'+arr1[0]+'</span>现金</p>'
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
    var num = $("#myselect").attr("data-num");
    var type = $("#myselect").attr("data-type");
    deletePop();
    postMedal(objectId,parseInt(num),type);
  });
  $("#myselect").change(function(){
    var a = $("#myselect").val();
    console.info(a);
    if(arr.indexOf(a) >= 0){
      var o = arr.indexOf(a);
      $(".moon-money").html("<span>"+arr1[o]+"元</span>现金");
      $("#myselect").attr("data-type",arrType[o]).attr("data-num", arrNum[o]);
    }
  });
}

//兑换零钱
function postMedal(objectId, num ,type) {
  var url = "http://browser.umeweb.com/cn_ume_api/wy/api/exchange";
  debug_print(objectId + "  num：  " + num + "  type：  " + type);
  var data = {
    uid: objectId,
    medalType: parseInt(type),
    medal: num
  };
  postJSON(url, data).catch(function(error) {
    debug_print("error: " + JSON.stringify(error));
  }).then(function(value) {
    debug_print("postMoonVote value: " + JSON.stringify(value));
    var html ='';
    switch(value.Code){
      case 0:html = '<div class="notice1">兑换成功!</div>';break;
      case "E001":html = '<div class="notice1" data-d="uid">参数出错，稍后再试</div>';break;
      case "E002":html = '<div class="notice1" data-d="medalType medal">参数出错，稍后再试</div>';break;
      case "E003":html = '<div class="notice1" data-d="Cookie">参数出错，稍后再试</div>';break;
      case "E004":html = '<div class="notice1" data-d="Cookie">参数出错，稍后再试</div>';break;
      case "E005":html = '<div class="notice1">兑换零钱失败</div>';break;
      default:html = '<div class="notice1">兑换零钱失败</div>';break;
    }
    popup.open({
      width: 10.44444, //设置弹出层宽度，如果不填写为300
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
    checkUid(objId, function(ischeck, data){
      pageClickFn(objId,ischeck,data);
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
function popUpCashSure(objectId, money){
  var html = '<ul id="pop_form">'
    +'<li><span>支付宝账户</span><input placeholder=" 请输入支付宝账号" type="text" name="phone" /></li>'
    +'<li><span>确认账户 </span><input type="text" placeholder=" 请确认支付宝账号" name="phone_o" /></li>'
    +'<li><span>真实姓名</span><input placeholder=" 请输入支付宝认证姓名" type="text" maxlength="50" name="name" /></li>'
    +'<li><span>确认姓名 </span><input placeholder=" 请确认支付宝认证姓名" type="text" maxlength="50" name="name_s" /> </li></ul>'
    +'<div class="notice"><span style="font-weight:600;">如未开通支付宝账户：</span>'
    +'<br>1.在上方【输入支付宝账号栏】输入你的手机号并提交。'
    +'<br>2.添加微米官方公众号：weimiliulanqi   并回复邀请码领取提现红包</div>'
    +'<button id="btn_c" type="button">取消</button>'
    +'<button id="btn_s" type="submit">提交</button>';

  popup.open({
    width: 14.44444, //设置弹出层宽度，如果不填写为300
    height: 16.44444, //设置弹出层高度，如果不填写为150
    title: "请输入支付宝账户领取红包", //设置标题
    content: html //设置内容
  });
  $(".popUp_c").attr('id','cash_popup');
  $("#popUp h2").css({
    "height":"2.22222rem",
    "line-height":"2.22222rem",
    "color": "#5A3A20",
    "background": "#FBDA9F",
    "font-size":".88889rem"
  });
  $(".notice").css({
    "text-align":"left",
    "font-size": ".53333rem",
    "color":"#787878",
    "padding": "0 .6667rem 0.88889rem 0.6667rem",
    "line-height": ".8rem"
  });
  $("#cancelBtn").show().css({
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });
  $("#btn_c").click(function() {
    deletePop();
  });
  $("#btn_s").click(function() {
    var phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    var obj_i = $("#pop_form li input");
    var phone_input1 = obj_i.eq(0).val(),
      phone_input2 = obj_i.eq(1).val(),
      name_input1 = obj_i.eq(2).val(),
      name_input2 = obj_i.eq(3).val();
    deletePop();
    if (phone_input1 == null || phone_input1 == "") {
      html0 ='账号不能为空';
      popUpDescription(html0);
    } else if (phone_input1 != phone_input2) {
      var html1 ='你两次输入的账号不同，';
      var html2 = '请再次确认后提交。';
      popUpDescription(html1,html2);
    } else if (name_input1 === null || name_input1 === "") {
      popUpDescription('认证姓名不能为空');
    } else if (name_input1 !== name_input2) {
      popUpDescription('你两次输入的认证姓名不同，', '请再次确认后提交。');
    } else if (phoneReg.test(phone_input1) || emailReg.test(phone_input1)) {
      console.info(objectId);
      var url = "http://browser.umeweb.com/cn_ume_api/wy/api/transfer_apply";
      var data = {
        uid: objectId,
        phone: phone_input1,
        payeeRealName: name_input1,
        money: money,
      };
      postJSON(url, data).catch(function(error) {
        debug_print("transfer_apply error: " + JSON.stringify(error));
      }).then(function(value) {
        debug_print("transfer_apply value: " + JSON.stringify(value));
        if (value.Code == 0) {
          popUpDescription('提现成功！');
        } else if(value.Code == "E005"){
          popUpDescription('提现失败！');
        } else {
          popUpDescription( value.Code);
        }
      });
    } else {
      html0 ='请输入正确的账号!';
      popUpDescription(html0);
    }
  })
}
function popUpDescription(html1,html2){
  var text ='';
  if(html2){
    text = '<div class="notice_content">'+html1+'</br>'+html2+'</div>';
    popup.open({
      width: 12.33333,
      height:6.33333,
      title: "",
      content: text
    });
  } else{
    text = '<div class="notice_content">'+html1+'</div>';
    popup.open({
      width: 12.33333,
      height:5,
      title: "",
      content: text
    });
  }
  $("#popUp").css({
    "min-height":"4rem"
  });
  $("#submitBtn").html("确认").css({
    "font-size": "0.71111rem",
    "width": "100%",
    "height": "1.8rem",
    "line-height": "1.8rem"
  });
  $("#cancelBtn").show().css({
    "background": "url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat",
    "background-size": "1.1111rem 1.1111rem",
    "position": " absolute",
    "top": "-1.42222rem",
    "right": "0rem"
  });;
  $(".notice_content").css({
    "font-size": "0.66667rem",
    "padding": " 0.88889rem 0.6667rem",
    "border-bottom": "0.04444rem solid #DADCDD",
    "line-height": "1.33333rem"
  });
}
function onRefreshPage() {
  debug_print("20190501-activePage shuaxin onRefreshPage()");
  if(isShareClick) return;
  try {
    var isLoggedIn = window.App.getUserStatus();
    if (isLoggedIn == 0) {
      debug_print("shuaxin true");
      checkUid(objId, function(ischeck, data){
        pageClickFn(objId,ischeck,data);
      });
    } else if (isLoggedIn == -1) {
      debug_print("shuaxin false");
    }
  } catch (e) {
    debug_print("shuaxin isLoggedIn: " + e);
  }
}