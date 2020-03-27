/*设置几种弹出层*/
(function(window, undefined) {
  var popup = function() {};
  popup.prototype = {
    open: function(options) {
      this.opt = options;
      debug_print("this.opt"+JSON.stringify(this.opt));
      this.popHtml();
      this.popStyle();

      //解决点击延迟与按钮生成之间的冲突 
      if (document.getElementById("cancelBtn")) {
        setTimeout(this.closeCallBack(), 300);
      };
      if (document.getElementById("submitBtn")) {
        setTimeout(this.submitCallBack(), 300);
      };
    },
    popHtml: function() {
      var str = "";
      str += "<div id=\"popUp\"  style=\"opacity:0;\" class=\"popUp\"><div class=\"popUp_c\"><h2>" + this.opt.title + "</h2>";
      str += "<div class=\"popUp_cont\">" + this.opt.content + "</div>";

      str += "<div class=\"popUp_close\" id=\"cancelBtn\"></div>";
      str += "<div class=\"popUp_btn\" id=\"submitBtn\"></div></div></div>";
      str += "<div id=\"popMask\" class=\"popMask\"></div>";
      $("body").append(str);
      debug_print("popHtml"+str);
    },
    //设置元素的宽度和高度
    popStyle: function() {
      var popUp = document.getElementById("popUp");
      var w = (this.opt.width != "" || this.opt.width != undefined) ? this.opt.width + "rem" : 300 + "rem";
      var Wleft = (this.opt.width != "" || this.opt.width != undefined) ? "-" + this.opt.width / 2 + "rem" : "-" + 300 / 2 + "rem";
      var h = (this.opt.height != "" || this.opt.height != undefined) ? this.opt.height + "rem" : 130 + "rem";
      var hTop = (this.opt.height != "" || this.opt.height != undefined) ? "-" + this.opt.height / 2 + "rem" : "-" + 130 / 2 + "rem";
      popUp.style.cssText = "width:" + w + ";height:" + h + ";margin-left:" + Wleft + ";margin-top:" + hTop + "";
      this.animatIn();
      debug_print("popUp.style.cssText"+popUp.style.cssText);
    },
    //设置弹出层动画
    animatIn: function() {
      var andom = document.getElementById("popUp");
      var thisOpacity = 0;
      /*var otime = setInterval(function() {
        thisOpacity += 0.1;
        andom.style.opacity = thisOpacity;
        andom.style.filter = "alpha(opacity=" + thisOpacity * 100 + ")";
        try {
          debug_print("andom.style.opacity"+andom.style.opacity);
        } catch (e) {
          debug_print("andom.style.opacity error:" + e);
        }
        try {
          debug_print("andom.style.filter"+andom.style.filter);
        } catch (e) {
          debug_print("andom.style.filter error:" + e);
        }
        if (andom.style.opacity >= 1) {
          clearInterval(otime);
        }
      }, 20);*/
      thisOpacity = 1 ; 
      andom.style.opacity = thisOpacity;
      andom.style.filter = "alpha(opacity=" + thisOpacity * 100 + ")";
      $("body").css({
        "overflow": "hidden"
      });
    },
    //添加关闭回调函数
    closeCallBack: function() {
      var cancelBtn = document.getElementById("cancelBtn");
      cancelBtn.addEventListener("click", this.closeDiv);
      cancelBtn.addEventListener("click", this.opt.closeCallBack);
     var popMask = document.getElementById("popMask");
     popMask.addEventListener("click", this.closeDiv);
     popMask.addEventListener("click", this.opt.closeCallBack);
    },
    //删除弹出层和遮罩层
    closeDiv: function() {
      var popUp = document.getElementById("popUp");
      var popMask = document.getElementById("popMask");
      document.body.removeChild(popUp);
      document.body.removeChild(popMask);
      $("body").css({
        "overflow": "auto"
      });
          
    },
    //添加确定返回函数
    submitCallBack: function() {
      var submitBtn = document.getElementById("submitBtn");
      submitBtn.addEventListener("click", this.closeDiv);
      submitBtn.addEventListener("click", this.opt.submitCallBack);
    }
  };
  window.popup = popup;
})(window, undefined);
var popup = new popup();