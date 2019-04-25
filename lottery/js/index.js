var lottery={
  index:-1,    //当前转动到哪个位置，起点位置
  count:0,    //总共有多少个位置
  timer:0,    //setTimeout的ID，用clearTimeout清除
  speed:20,    //初始转动速度
  times:0,    //转动次数
  cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize:-1,    //中奖位置
  init:function(id){
    if ($("#"+id).find(".lottery-unit").length>0) {
      $lottery = $("#"+id);
      $units = $lottery.find(".lottery-unit");
      this.obj = $lottery;
      this.count = $units.length;
      $lottery.find(".lottery-unit-"+this.index).addClass("active");
    };
  },
  roll:function(){
    var index = this.index;
    var count = this.count;
    var lottery = this.obj;
    $(lottery).find(".lottery-unit-"+index).removeClass("active");
    index += 1;
    if (index>count-1) {
      index = 0;
    };
    $(lottery).find(".lottery-unit-"+index).addClass("active");
    this.index=index;
    return false;
  },
  stop:function(index){
    this.prize=index;
    return false;
  }
};

function roll(){
  lottery.times += 1;
  lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
  if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
    clearTimeout(lottery.timer);
    lottery.prize=-1;
    lottery.times=0;
    click=false;
    //抽奖次数
    playNum--;
    $(".start span").text(playNum);
  }else{
    if (lottery.times<lottery.cycle) {
      lottery.speed -= 10;
    }else if(lottery.times==lottery.cycle) {
      //var index = Math.random()*(lottery.count)|0;//中奖物品通过一个随机数生成
      var random = Math.random()*100;
      console.info(random)
      var index = parseInt(random)|0;//中奖物品通过一个随机数生成
      console.info(index)
      if(index === 0){
        lottery.prize = 7;
      } else if (index > 0 && index <= 5){
        lottery.prize = 5;
      } else {
        lottery.prize = 3;
      }
    } else {
      if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
        lottery.speed += 110;
      }else{
        lottery.speed += 20;
      }
    }
    if (lottery.speed<40) {
      lottery.speed=40;
    };
    //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
    lottery.timer = setTimeout(roll,lottery.speed);//循环调用
  }
  return false;
}

var click = false,
  playNum = 10;


window.onload=function(){
  lottery.init('lottery');
  if(playNum>0){
    $(".start span").text(playNum);
    $("#lottery a").click(function(){
      if (click||playNum<=0) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
        return false;
      }else{
        lottery.speed=100;
        roll();    //转圈过程不响应click事件，会将click置为false
        click=true; //一次抽奖完成后，设置click为true，可继续抽奖
        return false;
      }
    });
  }

};
/**
 * 1.判断是否登录
 * 2.未登录 点击跳转新老用户都跳转登录
 * 3.登录了获取到信息，判断是新用户还是老用户
 * 4.新用户,活动期间收徒数+1-接口游戏数；提示，您已经登录，可以抽奖了
 * 5.老用户，活动期间收徒数-接口游戏数 可以跳转收徒页面
 * */
function linkfn(odd){
  console.info(odd)
}