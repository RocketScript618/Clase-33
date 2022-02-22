const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg, waterSound, backgroundMusic, cannonExplosion;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var isGameOver = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
 brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");

  backgroundMusic = loadSound("assets/background_music.mp3");
  cannonExplosion = loadSound("assets/cannon_explosion.mp3");
  pieratSound = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 110, 50, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
 var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play();

    backgroundMusic.setVolume(0.1);
  }

  Engine.update(engine);
  ground.display();

  showBoats();

  
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);

    for(var a = 0; a < boats.length; a++){
      if(balls[i] !== undefined && boats[a] !== undefined){
        var collission = Matter.SAT.collides(balls[i].body,boats[a].body);
        if(collission.collided){
          boats[a].remove(a);
          Matter.World.remove(world,balls[i].body);
          balls.splice(i,1);
          i--

          
        }
      }
    }
  }

  cannon.display();
  tower.display();


}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


//function to show the boat
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();

      var Tcollission = Matter.SAT.collides(tower.body,boats[i].body);
      if(Tcollission.collided && !boats[i].isBroken){

        if(!pieratSound.isPlaying()){
          pieratSound.play();
      
          pieratSound.setVolume(0.5);
        }
        isGameOver = true;
        gameOver();
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}


//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    cannonExplosion.play();
  }
}

function gameOver(){
  swal({
    title:"Fin del juego", 
    confirmButtonText: "Jugar de nuevo"
  },
  function(isConfirmed){
    if(isConfirmed){
      location.reload();
    }
  })
}