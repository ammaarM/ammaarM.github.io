Ball ball;
Paddle Paddle;
ArrayList brickslist;

void setup() {
  size(1024, 768);
  background(0);
  noCursor();
  smooth();
  
  ball = new Ball (175, 420, 1, 2, color(random(255), random(255), random(255)));
  rectMode(CENTER);
  Paddle = new Paddle (height, 120, 30);

  brickslist = new ArrayList();
  for (int x = 1; x<=9; x++) {
    for (int y = 1; y<=4; y++) {
      brickslist.add(new Bricks (x*100+15, y*40+20, 90, 30));
    } 
  }
}

void draw() {
  background(0);
  ball.move();

  for (int i = brickslist.size()-1; i>=0; i--) {
    Bricks SingleBrick = (Bricks) brickslist.get(i);
    if (SingleBrick.collide( ball.xposition, ball.yposition, ball.radiusBall ) ) {
      ball.yspeed = ball.yspeed * -1;
      brickslist.remove(i);
    }
  }
  
  ball.bounce();
  ball.display();
  for (int i = brickslist.size()-1; i>=0; i--) {
    Bricks SingleBrick = (Bricks) brickslist.get(i);
    SingleBrick.display();
  }
  
  Paddle.move();
  Paddle.display();
}
