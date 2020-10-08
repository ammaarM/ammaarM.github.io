class Paddle {
  float xpos;
  float hgt;
  float wdth;
  
  Paddle(float tempXpos, float tempWdth, float tempHgt) {
    xpos = tempXpos;
    hgt = tempHgt;
    wdth = tempWdth;
  }
  
  void display() {
    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(mouseX, 700, 120, 20);
  }
  
  void move() {
    //constrain(xpos, 0+(hgt/2), 400-(hgt/2));
    xpos = mouseX;
  }
}
