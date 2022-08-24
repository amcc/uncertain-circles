// Polar Perlin Noise Loop
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/136-polar-perlin-noise-loops.html
// https://youtu.be/ZI1dmHv3MeM
// https://editor.p5js.org/codingtrain/sketches/sy1p1vnQn

let phase = 0;
let zoff = 0;
let slider;

// store previous values of shape to calculate distance

let circumference;

let desiredLength;

const sliderRange = 4;
const steps = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, SVG);
  desiredLength = Math.min(width, height) * PI * 0.7;
  console.log(width, height, Math.min(width, height));

  slider = createSlider(0, sliderRange, 0, sliderRange / steps);
  slider.position(10, height - 30);
  slider.style("width", width - 25 + "px");
  slider.input(() => {
    resetValues();
    redraw();
  });

  resetValues();
  noLoop();
}

function draw() {
  clear();
  circumference = 0;
  let prevX, prevY;
  translate(width / 2, height / 2 - 50);
  stroke(0);
  strokeWeight(1);
  strokeCap(ROUND);
  noFill();

  let shapeArray = [];

  let noiseMax = slider.value();
  for (let a = phase; a < TWO_PI + phase - radians(3); a += radians(1)) {
    let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff, zoff), 0, 1, 100, width / 2);
    let x = r * cos(a);
    let y = r * sin(a);

    shapeArray.push([x, y]);

    if (prevX && prevY) {
      circumference += dist(prevX, prevY, x, y);
    }

    prevX = x;
    prevY = y;
  }
  scale(desiredLength / circumference);
  beginShape();
  shapeArray.forEach((point) => vertex(point[0], point[1]));
  endShape();
  // phase += 0.003;
  // zoff += 0.001;
}

function resetValues() {
  circumference = 0;
}
