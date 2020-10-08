class Ball {
  float xposition;
  float yposition;
  float xspeed;
  float yspeed;
  color c;
  int diameterBall=32;
  int radiusBall=diameterBall / 2;
 
  Ball(float xpos, float ypos, float xsp, float ysp, color c1) {
    xposition = xpos;
    yposition = ypos;
    xspeed = xsp;
    yspeed = ysp;
    c = c1;
    ysp = 2;
    xsp = 2;
  }
  void move() {
    xposition = xposition + xspeed*3;
    yposition = yposition + yspeed*3;
  }
  void bounce() {
    if ((xposition > width-radiusBall) || (xposition < radiusBall)) {
      xspeed = xspeed *  -1;
    }
    if ((yposition > height-radiusBall) || (yposition < radiusBall)) {
      yspeed = yspeed * -1;
    }
    if (yposition >=750) {
      frameRate(0);
      textSize(40);
      text("GAME OVER!", width/2-150, height/2);
    }
    if ((yposition >  670) && ((xposition < mouseX+50)&&(xposition > mouseX-50))) {
      yspeed = yspeed * -1;
    } 
  }
  void display() {
    stroke(0);
    fill(c);
    ellipse(xposition, yposition, diameterBall, diameterBall);
  } 
}
