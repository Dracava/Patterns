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

let rightButton;
let leftButton;
let confirmButton;
let clearButton;
let gridButton;

let gridVisible = false;

let imagePattern0, imagePattern1, imagePattern2, imagePattern3;
let imageArray = [];
let currentPicture = 0;

// to call the following functions:
// stateStart(), stateEdit(), stateShowPattern(), stateZoomOut(), stateZoomIn()
let state;
// the start time of the current state
let stateStartMillis;

function preload() {
  imagePattern0 = loadImage("images/pattern0.png");
  imagePattern1 = loadImage("images/pattern1.png");
  imagePattern2 = loadImage("images/pattern2.jpeg");
  imagePattern3 = loadImage("images/pattern3.jpeg");
}

function setup() {
  drawingCanvas = createCanvas(windowWidth - 1, windowHeight - 1);
  background(255);

  //Set the initial state to beginning
  setState(stateStart);

  //Timer
  let timerValue = 40;

  //Arrow buttons to select pattern
  leftButton = createButton(">");
  leftButton.position(width - 50, height / 2 - 15);
  leftButton.mousePressed(nextImage);
  rightButton = createButton("<");
  rightButton.position(50, height / 2 - 15);
  rightButton.mousePressed(previousImage);

  //Confirm choice of pattern
  confirmButton = createButton("Confirm background");
  confirmButton.position(width / 2 - 40, height / 2 + 15);
  confirmButton.mousePressed(confirmChoice);

  //Clear the screen button
  clearButton = createButton("Clear");
  clearButton.position(windowWidth + 100, windowHeight + 100);
  clearButton.mousePressed(clearDrawing);

  //Grid option
  gridButton = createButton("Grid");
  gridButton.position(windowWidth + 100, windowHeight + 100);
  gridButton.mousePressed(viewGrid);
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
  imageArray = [imagePattern0, imagePattern1, imagePattern2, imagePattern3];
  image(imageArray[currentPicture], 0, 0, width, height);
  fill(0);
  noStroke();
  let introText =
    "Either pick a pattern to trace over, or draw one on your own";
  let introWidth = textWidth(introText);
  text(introText, width / 2 - introWidth / 2, height / 2 - 20);
}

function stateEdit() {
  //Top banner with text and timer
  noStroke();
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(7);
  text("lol, fuck you", 14, 25);
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
    px = pmouseY;
    py = pmouseX;
    x = mouseY;
    y = mouseX;
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
    if (currentPicture != 0) {
      image(imageArray[currentPicture], 0, 0, width, height);
    }
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
    if (timerCount > 25) {
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
    if (currentPicture != 0) {
      image(imageArray[currentPicture], 0, 0, width, height);
    }
    for (let i = 0; i < drawingCommands.length; i++) {
      let [px, py, x, y] = drawingCommands[i];
      stroke(0);
      strokeWeight(penSize);
      line(px, py, x, y);

      if (timerCount < 20) {
        gridButton.position(windowWidth + 100, windowHeight + 100);
      }
      gridVisible = false;
    }
  }
}

//Confirm choice
function confirmChoice() {
  background(255);
  if (currentPicture != 0) {
    image(imageArray[currentPicture], 0, 0, width, height);
  }
  clearButton.position(10, 10);
  gridButton.position(70, 10);
  confirmButton.position(windowWidth + 100, windowHeight + 100);
  leftButton.position(windowWidth + 150, windowHeight + 10);
  rightButton.position(windowWidth + 100, windowHeight + 100);
  state = stateEdit;
}

function nextImage() {
  // Move to the next item in the array
  currentPicture = (currentPicture + 1) % imageArray.length;
}

function previousImage() {
  // Move to the previous item in the array
  currentPicture = (currentPicture - 1 + imageArray.length) % imageArray.length;
}

function touchMoved() {
  // prevent default
  return false;
}
