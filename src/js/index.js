var clickstate = 0;
var continueNum = 0;
import arrUrl_1 from '../img/jieguo/1.png'
import arrUrl_2 from '../img/jieguo/2.png'
import arrUrl_3 from '../img/jieguo/3.png'
import arrUrl_4 from '../img/jieguo/4.png'

var arrUrl = ['', arrUrl_1, arrUrl_2, arrUrl_3, arrUrl_4];

var turn = function (target, time, opts, objectId, arr) {
  target.find('a').unbind('click').click(function () {
    if (clickstate == 1 || continueNum <= 0) {
      return;
    }
    var current = $(this);
    var prize = setPrizeIdx(arr);
    console.info('id:' + current.attr('id') + ' prize:' + prize);
    var preSrc = current.find('.info').attr('src');
    current.find('.info').attr('src', arrUrl[prize]);
    $('#a' + prize + ' .info').attr('src', preSrc);
    current.find('.img').stop().animate(opts[0], time, function () {
      $(this).hide().next().show();
      $(this).next().animate(opts[1], time);
      setTimeout(function () {
        current.siblings('a').find('.info').addClass('shelter');
        current.siblings('a').find('.img').stop().animate(opts[0], time, function () {
          $(this).hide().next().show();
          $(this).next().animate(opts[1], time);
        });
        continueNum = continueNum - 1;
        $("#gameNum span").html(continueNum);
      }, 600);
      clickstate = 1;
      setTimeout(function () {
        postCoin(objectId, prize);
      }, 2000);
    });
  });
}

function setPrizeIdx(arr) {
  var prize = 4;
  if (arr.length > 1) {
    var random = Math.random() * 100;
    var index = parseInt(random) | 0;//中奖物品通过一个随机数生成
    console.info("random: " + random + " index: " + index);
    if (index === 0 || index === 1) {
      prize = arr.indexOf(1) < 0 ? 4 : 1;
    } else if (index > 1 && index < 42) {
      prize = 2;
    } else if (index > 41 && index < 77) {
      prize = arr.indexOf(1) < 0 ? 4 : 3;
    } else {
      prize = 4;
    }
  }
  return prize;
}

$(function () {
  initLoggedIn();
})

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
      $('#draw').find('a').unbind('click').click(function () {
        try {
          window.App.login();
        } catch (e) {
          debug_print("window.App.login()" + e);
        }
      })
    }
  } catch (e) {
    debug_print("isLoggedIn " + e);
    loginInFn();
  }
}

function loginInFn() {
  /*获取抽奖信息*/
  try {
    var objectId = window.App.getObjectId();
  } catch (e) {
    debug_print("getUmeUserInfo 101: " + e);
    var objectId = "74f14d5d8c12d3fa7e999e66";
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
    type: 'GET',
    url: "http://browser.umeweb.com/cn_ume_api/anniv/api/check/card/" + objectId,
    dataType: 'json',
    cache: false,
    xhrFields: {
      withCredentials: true
    },
    success: function (data) {
      debug_print("sucess:" + JSON.stringify(data));
      debug_print("sucess objectId:" + objectId);
      if (data.Code == 0) {
        debug_print("sucess playNum :" + data.Result.card_balance);
        continueNum = data.Result.card_balance;//测试
        //continueNum = 3; //测试
        $("#gameNum span").html(continueNum);
        var verticalOpts = [{'width': 0}, {'width': '90%'}];
        turn($('#draw'), 400, verticalOpts, objectId, data.Result.card_prize);
      } else {
        busyPopup(data.Code);
      }
    },
    error: function (xhr, type) {
      debug_print(type);
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
function postCoin(objectId, prize) {
  var url = 'http://browser.umeweb.com/cn_ume_api/anniv/api/play/card/' + objectId + '/' + prize;
  debug_print(objectId + "  prize：  " + prize);
  var api = axios.create({
    withCredentials: true
  });
  api.post(url).then(function (response) {
    console.log(response);
    if (response.data.Code == 0) {
      sucessDialog(prize);
    } else {
      //sucessDialog(prize);
      busyPopup(response.data.Code);
    }
  }).catch(function (error) {
    console.log(error);
  });
}
function sucessDialog(prize){
  if (prize === 1) {
    $("#iosDialog1 .weui-dialog__bd").html('恭喜您获得了2元现金红包，<br>您可在我的财富—零钱查看。');
    $("#iosDialog1 .weui-dialog__btn_default").attr('href','http://browser.umeweb.com/v6/ume/wealth.html');
    $('#iosDialog1').show();
  } else if (prize === 2) {
    $("#iosDialog1 .weui-dialog__bd").html('恭喜您获得了300金币，<br>您可在我的财富—金币查看。');
    $("#iosDialog1 .weui-dialog__btn_default").attr('href','http://browser.umeweb.com/v6/ume/wealth.html');
    $('#iosDialog1').show();
  } else if (prize === 3) {
    $("#iosDialog1 .weui-dialog__bd").html('恭喜您获得大转盘抽奖一次，<br>快去抽奖吧！');
    $("#iosDialog1 .weui-dialog__btn_default").attr('href','../luckdraw/index.html');
    $('#iosDialog1').show();
  } else {
    $('#iosDialog2').show();
  }
}

function busyPopup(code) {
  var p = code ? code : '';
  var html = '亲，服务器繁忙（' + p + '），请过一会后再试？';
  $("#iosDialog3 .weui-dialog__bd").html(html);
  $('#iosDialog3').show();
}

window.ClosePage = function (odd) {
  $('#iosDialog' + odd).hide();
  $("#draw a .info").removeClass('shelter').hide().css({'width': '0'}).each(function () {
    $(this).attr('src', arrUrl[$(this).attr('data-i')]);
  });
  $("#draw a .img").show().stop().animate({'width': '90%'}, 400, function () {
    clickstate = 0;
  });
}
window.Refresh = function (odd) {
  $('#iosDialog' + odd).hide();
  $("#draw a .info").removeClass('shelter').hide().css({'width': '0'}).each(function () {
    $(this).attr('src', arrUrl[$(this).attr('data-i')]);
  });
  $("#draw a .img").show().stop().animate({'width': '90%'}, 400, function () {
    clickstate = 0;
  });
}
window.TurnMyCenter = function (odd) {
  $('#iosDialog' + odd).hide();
  $("#draw a .info").removeClass('shelter').hide().css({'width': '0'}).each(function () {
    $(this).attr('src', arrUrl[$(this).attr('data-i')]);
  });
  $("#draw a .img").show().stop().animate({'width': '90%'}, 400, function () {
    clickstate = 0;
  });
}
/*app 打印信息*/
window.debug_print = function (log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}

/*局部刷新*/
window.onRefreshPage = function () {
  debug_print("flopgame shuaxin onRefreshPage()");
  initLoggedIn();
}