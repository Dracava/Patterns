let penSize = 3;
let penState = 0;
let penColor = 0;

let secondsColorR = 0;
let secondsColorG = 0;
let secondsColorB = 0;

let drawingCanvas, saveImage;
let drawingCommands = [];

let timerStart = 40;
let timerLength = 1000;
let timerCount = 40;

let sf = 1;
let x = 0;
let y = 0;

let confirmButton;
let clearButton;
let gridButton;

let gridVisible = false;

// to call the following functions:
// stateStart(), stateEdit(), stateShowPattern(), stateZoomOut(), stateZoomIn()
let state;
// the start time of the current state
let stateStartMillis;

function setup() {
  drawingCanvas = createCanvas(windowWidth - 1, windowHeight - 1);
  background(255);

  //Set the initial state to beginning
  setState(stateStart);

  //Timer
  let timerValue = 40;

  //Confirm choice of pattern
  confirmButton = createButton("Start!");
  confirmButton.position(width / 2 - 40, height / 2 + 15);
  confirmButton.mousePressed(confirmStart);
  confirmButton.class("button-style");

  //Clear the screen button
  clearButton = createButton("Clear");
  clearButton.position(windowWidth + 100, windowHeight + 100);
  clearButton.mousePressed(clearDrawing);
  clearButton.class("button-style");

  //Grid option
  gridButton = createButton("Grid");
  gridButton.position(windowWidth + 100, windowHeight + 100);
  gridButton.mousePressed(viewGrid);
  gridButton.class("button-style");
}

function draw() {
  state();
}

function setState(newState) {
  // setting the state updates the state variable with the given function
  state = newState;
  // and recording the start of the new state
  stateStartMillis = millis();
}

function stateStart() {
  fill(0);
  noStroke();
  textSize(25);
  let introText1 = "Draw a pattern on the white canvas.";
  let introText2 = "Click the button to start the experience.";
  let introWidth1 = textWidth(introText1);
  let introWidth2 = textWidth(introText2);
  text(introText1, width / 2 - introWidth1 / 2, height / 2 - 50);
  text(introText2, width / 2 - introWidth2 / 2, height / 2 - 20);
}

function stateEdit() {
  //Top banner with text and timer
  noStroke();
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(12);
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

  if (timerCount < 20 && timerCount > 10) {
    py = pmouseY - 100;
    px = pmouseX - 100;
    y = mouseY - 100;
    x = mouseX - 100;
  } else if (timerCount <= 10 && timerCount > 0) {
    secondsColorR = 255;
    if (pmouseX < width && mouseX < width) {
      if (pmouseY < height && mouseY < height) {
        px = pmouseY;
        py = pmouseX;
        x = mouseY;
        y = mouseX;
      }
    }
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

  if (timerCount < 0 && timerCount > -10) {
    strokeWeight(1);
    fill(255);
    rect(0, 0, width, 50);
    secondsColorR = 255;
    fill(0);
    noStroke();
    text("Draw a pattern.", width / 2 - 50, 20);
    text("Time left:", width / 2 - 80, 40);
    fill(secondsColorR, secondsColorG, secondsColorB);
    text("0", width / 2 - 10, 40);
    fill(0);
    text("seconds", width / 2 + 10, 40);
  }
  if (timerCount <= -10) {
    scale(sf);
    translate(0, 0);
    translate();
    background(255);
    for (let i = 0; i < drawingCommands.length; i++) {
      let [px, py, x, y] = drawingCommands[i];
      stroke(0);
      strokeWeight(penSize);
      line(px, py, x, y);
      line(width * 2 - x, y, width * 2 - px, py);
      line(x, height * 2 - y, px, height * 2 - py);
      line(width * 2 - x, height * 2 - y, width * 2 - px, height * 2 - py);
    }
  }
  if (timerCount <= -11 && sf > 0.5) {
    sf *= 0.995;
  } else if (sf == 0.5) {
    //saveCanvas = drawingCanvas.get(0,50,width,height-50);
    //saveCanvas.save('pattern', 'png');

    if (mouseIsPressed) {
      state = stateReveal;
    }
  }
}

function stateReveal() {
  background(0);
}

//Clear drawing
function clearDrawing() {
  if (drawingCommands.length > 0) {
    // Clear the canvas
    background(255);
    drawingCommands.length = 0;
  }
  if (timerCount < 35) {
    clearButton.position(windowWidth + 100, windowHeight + 100);
  }
}

//View grid
function viewGrid() {
  stroke(255, 100, 100);
  strokeWeight(1);

  const gridSize = 100;
  const gridLinesX = width / gridSize;
  const gridLinesY = height / gridSize;

  if (!gridVisible) {
    if (timerCount > 30) {
      for (let i = 0; i < gridLinesY; i++) {
        const y = i * gridSize;
        line(0, y, width, y);
      }
      for (let i = 0; i < gridLinesX; i++) {
        const x = i * gridSize;
        line(x, 50, x, height);
      }
      gridVisible = true;
    } else {
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          if (random() < 0.5) {
            line(x, y, x + gridSize, y + gridSize);
          } else {
            line(x + gridSize, y, x, y + gridSize);
          }
        }
      }
      gridVisible = true;
    }
  } else {
    background(255);
    for (let i = 0; i < drawingCommands.length; i++) {
      let [px, py, x, y] = drawingCommands[i];
      stroke(0);
      strokeWeight(penSize);
      line(px, py, x, y);

      if (timerCount < 30) {
        gridButton.position(windowWidth + 100, windowHeight + 100);
      }
      gridVisible = false;
    }
  }
}

//Confirm starting drawing
function confirmStart() {
  background(255);
  clearButton.position(10, 10);
  gridButton.position(90, 10);
  confirmButton.position(windowWidth + 100, windowHeight + 100);
  state = stateEdit;
}

function touchMoved() {
  // prevent default
  return false;
}
