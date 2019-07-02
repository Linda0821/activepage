 import './css/index.css'
 import './js/index.js'

 /*局部刷新*/
 function onRefreshPage() {
   debug_print("20190701-activePage shuaxin onRefreshPage()");
   if(isShareClick) return;
   try {
     var isLoggedIn = window.App.getUserStatus();
     if (isLoggedIn == 0) {
       debug_print("shuaxin true");
       getUmeUserInfo(function(){
         isShareClick = true;
         getMyInfor();
       });
     } else if (isLoggedIn == -1) {
       debug_print("shuaxin false");
     }
   } catch (e) {
     debug_print("shuaxin isLoggedIn: " + e);
   }
 }

