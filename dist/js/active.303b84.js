!function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="./",t(t.s=5)}([,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(6),o=(n.n(i),n(7));n.n(o)},function(e,t){},function(e,t){function n(){try{var e=window.App.getUserStatus();0==e?(debug_print("apprenticeActive20190501 isLoggedIn ok"),localStorage.setItem("hasLogout",!1),o(d,function(e,t){u=!0,i(d,e,t)})):-1==e&&i(d,!1,null)}catch(e){debug_print("isLoggedIn error!!!");var t=navigator.userAgent.toLowerCase();"micromessenger"==t.match(/MicroMessenger/i)||"qq"==t.match(/QQ/i)?(console.info("weixin qq"),$("body").click(function(){window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ume.browser"})):(d="d9fb4fbaa4b9ce1852ef8a2c",o(d,function(e,t){i(d,e,t)}))}}function i(e,t,n){var i=n&&n.User&&n.User.money?n.User.money:0;$(".btn1").unbind("click").click(function(){_czc.push(["_trackEvent","五一活动","click","如何赚取劳动勋章","",""]),window.location.href="rule.html"}),$(".btn2").unbind("click").click(function(){_czc.push(["_trackEvent","五一活动","click","可快速提现","",""]),1==t?c(e,i):getToLogin()}),$(".btn3").unbind("click").click(function(){_czc.push(["_trackEvent","五一活动","click","赚取金勋章","",""]),1==t?window.location.href="http://browser.umeweb.com/v6/ume/active/20180621/index.html":getToLogin()}),$(".btn4").unbind("click").click(function(){_czc.push(["_trackEvent","五一活动","click","玩游戏领勋章","",""]),1==t?window.location.href="game.html":getToLogin()}),$(".btn5").unbind("click").click(function(){_czc.push(["_trackEvent","五一活动","click","提现记录","",""]),1==t?window.location.href="http://browser.umeweb.com/v6/ume/www/cashrate.html?page=labourgame":getToLogin()}),$(".num-1").unbind("click").click(function(){1==t?a(e,n):getToLogin()}),$(".num-2").unbind("click").click(function(){1==t?a(e,n):getToLogin()})}function o(e,t){$.ajax({type:"GET",url:"http://browser.umeweb.com/cn_ume_api/wy/api/check/"+e,dataType:"json",cache:!1,xhrFields:{withCredentials:!0},success:function(n){debug_print("sucess:"+JSON.stringify(n)),0==n.Code?($(".btn2 span").text(n.User.money),$(".gold-medal-num").text(n.User.gold_medal),$(".glory-medal-num").text(n.User.glory_medal),t(!0,n,e)):t(!0,null,e)},error:function(n,i){debug_print(i),t(!1,null,e)}})}function c(e,t){function n(){var e='<div class="notice">'+i+"</div>";popup.open({width:11.22222,height:o,title:"",content:e}),$(".popUp_c").css({"background-color":"#be2a2a","boeder-radius":".8rem"}),$(".popUp_c h2").css({height:"1.6rem"}),$(".popUp_close ").hide(),$(".popUp_btn ").hide(),$(".notice").css({"text-align":"left","font-size":".58889rem",color:"#e7cea8",padding:"0 .84444rem 0.88889rem","line-height":"1rem"})}var i="",o="5.66667";if(t>0){new Date<new Date("2019-05-08 23:59:59")?(i="您好，可快速提现金额的提现时间为5月25日 0:00-5月31日 23:59开通，请于规定时间内进行快速提现哦",o="7.11111",n()):p(e,t)}else i="您还没有可快速提现的金额，赶紧去赚勋章兑换现金吧",o="5.66667",n()}function a(e,t){for(var n="",i=t&&t.User&&t.User.gold_medal?t.User.gold_medal:0,o=t&&t.User&&t.User.glory_medal?t.User.glory_medal:0,c=["10枚光荣勋章","18枚光荣勋章","25枚光荣勋章","31枚光荣勋章","5枚金勋章","8枚金勋章","15枚金勋章","30枚金勋章","50枚金勋章","100枚金勋章"],a=[10,18,25,31,5,8,15,30,50,100],s=[0,0,0,0,1,1,1,1,1,1],p=[.5,1,1.5,2,2,4,9,21,40,88.8],l=0;l<c.length;l++)n+=s[l]===s[0]?'<option data-val="'+a[l]+'">'+a[l]+"枚光荣勋章</option>":'<option data-val="'+a[l]+'">'+a[l]+"枚金勋章</option>";var u='<p class="num"><i class="gold-medal-num" ></i> 金勋章: <span>'+i+'</span>枚 </p><p class="num"><i class="glory-medal-num"></i>光荣勋章: <span>'+o+"</span>枚</p>",d=u+'<select  name="shengfen" data-type="'+s[0]+'"  data-num="'+a[0]+'" id="myselect">'+n+'</select><p class="moon-money"><span>'+p[0]+'</span>现金</p><button id="btn_s" type="submit"></button><div class="notice">兑换后金额直接到您的“可立即提现金额”的余额，于25-31日期间可操作提现 </div>';popup.open({width:12.44444,height:13.46667,title:"",content:d}),$("#popUp").css({"margin-top":"-8rem"}),$(".popUp_c").attr("id","exchange_popup").css({"background-color":"#be2a2a","boeder-radius":".8rem"}),$(".popUp_c h2").css({height:".6rem"}),$(".popUp_cont").css({"padding-top":".66667rem","font-size":".66667rem"}),$(".notice").css({"text-align":"left","font-size":".58889rem",color:"#e7cea8",padding:"2.44444rem .84444rem 0.88889rem","line-height":".8rem"}),$("#cancelBtn").hide(),$("#btn_s").click(function(){var t=$("#myselect").attr("data-num"),n=$("#myselect").attr("data-type");deletePop(),r(e,parseInt(t),n)}),$("#myselect").change(function(){var e=$("#myselect").val();if(console.info(e),c.indexOf(e)>=0){var t=c.indexOf(e);$(".moon-money").html("<span>"+p[t]+"元</span>现金"),$("#myselect").attr("data-type",s[t]).attr("data-num",a[t])}})}function r(e,t,n){debug_print(e+"  num：  "+t+"  type：  "+n),s("http://browser.umeweb.com/cn_ume_api/wy/api/exchange",{uid:e,medalType:parseInt(n),medal:t}).catch(function(e){debug_print("error: "+JSON.stringify(e))}).then(function(e){debug_print("postMoonVote value: "+JSON.stringify(e));var t="";switch(e.Code){case 0:t='<div class="notice1">兑换成功!</div>';break;case"E001":t='<div class="notice1" data-d="uid">参数出错，稍后再试</div>';break;case"E002":t='<div class="notice1" data-d="medalType medal">参数出错，稍后再试</div>';break;case"E003":case"E004":t='<div class="notice1" data-d="Cookie">参数出错，稍后再试</div>';break;case"E005":default:t='<div class="notice1">兑换零钱失败</div>'}popup.open({width:10.44444,height:4.3333,title:"",content:t}),$(".notice1").css({"text-align":"ceter","font-size":".88889rem",color:"#787878",padding:".44444rem 0.6667rem","padding-top":"1.2rem","line-height":"1.2rem"}),$(".notice2").css({"text-align":"left","font-size":".88889rem",color:"#787878",padding:".44444rem 0.6667rem","padding-top":".8rem","line-height":"1.2rem"}),$("#cancelBtn").hide(),$("#submitBtn").html("确认").css({"text-align":"center","font-size":".88889rem",color:"#787878","line-height":"1.2rem"}),o(d,function(e,t){i(d,e,t)})})}function s(e,t){return new Promise(function(n,i){var o=new XMLHttpRequest;o.open("POST",e,!0),o.setRequestHeader("Content-type","application/json;charset=utf-8"),o.onreadystatechange=function(){if(4===this.readyState)if(200===this.status)n(JSON.parse(this.responseText),this);else{var e={code:this.status,response:this.response};i(e,this)}},o.withCredentials=!0,o.send(JSON.stringify(t))})}function p(e,t){popup.open({width:14.44444,height:16.44444,title:"请输入支付宝账户领取红包",content:'<ul id="pop_form"><li><span>支付宝账户</span><input placeholder=" 请输入支付宝账号" type="text" name="phone" /></li><li><span>确认账户 </span><input type="text" placeholder=" 请确认支付宝账号" name="phone_o" /></li><li><span>真实姓名</span><input placeholder=" 请输入支付宝认证姓名" type="text" maxlength="50" name="name" /></li><li><span>确认姓名 </span><input placeholder=" 请确认支付宝认证姓名" type="text" maxlength="50" name="name_s" /> </li></ul><div class="notice"><span style="font-weight:600;">如未开通支付宝账户：</span><br>1.在上方【输入支付宝账号栏】输入你的手机号并提交。<br>2.添加微米官方公众号：weimiliulanqi   并回复邀请码领取提现红包</div><button id="btn_c" type="button">取消</button><button id="btn_s" type="submit">提交</button>'}),$(".popUp_c").attr("id","cash_popup"),$("#popUp h2").css({height:"2.22222rem","line-height":"2.22222rem",color:"#5A3A20",background:"#FBDA9F","font-size":".88889rem"}),$(".notice").css({"text-align":"left","font-size":".53333rem",color:"#787878",padding:"0 .6667rem 0.88889rem 0.6667rem","line-height":".8rem"}),$("#cancelBtn").show().css({background:"url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat","background-size":"1.1111rem 1.1111rem",position:" absolute",top:"-1.42222rem",right:"0rem"}),$("#btn_c").click(function(){deletePop()}),$("#btn_s").click(function(){var n=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,c=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,a=$("#pop_form li input"),r=a.eq(0).val(),p=a.eq(1).val(),u=a.eq(2).val(),m=a.eq(3).val();if(deletePop(),null==r||""==r)html0="账号不能为空",l(html0);else if(r!=p){l("你两次输入的账号不同，","请再次确认后提交。")}else if(null===u||""===u)l("认证姓名不能为空");else if(u!==m)l("你两次输入的认证姓名不同，","请再次确认后提交。");else if(n.test(r)||c.test(r)){console.info(e);var h={uid:e,phone:r,payeeRealName:u,money:t};s("http://browser.umeweb.com/cn_ume_api/wy/api/transfer_apply",h).catch(function(e){debug_print("transfer_apply error: "+JSON.stringify(e))}).then(function(e){debug_print("transfer_apply value: "+JSON.stringify(e)),0==e.Code?(l("提现成功！"),o(d,function(e,t){i(d,e,t)})):l("E005"==e.Code?"提现失败！":e.Code)})}else html0="请输入正确的账号!",l(html0)})}function l(e,t){var n="";t?(n='<div class="notice_content">'+e+"</br>"+t+"</div>",popup.open({width:12.33333,height:6.33333,title:"",content:n})):(n='<div class="notice_content">'+e+"</div>",popup.open({width:12.33333,height:5,title:"",content:n})),$("#popUp").css({"min-height":"4rem"}),$("#submitBtn").html("确认").css({"font-size":"0.71111rem",width:"100%",height:"1.8rem","line-height":"1.8rem"}),$("#cancelBtn").show().css({background:"url(http://browser.umeweb.com/v6/ume/img/apprentice/close1.png) no-repeat","background-size":"1.1111rem 1.1111rem",position:" absolute",top:"-1.42222rem",right:"0rem"}),$(".notice_content").css({"font-size":"0.66667rem",padding:" 0.88889rem 0.6667rem","border-bottom":"0.04444rem solid #DADCDD","line-height":"1.33333rem"})}var u=!1,d="";try{d=window.App.getObjectId()}catch(e){debug_print("201:\r\n"+e)}window.onload=function(){debug_print("activePage 20190501 come in!!!"),n()}}]);