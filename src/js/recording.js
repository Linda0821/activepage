
$(function () {
  try{
    var objectId = window.App.getObjectId();
    checkUid(objectId);
  } catch(e){
    debug_print(e);
    getWaterRecording("5e0eadd40f7b5e71934fa849") // //5e0ee2c90f7b5e71934fa84c
  }

});
function getWaterRecording(objectId) {
  $.ajax({
    type: 'POST',
    url: "http://browser.umeweb.com/ume_user_service/api/v1/active/estate/recording",
    dataType: 'json',
    data:{
      "uid": objectId,
      "offset":0,
      "limit":100
    },
    success: function(data) {
      debug_print("getWaterRecording: " + JSON.stringify(data));
      if(data.success == true){
        debug_print("getWaterRecording: " + JSON.stringify(data.logs));
        renderWaterRecording(data.logs)
      } else {
        $(".no-data").show();
      }
    },
    error: function(xhr, type) {
      debug_print(type);
    }
  });
}

function renderWaterRecording(data){
  var html = '';
  debug_print("data.logs.event: "+data[0].eventId);
  for(var i=0;i<data.length; i++){
    var text = '';
    debug_print("data.logs.event: "+data[i].eventId);
    switch(parseInt(data[i].eventId)){
      case 0: text = getLocalTime(data[i].time)+' 收获了'+data[i].reward+'金币'; break;
      case 1: text = getLocalTime(data[i].time)+' 通过登录获得'+data[i].reward+'g水滴';debug_print("data.logs.event: "+text); break;
      case 2: text = getLocalTime(data[i].time)+' 通过签到获得'+data[i].reward+'g水滴'; break;
      case 3: text = getLocalTime(data[i].time)+' 通过阅读新闻获得'+data[i].reward+'g水滴'; break;
      case 4: text = getLocalTime(data[i].time)+' 通过连续登录3天获得'+data[i].reward+'g水滴'; break;
      case 5: text = getLocalTime(data[i].time)+' 通过周年庆抽奖活动获得'+data[i].reward+'g水滴'; break;
      case 6: text = getLocalTime(data[i].time)+' 通过周年庆抽奖活动获得'+data[i].reward+'g水滴'; break;
      default: break;
    }
    debug_print(text);
    html= html + '<li>' + parseInt(i+1) + ' ' + text + '</li>';
  }
  $(".re-list").html(html);
  if($(".re-list").children().length<=0) {
    $(".no-data").show();
  }
}
/*app 打印信息*/
window.debug_print = function(log) {
  try {
    window.App.logger(log);
  } catch (e) {
    console.log(log);
  }
}
function getLocalTime(nS) {
  //return new Date(parseInt(nS)).toLocaleString();
  //return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  var d = new Date(nS),
    y = d.getFullYear(),
    m = d.getMonth() + 1,
    day = d.getDate(),
    h = d.getHours(),
    mn = d.getMinutes(),
    s = d.getSeconds();

  day = day < 10 ? "0" + day : day;
  m = m < 10 ? "0" + m : m;
  h = h < 10 ? "0" + h : h;
  mn = mn < 10 ? "0" + mn : mn;
  s = s < 10 ? "0" + s : s;

  return y + "-" + m + "-" + day + " " + h + ":" + mn + ":" + s;
}