let penSize = 3;
let penState = 0;
let penColor = 0;

let secondsColorR = 0;
let secondsColorG = 0;
let secondsColorB = 0;

let drawingCanvas, saveImage;
let drawingCommands = [];

let timerStart = 9;
let timerLength = 1000;
let timerCount = 9;

let sf = 1; // scaleFactor
let x = 0; // pan X
let y = 0; // pan Y

function setup() {
  drawingCanvas = createCanvas(windowWidth, windowHeight);
  background(255);

  //Timer
  let timerValue = 9;
}

function draw() {
  //Top banner with text and timer
  strokeWeight(1);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  noStroke();
  text("Draw a pattern.", width / 2 - 50, 20);
  text("Time left:", width / 2 - 80, 40);
  fill(secondsColorR, secondsColorG, secondsColorB);
  text(timerCount, width / 2 - 10, 40);
  fill(0);
  text("seconds", width / 2 + 10, 40);

  //Line coordinates
  var px = pmouseX,
    py = pmouseY,
    x = mouseX,
    y = mouseY;

  if (millis() - timerStart > timerLength) {
    timerCount--;
    timerStart = millis();
  }

  //Timer countdown
  if (timerCount < 60 && timerCount > 0) {
    //Draw line
    if (mouseIsPressed) {
      if (y > 50) {
        stroke(0);
        strokeWeight(penSize);
        line(px, py, x, y);
        // Store drawing commands
        drawingCommands.push([px, py, x, y]);
      }
    }
  }

  if (timerCount < 60 && timerCount > 30) {
    //Button clear
    let clearButton = createButton("Clear");
    clearButton.position(10, 10);
    clearButton.mousePressed(clearDrawing);
  }
  //Pensize changes after certain amount of time
  if (timerCount < 10) {
    //penSize = 4;
    secondsColorR = 255;
  }
  //Offset changes after certain amount of time
  if (timerCount < 5) {
    //(px = pmouseX - 30), (py = pmouseY), (x = mouseX - 30), (y = mouseY);
  }

  if (timerCount < 0 && timerCount > -3) {
    strokeWeight(1);
    fill(255);
    rect(0, 0, width, 50);
    fill(0);
    noStroke();
    text("Draw a pattern.", width / 2 - 50, 20);
    text("Time left:", width / 2 - 80, 40);
    fill(255, 0, 0);
    text("0", width / 2 - 10, 40);
    fill(0);
    text("seconds", width / 2 + 10, 40);

  }
  if (timerCount <= -3) {
  scale(sf);
  translate(0, 0);
  translate();
  background(255);
  for (let i = 0; i < drawingCommands.length; i++) {
    let [px, py, x, y] = drawingCommands[i];
    stroke(0);
    strokeWeight(penSize);
    line(px, py, x, y);
    line(width*2 - x, y, width*2 - px, py);
    line(x, height*2 - y, px, height*2 - py);
    line(width*2 - x, height*2 - y, width*2 - px, height* 2 - py);
  }
  if (timerCount <= -4 && sf > 0.5) {
    sf *= 0.995;
    }
    else if(sf == 0.5){
    //saveCanvas = drawingCanvas.get(0,50,width,height-50);
    //saveCanvas.save('pattern', 'png');
    }    
}

//Clear drawing
function clearDrawing() {
  if (drawingCommands.length > 0) {
    // Remove the last drawing command
    let [px, py, x, y] = drawingCommands.pop();

    // Clear the canvas
    background(255);
  }
}

//Redo drawing
function redoDrawing() {
  translate(0, 0);
  scale(sf);
  translate(0, 0);
  translate();
  }
}

