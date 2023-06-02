let penSize = 10;
let penState = 0;
let penColor = 0;

let secondsColorR = 0;
let secondsColorG = 0;
let secondsColorB = 0;

let drawingCanvas, saveImage;
let drawingCommands = [];

let timerStart = 41;
let timerLength = 1000;
let timerCount = 41;

let mirrorZoom = 1;
let boardZoom = 1;

let x = 0;
let y = 0;

let confirmButton;
let clearButton;
let gridButton;
let restartButton;

let gridVisible = false;
let pattern;

let state;
let stateStartMillis;

const GRID_SIZE = 5;
const MAX_OPTIONS = GRID_SIZE * GRID_SIZE;
let screenshots = [];
let currentOption = 0;

function setup() {
  drawingCanvas = createCanvas(windowWidth - 1, windowHeight - 1);
  background(255);

  //Set the initial state to beginning
  setState(stateStart);

  //Confirm choice of pattern
  confirmButton = createButton("Start!");
  confirmButton.position(width / 2 - 40, height / 2 + 15);
  confirmButton.mousePressed(confirmStart);
  confirmButton.class("button-style");

  //Clear the screen button
  clearButton = createButton("Clear");
  clearButton.position(-100, -100);
  clearButton.mousePressed(clearDrawing);
  clearButton.class("button-style");

  //Grid option
  gridButton = createButton("Grid");
  gridButton.position(-100, -100);
  gridButton.mousePressed(viewGrid);
  gridButton.class("button-style");

  //Restart
  restartButton = createButton("Restart");
  restartButton.mousePressed(restartDrawing);
  restartButton.class("button-style");
}

function draw() {
  state();
}

function setState(newState) {
  state = newState;
  stateStartMillis = millis();
}

function stateStart() {
  restartButton.position(-100, -100);
  background(255);
  fill(0);
  noStroke();
  textSize(25);
  let introText1 = "Draw a pattern on the white canvas";
  let introWidth1 = textWidth(introText1);
  text(introText1, width / 2 - introWidth1 / 2, height / 2 - 80);
  textSize(20);
  let introText2 = "Make sure to use the entire screen";
  let introWidth2 = textWidth(introText2);
  text(introText2, width / 2 - introWidth2 / 2, height / 2 - 30);
  let introText3 = "Click the button to start the experience";
  let introWidth3 = textWidth(introText3);
  text(introText3, width / 2 - introWidth3 / 2, height / 2);
  confirmButton.position(width / 2 - 40, height / 2 + 30);
}

function stateEdit() {
  //Line coordinates
  var px = pmouseX,
    py = pmouseY,
    x = mouseX,
    y = mouseY;

  if (millis() - timerStart > timerLength) {
    timerCount--;
    timerStart = millis();
  }
    if (timerCount <= 10 && 0 <= timerCount) {
    secondsColorR = 255;
  }

  if (
    (timerCount <= 25 && timerCount > 20) ||
    (timerCount <= 10 && 0 <= timerCount)
  ) {
    //Mirrored drawing
    if (
      currentOption == 0 ||
      currentOption == 6 ||
      currentOption == 12 ||
      currentOption == 18 ||
      currentOption == 24
    ) {
      px = width - mouseX;
      py = height - mouseY;
      x = width - pmouseX;
      y = height - pmouseY;
    }
    //Offset
    else if (
      currentOption == 4 ||
      currentOption == 5 ||
      currentOption == 11 ||
      currentOption == 17 ||
      currentOption == 23
    ) {
      py = pmouseY - 100;
      px = pmouseX - 100;
      y = mouseY - 100;
      x = mouseX - 100;
    }
    //Pen to eraser
    else if (
      currentOption == 1 ||
      currentOption == 7 ||
      currentOption == 13 ||
      currentOption == 19 ||
      currentOption == 20
    ) {
      penColor = 255;
      penSize = 14;
    }
    //Line to spotted
    else if (
      currentOption == 2 ||
      currentOption == 8 ||
      currentOption == 14 ||
      currentOption == 15 ||
      currentOption == 21
    ) {
      setLineDash([15, 15]);
    }
    //Delay
    else if (
      currentOption == 3 ||
      currentOption == 9 ||
      currentOption == 10 ||
      currentOption == 16 ||
      currentOption == 22
    ) {
      if (timerCount % 2) {
        py = pmouseY - 20;
      } else {
        py = pmouseY;
      }
    }
  }

  //Timer countdown
  if (timerCount < 42 && 0 <= timerCount) {
    //Top banner with text and timer
    noStroke();
    fill(255);
    rect(0, 0, width, 50);
    fill(0);
    textSize(18);
    text("Draw a pattern", width / 2 - 70, 23);
    textSize(12);
    text("Time left:", width / 2 - 80, 42);
    fill(secondsColorR, secondsColorG, secondsColorB);
    text(timerCount, width / 2 - 10, 42);
    fill(0);
    text("seconds", width / 2 + 10, 42);
    //Draw line
    if (mouseIsPressed) {
      if (y > 50) {
        stroke(penColor);
        strokeWeight(penSize);
        line(px, py, x, y);
        // Store drawing commands
        drawingCommands.push([px, py, x, y]);
      }
    }
  }

  if (timerCount < 0) {
    penColor = 0;
    penSize = 10;
    if (timerCount > -5) {
      noStroke();
      fill(255);
      rect(0, 0, width, 50);
      secondsColorR = 255;
      fill(0);
      textSize(18);
      text("Draw a pattern", width / 2 - 70, 23);
      textSize(12);
      text("Time left:", width / 2 - 80, 42);
      fill(secondsColorR, secondsColorG, secondsColorB);
      text(0, width / 2 - 10, 42);
      fill(0);
      text("seconds", width / 2 + 10, 42);
    }
  }
}

function stateRevealMirror() {
  gridButton.position(-100, -100);
  clearButton.position(-100, -100);
  scale(mirrorZoom);
  translate(0, 0);
  background(255);
  for (let i = 0; i < drawingCommands.length; i++) {
    let [px, py, x, y] = drawingCommands[i];
    stroke(penColor);
    strokeWeight(penSize);
    setLineDash([0, 0]);
    line(px, py, x, y);
    line(width * 2 - x, y, width * 2 - px, py);
    line(x, height * 2 - y, px, height * 2 - py);
    line(width * 2 - x, height * 2 - y, width * 2 - px, height * 2 - py);
  }
  if (mirrorZoom > 0.5) {
    mirrorZoom *= 0.995;
  } else if (mirrorZoom <= 0.5) {
    pattern = get(0, 0, width, height);
  }
}

function stateRevealBoard() {
  if (currentOption == MAX_OPTIONS) {
    restartLoop();
  }
  drawGrid();
}

//Clear drawing
function clearDrawing() {
  if (drawingCommands.length > 0) {
    // Clear the canvas
    background(255);
    drawingCommands.length = 0;
  }
  if (timerCount <= 35) {
    clearButton.position(-100, -100);
  }
}

//View grid
function viewGrid() {
  stroke(255, 100, 100);
  strokeWeight(1);

  const gridSize = 80;
  const gridLinesX = width / gridSize;
  const gridLinesY = height / gridSize;

  if (!gridVisible) {
    if (timerCount > 20) {
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
      stroke(penColor);
      strokeWeight(penSize);
      line(px, py, x, y);
      gridVisible = false;
    }
  }
}

//Confirm starting drawing
function confirmStart() {
  background(255);
  clearButton.position(10, 10);
  gridButton.position(90, 10);
  confirmButton.position(-100, -100);
  state = stateEdit;
}

function mousePressed(){
      if (timerCount <= 20) {
    clearButton.position(-100, -100);
  }
}

function mouseClicked() {
  if (dist(mouseX, mouseY, width - 100, 0) <= 100) {
    if (timerCount < -5) {
      state = stateRevealMirror;
    }
    if (mirrorZoom <= 0.5) {
      state = stateRevealBoard;
      if (currentOption < MAX_OPTIONS) {
        takeScreenshot();
      }
    }
  }
}

function takeScreenshot() {
  screenshots[currentOption] = get(0, 0, width, height);
  image(pattern, 0, 0, width, height);
  currentOption++;
  //pattern.save('pattern', 'png');
  //print();
}

function drawGrid() {
  const gridWidth = width / GRID_SIZE;
  const gridHeight = height / GRID_SIZE;
  let screenshotWidth = width;
  let screenshotHeight = height;
  let optionIndex = 0;
  background(255);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const screenshot = screenshots[optionIndex];
      if (screenshot) {
        image(screenshot, x * gridWidth, y * gridHeight, gridWidth, gridHeight);
      }
      optionIndex++;
      if (mouseIsPressed) {
        restartButton.position(width / 2 - 40, height / 2);
      }
    }
  }
}

function restartLoop() {
  currentOption = 0;
}

function restartDrawing() {
  secondsColorR = 0;
  secondsColorG = 0;
  secondsColorB = 0;

  penColor = 0;
  penSize = 10;

  drawingCommands = [];
  setLineDash([0, 0]);

  timerStart = 41;
  timerLength = 1000;
  timerCount = 41;

  mirrorZoom = 1;

  x = 0;
  y = 0;

  gridVisible = false;

  state = stateStart;
}

function touchMoved() {
  //Prevent scrolling and refreshing screen
  return false;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}
