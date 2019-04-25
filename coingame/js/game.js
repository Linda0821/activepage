 var B = 0.56;
                /*时间参数*/
                var beginTime = new Date();//游戏开始时间
                var gameTime = 30;//游戏时间
                var remainTime;//游戏剩余时间
                
                /*画布样式*/
                var canvasW = window.innerWidth;
                var canvasH = canvasW/B;
                if(canvasH > window.innerHeight) canvasH = window.innerHeight;
                var canvasObj = $('#canvas');
                canvasObj.css('margin-top',(window.innerHeight-canvasH)/2);
                canvasObj.attr('width',canvasW);
                canvasObj.attr('height',canvasH);/*画布的宽和高为屏幕的宽和高*/
                var ca=document.getElementById("canvas");

                var ctx=ca.getContext("2d");
                var bj1=new Image();//新建背景图对象

                var player=new Image(); //新建人的图片对象
                var tu=new Array();

                bj1.src="images/bj.jpg";
                player.src="images/ren.png";
                var playerWidth =123*B;//人物长缩小0.56
                var playerHeight =213*B;//人物高缩小0.56
				/*金币参数*/
                var h=20;
                var gk=1;
                var sudu=10;//10 金币掉落速度
                var zl=100;// 金币\银币\铜币 选择随机数
                var chi=0;
                var shi=0;
                var fs=0;//获得金币
                var sm=1;
                var bj=bj1;
                
                
                function object(){
                    this.x=0;
                    this.y=0;
                    this.l=11;
                    this.image=new Image();
                }

                var sprite=new object();
                //sprite.x=(canvasW - playerWidth)/2;
                sprite.x=0;
                sprite.y=canvasH-playerHeight;
                //sprite.y=canvasH-playerHeight;

                sprite.image=player;

                addListener(ca,"touchmove",m);//监听鼠标移动事件 ；ca为对象document.getElementById("canvas");  m为移动函数
                
                interval = setInterval(function(){
                    ctx.clearRect(0,0,canvasW,canvasH);//矩形 清空画布
                    ctx.drawImage(bj,0,0,canvasW,canvasH);//背景图固定
                    ctx.drawImage(sprite.image,sprite.x,sprite.y,playerWidth,playerHeight);//移动的任务对象 人
                    draw();//金银铜币对象
                    document.getElementById("f").innerHTML=fs;
                    checkTime();                   
                },100);
                
                function stop()
                {
                    clearInterval(interval);                   
                }
              
                function checkTime()
                {
                    var nowTime = new Date();
                    remainTime = gameTime-parseInt((nowTime.getTime()-beginTime.getTime())/1000);//剩余时间的计算
                    document.getElementById('m').innerHTML = remainTime;//界面显示剩余时间
                    if(remainTime==0) {
                    	stop();
                    	//ctx.drawImage(bj,0,0,canvasW,canvasH);
                    	//ctx.drawImage(sprite.image,sprite.x,20,playerWidth,playerHeight);
                    }
                }
                
                var range = canvasW - 60*B; //去除金币宽度的的长度
                function chansheng(){//产生金币               	
                    if(shi%h==0){
                    	//console.info(shi+"   "+chi);
                        for(var j=2*chi;j<2*(chi+1);j++){
                        	//console.info(chi);
                            tu[j]=new object();
                            var i=Math.round(Math.random()*range);//Math.round()取整 ；Math.random()随机数
                            if(j==2*chi+1)
                            {
                                while(Math.abs(i-tu[2*chi].x)<40){//Math.abs()绝对值 
                                    i=Math.round(Math.random()*range);
                                }
                            }
                            var k=Math.round(Math.random()*zl);//随机选择金银铜币
                            if(k < 90){
                                tu[j].image.src="images/1.png";
                                tu[j].q = 1;
                            }else if(k < 97){
                                tu[j].image.src="images/2.png";
                                tu[j].q = 2;
                            }else{
                                tu[j].image.src="images/3.png";
                                tu[j].q = 3;
                            }
                            //设定金币初始位置
                            tu[j].x=i;
                            tu[j].y=-Math.round(Math.random()*300);
                        }
                        chi++;
                        if(chi==h) chi=0;
                    }
                    shi++;//总计数
                }


                function sudukongzhi(){//由游戏时间控制金币掉落的时间
                    if(remainTime > 10){
                        //h=5;
                        sudu=30;
                    }else if(remainTime > 5){
                        //h=5;
                        sudu=50;
                    }else{
                        //h=5;
                        sudu=60;
                    }
                    h=5;
                }
                function draw(){//画金币
                    sudukongzhi();
                    chansheng();
                    for(var i=0;i<tu.length;i++){
                        if(jianche(sprite,tu[i])) {
                            if(tu[i].q == 1){//每接一个铜币奖1金币
                                fs+=2;//fs+=1;
                            }else if(tu[i].q == 2){//每接一个银币奖5金币
                                fs+=10;//fs+=5;
                            }else{//每接一个金币10金币
                                fs+=20;//fs+=10;
                            }
                            tu[i].y+=200;
                        }else if(!jianche(sprite,tu[i])){
                            //ctx.drawImage(tu[i].image,tu[i].x,tu[i].y,60*B,60*B);
                            tu[i].y+=sudu;
                        }
                        ctx.drawImage(tu[i].image,tu[i].x,tu[i].y,60*B,60*B);
                    }
                }
				/*检测是否接到金币了*/
                function jianche(a,b){
                    var c=a.x-b.x;
                    var d=a.y-b.y;
                    if(c < b.image.width*B && c>-a.image.width*B  && d<b.image.height*B && d>-a.image.height*B){/*二者是否相撞*/
                        return true;
                    }else{
                        return false;
                    }
                }
                function addListener(element,e,fn){
                    if(element.addEventListener){
                        element.addEventListener(e,fn,false);
                    } else {
                        element.attachEvent("on" + e,fn);
                    }
                }

                function m(event){//人移动函数
                	//console.info(event.touches[0].pageY + ' '+sprite.y);
                	stopBubble(event);
                	stopDefault(event);
                	var point = event.touches ? event.touches[0] : event;
                	if( point.pageY >= sprite.y && point.pageY<=canvasH){//移动对象在人
                		sprite.x =  point.pageX-playerWidth/2;
	                    //sprite.x=event.clientX-playerWidth/2;
	                    if(sprite.x+playerWidth>=canvasW) {//移动到两边缘的处理
	                    	sprite.x=canvasW-playerWidth;
	                    } else if(sprite.x<=playerWidth/2) {
	                    	sprite.x=0;
	                    }	
                	}
                	
            		
            	
                }
                
                function stopBubble(e) {
			        //如果提供了事件对象，则这是一个非IE浏览器
			        if ( e && e.stopPropagation )
			            //因此它支持W3C的stopPropagation()方法
			            e.stopPropagation();
			        else
			            //否则，我们需要使用IE的方式来取消事件冒泡
			            window.event.cancelBubble = true;
			    }
			    //阻止浏览器的默认行为
			    function stopDefault(e) {
			        //阻止默认浏览器动作(W3C)
			        if ( e && e.preventDefault )
			            e.preventDefault();
			        //IE中阻止函数器默认动作的方式
			        else
			            window.event.returnValue = false;
			        return false;
			    }
//                function m(event){
//                    var last=event.clientX-playerWidth/2;
//
//                    if(last+playerWidth>=canvasW) last=canvasW-playerWidth;
//                    else if(last<=playerWidth/2) last=0;
//                    if(last < sprite.x){
//                        for(var i=sprite.x;i>last;i--){
//                            sprite.x = i;
//                            ctx.drawImage(sprite.image,sprite.x,sprite.y,playerWidth,playerHeight);
//                        }
//                    }else{
//                        for(var j=0;j<last;j+10){
//                            sprite.x = j;
//                            ctx.drawImage(sprite.image,sprite.x,sprite.y,playerWidth,playerHeight);
//                        }
//                    }
//                }