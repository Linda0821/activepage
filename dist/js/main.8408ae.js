!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="./",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),r=(n.n(i),n(2));n.n(r)},function(e,t){},function(e,t){function n(){try{var e=window.App.getUserStatus();0==e?(debug_print("正常"),setTimeout(function(){getUmeUserInfo(function(){r()})},20)):-1==e&&(debug_print("未登录"),i(!1))}catch(e){debug_print("isLoggedIn "+e),i(!0),$("#lottery a").click(function(){if(_czc.push(["_trackEvent","端午活动","click","我要抽奖","",""]),u||a<=0)return!1;b.speed=100,b.start(),u=!0})}}function i(e){$("#shareBtn").click(function(){_czc.push(["_trackEvent","端午活动","click","分享好友","",""]),e?(debug_print("shareBtn click!"),window.location.href="http://browser.umeweb.com/v6/ume/active/20180621/index.html"):getToLogin()}),$("#registerBtn").click(function(){_czc.push(["_trackEvent","端午活动","click","吃粽子领金币","",""]),e?(debug_print("registerBtn click!"),window.location.href="http://browser.umeweb.com/v6/ume/wealth.html"):getToLogin()})}function r(){UMeUser.getUMeUser().then(function(e){if(debug_print("user: "+JSON.stringify(e)),null!=e){d=e.objectId();var t=e.properties._CreationTime;t=new Date(t),debug_print("umeuser _CreationTime:"+t),share(".part-2",e.InviteCode);var n=0,r=[],c=[];e.getNewbiesApprentics(m,h,100,0).then(function(s){if(debug_print("getNewbiesApprentics"+JSON.stringify(s)),s.length>0){for(var p=0;p<s.length;p++)r[p]=s[p].ApprenticeObjectId;debug_print("NewbiesApprenticsIdArr: "+r);var u=DroiBaaS.DroiCondition.gtOrEq("Coin",200),a={Coin:!1};e.queryApprenticeList(u,200,0,a).then(function(e){if(debug_print("  getApprenticeWithEnoughTribute"+JSON.stringify(e)),e.length>0){for(var p=0;p<e.length;p++)c[p]=e[p].ApprenticeObjectId;debug_print("ActiveApprenticsIdArr: "+c);for(var p=0;p<s.length;p++)c.indexOf(r[p])>=0&&(n+=1,debug_print("canPlayNum:"+n+"  第"+parseInt(p+1)+"个新徒弟；"));o(d,n,t),i(t)}else debug_print("Apprs null!!")}).catch(function(e){debug_print("03:"+e)})}else debug_print("newAppr is null!!"),o(d,n,t),i(t)}).catch(function(e){debug_print("02"+e)})}}).catch(function(e){debug_print("user error: "+e)})}function o(e,t,n){$.ajax({type:"GET",url:"http://browser.umeweb.com/cn_ume_api/newyear/api/check/"+e,dataType:"json",cache:!1,xhrFields:{withCredentials:!0},success:function(i){debug_print("sucess:"+JSON.stringify(i)),debug_print("sucess objectId:"+e),c(e,t,n)},error:function(e,t){debug_print(t)}})}function c(e,t,n){$.ajax({type:"GET",url:"http://browser.umeweb.com/cn_ume_api/newyear/api/times/"+e,cache:!1,dataType:"json",xhrFields:{withCredentials:!0},success:function(e){0==e.Code?(l=e.playtimes,debug_print("playNum :"+l),a=n>=g?t+1-l:t-l,a=a>0?a:0):a=0,$(".start span").text(a),$("#lottery a").click(function(){return _czc.push(["_trackEvent","双蛋活动","click","我要抽奖","",""]),!(u||a<=0)&&(b.speed=100,roll(),u=!0,!1)})},error:function(e,t){console.info(t)}})}function s(e){var t=parseInt(e);a--,$(".start span").text(a),p(f[t])}function p(e){debug_print("抽奖结果："+e);var t='<div class="notice"><p class="coin"><span style="font-size: 1.6rem">'+e+'</span>金币</p><p>金币将于1天内存入你的微米账户</p></div> <button class="btn_ck">去查看</button>';popup.open({width:13.44444,height:8.16667,title:"恭喜你！抢到",content:t}),$(".popUp_c").attr("id","pop_game"),$("#cancelBtn").show().css({width:"1.1111rem",height:"1.1111rem",background:"url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat","background-size":"1.1111rem 1.1111rem",position:" absolute",top:"-1.42222rem",right:"0rem"}),$("#pop_game").css({"background-color":"#FFE1BE"}),$("#pop_game h2").css({height:"2.4rem","line-height":"2.4rem",color:"#c8831f","font-weight":"normal","font-size":".93333rem"}),$("#pop_game .notice").css({margin:"0 .22222rem .66667rem .22222rem","text-align":"left","font-size":".6rem",color:"#c8831f"}),$("#pop_game .notice .coin").css({color:"#E2311E"}),$("#pop_game p").css({"font-size":".66667rem","text-align":"center"}),$("#pop_game button").css({"font-size":".66667rem","text-align":"center",border:"none",color:"#c8831f","background-color":"transparent","text-decoration":"underline"}),$("#pop_game button").click(function(){window.location.href="http://browser.umeweb.com/v6/ume/wealth.html"})}var u=!1,a=10,l=0,d="",f={6:300,4:888,1:5e3},g=new Date("2018-12-21 00:00:00"),m=new Date("2018-12-21 00:00:00").getTime(),h=new Date("2019-03-15 23:59:59").getTime(),b={index:-1,count:0,timer:0,speed:100,times:0,cycle:50,prize:-1,init:function(e){$("#"+e).find(".lottery-unit").length>0&&($lottery=$("#"+e),$units=$lottery.find(".lottery-unit"),this.obj=$lottery,this.count=$units.length,$lottery.find(".lottery-unit-"+this.index).addClass("active"),$lottery.find(".start span").text(a))},roll:function(){var e=this.index,t=this.count,n=this.obj;return $(n).find(".lottery-unit-"+e).removeClass("active"),e+=1,e>t-1&&(e=0),$(n).find(".lottery-unit-"+e).addClass("active"),this.index=e,!1},start:function(){var e=b;if(e.times+=1,e.roll(),e.times>e.cycle+10&&e.prize==e.index)clearTimeout(e.timer),s(e.prize),e.prize=-1,e.times=0,u=!1;else{if(e.times<e.cycle)e.speed-=10;else if(e.times==e.cycle){var t=100*Math.random(),n=0|parseInt(t);debug_print("random: "+t+" index: "+n),e.prize=0===n?1:n>0&&n<=5?4:6}else e.times>e.cycle+10&&(0==e.prize&&7==e.index||e.prize==e.index+1)?e.speed+=110:e.speed+=20;e.speed<40&&(e.speed=40),e.timer=setTimeout(e.start,e.speed)}return!1},stop:function(e){return this.prize=e,!1}};window.onload=function(){b.init("lottery"),n()},$(window).scroll(function(){$(window).scrollTop()<40?$("section.btn").show():$("section.btn").hide()})}]);