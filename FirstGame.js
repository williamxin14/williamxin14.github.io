				
				
				var canvas = document.getElementById('myCanvas');
				var ctx = canvas.getContext('2d');
				var ImageX=0;
				var ImageX2=850;
				var Background1;
				var Background2;
				var animationTimer=0;
				var cointimer=0;
				var coinAnimater=0;
				var Score=0;
				var CoinImage= {
					xPos:0,
					yPos:0,
					width:44,
					height:40,
					Image:new Image(),
				}
				var Coins=new Array();

				var RainbowDash= {
					xPos:150,
   				    yPos:180,
					width:95,
					height:38,
					xSpeed:0,
					ySpeed:0,
					leftPressed:false,
					rightPressed:false,
					upPressed:false,
					downPressed:false,
                    Image:new Image(),
					onGround:true,
					ImagePosX:0,
					//ImagePosY:1060,
					ImagePosY:0,
					};
				 function startGame() {
					init();
					run();
				 }

				 function init(){

					 Background1 = new Image();
				     Background1.onload = function() {  ctx.drawImage(Background1, ImageX, 0,850,500);};
					 Background1.src = 'https://chupacdn.s3.amazonaws.com/catalog/product/cache/5/thumbnail/1280x/17f82f742ffe127f42dca9de82fb58b1/6/-/6-vector-game-backgrounds-8003_imgs_8003_4.png';
					 Background2 = new Image();
				     Background2.onload = function() {  ctx.drawImage(Background1, ImageX2, 0,850,500);};
					 Background2.src = 'https://chupacdn.s3.amazonaws.com/catalog/product/cache/5/thumbnail/1280x/17f82f742ffe127f42dca9de82fb58b1/6/-/6-vector-game-backgrounds-8003_imgs_8003_4.png';
					 //RainbowDash.Image.src='https://orig00.deviantart.net/3799/f/2014/229/1/e/my_little_pony_sprites_by_ketrindarkdragon-d7vinuj.gif'
					 RainbowDash.Image.src= 'https://lh6.ggpht.com/ZCrXKci6QvHJh3KJkYnG25IPtJVmimdMSOGKDWs8LsE3F7wEZ8Erl9-IwIUk1EShig=w300'
					 CoinImage.Image.src='http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/images/coin-sprite-animation-sprite-sheet.png';
					 
					 var myMusic = new sound('MLP_song.mp3');
					  myMusic.play();
					 }

				 
					
				 
				 function run() {
					update();
					render();
					
				 }

				 setInterval(run, 20);
				 
			     function update(){
					RainbowDash.update();
					spawnCoin();
					for(i=0;i<Coins.length;i++){
						 if (RainbowDash.xPos < Coins[i].xPos + 50 &&
						 RainbowDash.xPos  + RainbowDash.width*2 >  Coins[i].xPos&&
							 RainbowDash.yPos  < Coins[i].yPos + 50 &&
							RainbowDash.height*2 + RainbowDash.yPos> Coins[i].yPos) {
							Coins.splice(i,1);
							Score+=1;


							var audio = new Audio('Coin_Sound.mp3');
							 audio.play();

						 }
					 	  Coins[i].xPos-=3;
						  if(Coins[i].xPos<-50){
						  	  Coins.shift();
							  }
						

						 
					}
					
					ImageX-=5;
					ImageX2-=5;

					if(ImageX2==0){
						ImageX=850;
					}
					if(ImageX==0){
						ImageX2=850;
					}
					//console.log("CoinX:"+Coins[0].xPos+"CoinY:"+Coins[0].yPos);
					//console.log("PlayerX:"+RainbowDash.xPos+"PlayerY:"+RainbowDash.yPos);

					
				 }

				
				  
				 

				 function render(){
					 ctx.clearRect(0,0,canvas.width,canvas.height);
					 ctx.beginPath();
				     ctx.drawImage(Background1, ImageX, 0,850,500)
					 ctx.drawImage(Background2, ImageX2, 0,850,500)
					 
					 coinAnimater+=1;
					 if(coinAnimater>2){
							CoinImage.xPos+=CoinImage.width
							coinAnimater=0;
						}
					 if(CoinImage.xPos>=CoinImage.width*10){
							CoinImage.xPos=0;
						}
					 for(i=0;i<Coins.length;i++){
					 		ctx.drawImage(CoinImage.Image,CoinImage.xPos,0,CoinImage.width,CoinImage.height,Coins[i].xPos,Coins[i].yPos,
							 50,50);
						}
					 RainbowDash.render();
					 ctx.font="15px Verdana";
					 // Create gradient
					 var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
					 gradient.addColorStop("0","magenta");
					 gradient.addColorStop("0.5","blue");
					 gradient.addColorStop("1.0","pink");
					 // Fill with gradient
					 ctx.fillStyle=gradient;
					 ctx.fillText("Coins Collected: "+Score,10,20);
					 ctx.closePath();

				}
				RainbowDash.update= function() {

					if(RainbowDash.upPressed==true){
						RainbowDash.ySpeed-=1;
					}
					if(RainbowDash.downPressed==true){
						RainbowDash.ySpeed+=1;
					}
					if(RainbowDash.leftPressed==true){
						//RainbowDash.xSpeed-=1;
					}
					if(RainbowDash.rightPressed==true){
						//RainbowDash.xSpeed+=1;
					}
					
					if(RainbowDash.rightPressed==false && RainbowDash.leftPressed==false){
						
						if(RainbowDash.xSpeed>0){
							RainbowDash.xSpeed-=1;
							if(RainbowDash.xSpeed<0){RainbowDash.xSpeed=0}
						}
						if(RainbowDash.xSpeed<0){
							RainbowDash.xSpeed+=1;
							if(RainbowDash.xSpeed>0){RainbowDash.xSpeed=0}
						}
					}
					if(RainbowDash.upPressed==false && RainbowDash.downPressed==false){
						if(RainbowDash.ySpeed>0){
							RainbowDash.ySpeed-=1;
							if(RainbowDash.ySpeed<0){RainbowDash.ySpeed=0}
						}
						if(RainbowDash.ySpeed<0){
							RainbowDash.ySpeed+=1;
							if(RainbowDash.ySpeed>0){RainbowDash.ySpeed=0}
						}
					}

					if(RainbowDash.yPos<0 && RainbowDash.ySpeed<0){
						RainbowDash.ySpeed=0;
						RainbowDash.yPos=0;
					}
					if(RainbowDash.yPos>canvas.height-RainbowDash.width && RainbowDash.ySpeed>0){
						RainbowDash.ySpeed=0;
						RainbowDash.yPos=canvas.height-RainbowDash.width;
					}
					RainbowDash.xPos+= RainbowDash.xSpeed;
					RainbowDash.yPos+= RainbowDash.ySpeed;
				};
				RainbowDash.render= function() {
				    //flipHorizontally(RainbowDash.Image.src,RainbowDash.xPos,RainbowDash.yPos);
					animationTimer+=1;
					if(animationTimer>=3){
						//animate();
						animationTimer=0;
					}
					
					 //ctx.drawImage(RainbowDash.Image,RainbowDash.ImagePosX,RainbowDash.ImagePosY,RainbowDash.width,RainbowDash.height,RainbowDash.xPos,RainbowDash.yPos,
					// RainbowDash.width*2,RainbowDash.height*2);
					
					ctx.drawImage(RainbowDash.Image,RainbowDash.xPos,RainbowDash.yPos,100,100);
					
				};

				function flipHorizontally(img,x,y){
					// move to x + img's width
					 ctx.translate(x+img.width,y);
		
					 // scaleX by -1; this "trick" flips horizontally
					 ctx.scale(-1,1);
    
					 // draw the img
					 // no need for x,y since we've already translated
					 ctx.drawImage(img,0,0);
    
					 // always clean up -- reset transformations to default
					 ctx.setTransform(1,0,0,1,0,0);
					}
				
				function animate(){
					RainbowDash.ImagePosX+=RainbowDash.width;
					if(RainbowDash.ImagePosX>=RainbowDash.width*6){
						RainbowDash.ImagePosX=0;
					}
				}

				function coin(Image, xPos,yPos,width,height){
					this.Image=Image;
					this.xPos=xPos;
					this.yPos=yPos;
					this.width=width;
					this.height=height
				}

				function spawnCoin(){
				
					cointimer+=1
					if(cointimer>25){
						Coins.push(new coin(CoinImage.Image,canvas.width,Math.floor(Math.random() * (canvas.height-50)),50,50));
						
						cointimer=0;
					}
				}
				
				coin.update=function(){
					
					coin.xPos+=3;
					
				}

				coin.render=function(){
					coinAnimater+=1;
					if(coinAnimater>3){
						CoinImage.xPos+=CoinImage.width
						cointimercoinAnimater=0;
					}
					if(CoinImage.xPos>=CoinImage.width*10){
						CoinImage.xPos=0;
					}
					 ctx.drawImage(CoinImage.Image,CoinImage.xPos,0,CoinImage.width,CoinImage.height,coin.xPos,coin.yPos,
					 coin.width*2,coin.height*2);

				}
				

					window.onkeydown = function(e) {
						var key = e.keyCode ? e.keyCode : e.which;

						if(key==87){//W
							RainbowDash.upPressed=true;
						}
						if(key==83){//S
							RainbowDash.downPressed=true;
						}
						if(key==65){//A
							RainbowDash.leftPressed=true;
						}
						if(key==68){//D
							RainbowDash.rightPressed=true;
							
						}
					}
					window.onkeyup = function(e) {

						var key = e.keyCode ? e.keyCode : e.which;
						if(key==68){//D
							RainbowDash.rightPressed=false;
							
							
						}
						if(key==87){//W
							RainbowDash.upPressed=false;
							}
						if(key==83){//S
							RainbowDash.downPressed=false;
						}
						if(key=65){//A
							RainbowDash.leftPressed=false;
							
						}
						
					}

				
					
					
					
				