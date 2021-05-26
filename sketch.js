var dog, happyDog, database, foodS, foodStock, firebase, fedTime, lastFed;
var gameState=2
var currentTime;

function preload(){
	thedog = loadImage('images/dogImg.png');
  happyDog = loadImage('images/dogImg1.png')
  bedroom=loadImage('images/BedRoom.png')
  washroom=loadImage('images/WashRoom.png')
  garden=loadImage('images/Garden.png')
  milkImg=loadImage('images/Milk.png')
  livingroom=loadImage('images/LivingRoom.png')
  garden=loadImage('images/Garden.png')
}

function setup() {
  database=firebase.database()
	createCanvas(displayWidth,displayHeight);
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  gameStateRef=database.ref('gameState')
    gameStateRef.on("value",function(data){
      gameState=data.val()
  })

  foodButton=createButton("Add Food");
  foodButton.position(500,125)

  foodButton.mousePressed(addFood)

  feedButton=createButton("Feed the Dog");
  feedButton.position(400,125)

  feedButton.mousePressed(feedDog)

  dog=createSprite(850,250,10,10);
  dog.addImage(thedog)
  dog.scale=0.5;

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  food=new Food()
  currentTime=hour();
  milk=createSprite(620,220);
  milk.addImage(milkImg);
  milk.scale=0.075
}

function draw() {  
  background(46, 139, 87);
  drawSprites();
  textSize(15);
  fill('white')
  text("Food left: "+foodS,250,475);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + "PM",350,30)
  }
  else if(lastFed===0){
    text("Last Feed: " + 12 + "AM",350,30)
  } 
  else {
    text("Last Feed: " + lastFed + "AM",350,30)
  }

  food.display()

  /*
  if(gameState!=="hungry"){
    feedButton.hide();
    foodButton.hide();
    dog.remove()
  }
  else {
    feedButton.show()
    foodButton.show()
    feedButton.mousePressed(feedDog)
    dog.addImage(thedog)
  }

  if(currentTime===lastFed+1){
    food.garden();
    updateState("playing")
  }
  else if(currentTime===lastFed+2){
    food.bedroom()
    updateState("sleeping")
  }
  else if(currentTime>lastFed+2 && currentTime<=lastFed+4){
    food.washroom()
    updateState("bathing")
  }
  else {
    food.display();
    updateState("hungry");
  }
  */

  if(foodS==0){
    dog.addImage(happyDog)
    milk.visible=false
  }
  else{
    dog.addImage(thedog);
    milk.visible=true;
  }

  if(gameState===1){
    dog.addImage(happyDog);
    dog.scale=0.5;
    dog.y=250;
    updateState(1)
  }
  if(gameState===2){
    dog.addImage(thedog);
    dog.scale=0.5;
    milk.visible=false;
    dog.y=250
    updateState(2)
  }

  var bath = createButton("I want to take bath");
  bath.position(580,125);
  bath.mousePressed(function(){
    gameState=3;
    database.ref('/').update({
      'gameState':gameState
    })
  })

  if(gameState===3){
    dog.addImage(washroom)
    dog.scale=1;
    milk.visible=false
    dog.y=250
    updateState(3)
  }

  var sleep = createButton("I want to sleep");
  sleep.position(710,125);
  sleep.mousePressed(function(){
    gameState=4;
    database.ref('/').update({
      'gameState':gameState
    })
  })

  if(gameState===4){
    dog.addImage(bedroom);
    dog.scale=1;
    milk.visible=false;
    updateState(4)
  }

  var play = createButton("Let's PLAY");
  play.position(500,160);
  play.mousePressed(function(){
    gameState=5;
    database.ref('/').update({
      'gameState':gameState
    })
  })

  if(gameState===5){
    dog.addImage(livingroom);
    dog.scale=1;
    milk.visible=false;
    updateState(5)
  }

  var thegarden = createButton("Let's PLAY in the garden");
  thegarden.position(585,160);
  thegarden.mousePressed(function(){
    gameState=6;
    database.ref('/').update({
      'gameState':gameState
    })
  })

  if(gameState===6){
    dog.addImage(garden);
    dog.scale=1;
    milk.visible=false;
    updateState(6)
  }
}

function readStock(data){
  foodS=data.val()
}

function addFood(){
  foodS++
  
  database.ref('/').update({
    Food:foodS
  });

  database.ref('/').update({
    Food: food.getFoodStock()
  })
}

function feedDog(){
  foodS--
  gameState=1;
  database.ref('/').update({
    Food:foodS,
    'gameState':gameState
  });

  food.updateFoodStock(food.getFoodStock()-1)
  database.ref('/').update({
    Food: food.getFoodStock(),
    FeedTime: hour()
  })
  
}

function writeStock(x){
  if(x<=0){
    x=0
  } else {
    x--;
  }

  database.ref('/').update({
    Food:x
  });
}

function updateState(state){
  database.ref('/').update({
      gameState: state
  })
}