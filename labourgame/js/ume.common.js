/*公共部分*/
//页面初始化
(function (doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth)
			return;
		docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
	};
	if (!doc.addEventListener)
		return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window); //rem.js

var UmePageUrl = window.location.href;

//用户信息
var data_c = {}; // umeuser命名空间

/*设置计数*/
function countInit() {
	debug_print("countUrl: " + UmePageUrl);
	var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " https://");
	document.write(unescape("%3Cspan id='cnzz_stat_icon_1273327993'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s19.cnzz.com/z_stat.php%3Fid%3D1273327993%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
	$('#cnzz_stat_icon_1273327993').css('display', 'none');
}
// 计数自执行
(function () {
	var myScript = document.createElement("script");
	myScript.async = true;
	myScript.type = "text/javascript";
	myScript.appendChild(document.createTextNode('countInit()'));
	var objDiv = document.body.lastChild;
	objDiv.parentNode.insertBefore(myScript, objDiv);
})()

/*app 打印信息*/
function debug_print(log) {
	try {
		window.App.logger(log);
	} catch (e) {
		console.log(log);
	}
}

function getToLogin(){
  try {
    window.App.login();
  } catch (e) {
    console.info("window.App.login()" + e);
  }
}

/*删除弹框*/
function deletePop() {
	var popUp = document.getElementById("popUp");
	var popMask = document.getElementById("popMask");
	document.body.removeChild(popUp);
	document.body.removeChild(popMask);
	$("body").css({
		"overflow": "auto"
	});
}


function postDid(ic) {
  var url = "http://browser.umeweb.com/cn_ume_api/device/api/v1/save";
  var did = '';
  try {
    did = window.App.getUUID();
  } catch (e_we) {
    debug_print(e_we);
    did = localStorage.getItem('did');
  }
  debug_print("ic:" + ic + "  did: " + did);
  axios.post(url, { //post是用对象传值
    ic: ic,
    did: did
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error);
  });
}