!function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),o=(n.n(i),n(2));n.n(o)},function(e,t){},function(e,t){function n(){if(f.times+=1,f.roll(),f.times>f.cycle+10&&f.prize==f.index)clearTimeout(f.timer),i(f.prize),f.prize=-1,f.times=0,h=!1;else{if(f.times<f.cycle)f.speed-=10;else if(f.times==f.cycle){var e=100*Math.random();console.info(e);var t=0|parseInt(e);console.info(t),f.prize=0===t?7:t>0&&t<=5?5:3}else f.times>f.cycle+10&&(0==f.prize&&7==f.index||f.prize==f.index+1)?f.speed+=110:f.speed+=20;f.speed<40&&(f.speed=40),f.timer=setTimeout(n,f.speed)}return!1}function i(e){var t=parseInt(e);g--,$(".start span").text(g),u(b,{3:300,5:888,7:2e3}[t])}function o(){try{var e=window.App.getUserStatus();0==e?(debug_print("正常"),setTimeout(function(){getUmeUserInfo(function(){r()})},20)):-1==e&&(debug_print("未登录"),c())}catch(e){debug_print("isLoggedIn "+e),setTimeout(function(){pcInitUmeUser(function(){r()})},20)}}function r(){UMeUser.getUMeUser().then(function(e){if(debug_print("user: "+JSON.stringify(e)),null!=e){b=e.objectId();var t=e.properties._CreationTime;t=new Date(t),debug_print("umeuser _CreationTime:"+t),share(".part-2",e.InviteCode);var n=0,i=[],o=[];e.getNewbiesApprentics(_,v,100,0).then(function(r){if(debug_print("getNewbiesApprentics"+JSON.stringify(r)),r.length>0){for(var p=0;p<r.length;p++)i[p]=r[p].ApprenticeObjectId;debug_print("NewbiesApprenticsIdArr: "+i);var u=DroiBaaS.DroiCondition.gtOrEq("Coin",200),a={Coin:!1};e.queryApprenticeList(u,200,0,a).then(function(e){if(debug_print("  getApprenticeWithEnoughTribute"+JSON.stringify(e)),e.length>0){for(var p=0;p<e.length;p++)o[p]=e[p].ApprenticeObjectId;debug_print("ActiveApprenticsIdArr: "+o);for(var p=0;p<r.length;p++)o.indexOf(i[p])>=0&&(n+=1,debug_print("canPlayNum:"+n+"  第"+parseInt(p+1)+"个新徒弟；"));s(b,n,t),c(t)}else debug_print("Apprs null!!")}).catch(function(e){debug_print("03:"+e)})}else debug_print("newAppr is null!!"),s(b,n,t),c(t)}).catch(function(e){debug_print("02"+e)})}}).catch(function(e){debug_print("user error: "+e)})}function c(e){$("#newFriend").click(function(){if(_czc.push(["_trackEvent","双蛋活动","click","新朋友，首次注册即可参与>>>","",""]),e)e>=w?(console.info("新朋友"),window.location.href="http://browser.umeweb.com/v6/ume/wealth.html"):debug_print("newFriend click!");else try{window.App.login()}catch(e){console.info("window.App.login()"+e)}}),$("#oldFriend").click(function(){if(_czc.push(["_trackEvent","双蛋活动","click","老朋友, 邀请一个朋友（进贡>200金币)=1次机会，这就去收徒>>>","",""]),e)e&&e<w?(console.info("老朋友"),window.location.href="http://browser.umeweb.com/v6/ume/active/20180621/index.html"):debug_print("oldFriend click!");else try{window.App.login()}catch(e){console.info("window.App.login()"+e)}})}function s(e,t,n){$.ajax({type:"GET",url:"http://browser.umeweb.com/cn_ume_api/newyear/api/check/"+e,dataType:"json",cache:!1,xhrFields:{withCredentials:!0},success:function(i){debug_print("sucess:"+JSON.stringify(i)),debug_print("sucess objectId:"+e),p(e,t,n)},error:function(e,t){debug_print(t)}})}function p(e,t,i){$.ajax({type:"GET",url:"http://browser.umeweb.com/cn_ume_api/newyear/api/times/"+e,cache:!1,dataType:"json",xhrFields:{withCredentials:!0},success:function(e){0==e.Code?(m=e.playtimes,debug_print("playNum :"+m),g=i>=w?t+1-m:t-m,g=g>0?g:0):g=0,$(".start span").text(g),$("#lottery a").click(function(){return _czc.push(["_trackEvent","双蛋活动","click","我要抽奖","",""]),!(h||g<=0)&&(f.speed=100,n(),h=!0,!1)})},error:function(e,t){console.info(t)}})}function u(e,t){debug_print(e+"  coin：  "+t),a("http://browser.umeweb.com/cn_ume_api/newyear/api/coin/exchange",{uid:e,coin:t}).catch(function(e){debug_print("error: "+JSON.stringify(e)),popup.open({width:13.11111,height:4.88889,title:"",content:'<div class="notice_pop">亲，服务器繁忙，等会过来再试？</div>'}),$("#submitBtn").html("确认")}).then(function(e){debug_print("postMoonVote value: "+JSON.stringify(e)),0==e.Code?d(t):(popup.open({width:13.11111,height:4.88889,title:"",content:'<div class="notice_pop">亲，服务器繁忙，等会过来再试？</div>'}),$("#submitBtn").html("确认"))})}function a(e,t){return new Promise(function(n,i){var o=new XMLHttpRequest;o.open("POST",e,!0),o.setRequestHeader("Content-type","application/json;charset=utf-8"),o.onreadystatechange=function(){if(4===this.readyState)if(200===this.status)n(JSON.parse(this.responseText),this);else{var e={code:this.status,response:this.response};i(e,this)}},o.withCredentials=!0,o.send(JSON.stringify(t))})}function l(){var e=new Date,t=new Date("2019-02-16 00:00:00"),n=e>=t?3121+9*parseInt((e-t)/6e4):3121;console.info("count:"+n),$(".join-people-btn span").text(n);var i=setInterval(function(){n+=9,$(".join-people-btn span").text(n)},6e4);e.getTime()>v&&window.clearInterval(i)}function d(e){debug_print("抽奖结果："+e);var t='<div class="notice"><p class="coin"><span style="font-size: 1.6rem">'+e+'</span>金币</p><p>金币将于1天内存入你的微米账户</p></div> <button class="btn_ck">去查看</button>';popup.open({width:13.44444,height:8.16667,title:"恭喜你！抢到",content:t}),$(".popUp_c").attr("id","pop_game"),$("#cancelBtn").show().css({width:"1.1111rem",height:"1.1111rem",background:"url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat","background-size":"1.1111rem 1.1111rem",position:" absolute",top:"-1.42222rem",right:"0rem"}),$("#pop_game").css({"background-color":"#FFE1BE"}),$("#pop_game h2").css({height:"2.4rem","line-height":"2.4rem",color:"#c8831f","font-weight":"normal","font-size":".93333rem"}),$("#pop_game .notice").css({margin:"0 .22222rem .66667rem .22222rem","text-align":"left","font-size":".6rem",color:"#c8831f"}),$("#pop_game .notice .coin").css({color:"#E2311E"}),$("#pop_game p").css({"font-size":".66667rem","text-align":"center"}),$("#pop_game button").css({"font-size":".66667rem","text-align":"center",border:"none",color:"#c8831f","background-color":"transparent","text-decoration":"underline"}),$("#pop_game button").click(function(){window.location.href="http://browser.umeweb.com/v6/ume/wealth.html"})}var f={index:-1,count:0,timer:0,speed:20,times:0,cycle:50,prize:-1,init:function(e){$("#"+e).find(".lottery-unit").length>0&&($lottery=$("#"+e),$units=$lottery.find(".lottery-unit"),this.obj=$lottery,this.count=$units.length,$lottery.find(".lottery-unit-"+this.index).addClass("active"))},roll:function(){var e=this.index,t=this.count,n=this.obj;return $(n).find(".lottery-unit-"+e).removeClass("active"),e+=1,e>t-1&&(e=0),$(n).find(".lottery-unit-"+e).addClass("active"),this.index=e,!1},stop:function(e){return this.prize=e,!1}},h=!1,g=0,m=0,b="",w=new Date("2018-12-21 00:00:00"),_=new Date("2018-12-21 00:00:00").getTime(),v=new Date("2019-03-15 23:59:59").getTime();window.onload=function(){f.init("lottery"),l(),o()},$(window).scroll(function(){$(window).scrollTop()<40?$("section.btn").show():$("section.btn").hide()})}]);