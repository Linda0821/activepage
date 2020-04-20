
$(function () {
  try{
    var objectId = window.App.getObjectId();
    checkUid(objectId);
  } catch(e){
    debug_print(e);
    getWaterRecording("5e0ee2c90f7b5e71934fa84c")
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
      if(data.Code === '0'){
        debug_print("getWaterRecording: " + JSON.stringify(data.logs));
        renderWaterRecording(data)
      }
    },
    error: function(xhr, type) {
      debug_print(type);
    }
  });
}

function renderWaterRecording(data){
  var html = '';
  for(var i=0;i<data.logs.length; i++){
    var text = '';
    debug_print("data.logs.event: "+data.logs[i].event);
    switch(parseInt(data.logs[i].event)){
      case 1: text = data.logs[i].time+' 通过登录获得'+data.logs[i].reward+'g水滴';debug_print("data.logs.event: "+text); break;
      case 2: text = data.logs[i].time+' 通过签到获得'+data.logs[i].reward+'g水滴'; break;
      case 3: text = data.logs[i].time+' 通过首次阅读获得'+data.logs[i].reward+'g水滴'; break;
      case 4: text = data.logs[i].time+' 通过邀请好友获得'+data.logs[i].reward+'g水滴'; break;
      case 5: text = data.logs[i].time+' 通过周年庆抽奖活动获得'+data.logs[i].reward+'g水滴'; break;
      case 6: text = data.logs[i].time+' 通过周年庆抽奖活动获得'+data.logs[i].reward+'g水滴'; break;
      case 99: text = data.logs[i].time+' 收获了'+data.logs[i].reward+'金币'; break;
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