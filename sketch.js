// Polar Perlin Noise Loop
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/136-polar-perlin-noise-loops.html
// https://youtu.be/ZI1dmHv3MeM
// https://editor.p5js.org/codingtrain/sketches/sy1p1vnQn

// https://github.com/jwagner/simplex-noise.js/blob/main/README.md
// import { createNoise3D } from "https://cdn.skypack.dev/simplex-noise@4.0.0";
import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let phase = 0;
let zoff = 0;
let slider;

// store previous values of shape to calculate distance

let circumference;

let desiredLength;

const sliderRange = 7;
const steps = 100;
const stringWeight = 10;
const stringGap = 3;
const stringSize = 0.7;

let animate = true;

// var noisy = SimplexNoise;
// console.log("simple", SimplexNoise(10));

new p5((p5) => {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.SVG);
    desiredLength = Math.min(p5.width, p5.height) * p5.PI * stringSize;

    slider = p5.createSlider(
      0,
      sliderRange,
      p5.random(sliderRange),
      sliderRange / steps
    );
    slider.addClass("slider");
    slider.position(10, p5.height - 30);
    slider.style("width", p5.width - 25 + "px");
    slider.input(() => {
      p5.redraw();
    });

    // p5.noLoop();
  };

  p5.draw = () => {
    p5.clear();
    circumference = 0;
    let prevX, prevY;
    p5.translate(p5.width / 2, p5.height / 2 - 50);
    p5.stroke(0);
    p5.strokeWeight(stringWeight);
    p5.strokeCap(p5.ROUND);
    p5.noFill();

    let shapeArray = [];

    let noiseMax = slider.value();
    for (
      let a = phase;
      a < p5.TWO_PI + phase - p5.radians(stringGap);
      a += p5.radians(1)
    ) {
      let xoff = p5.map(p5.cos(a + phase), -1, 1, 0, noiseMax);
      let yoff = p5.map(p5.sin(a + phase), -1, 1, 0, noiseMax);

      //   simplex;
      let r = p5.map(
        noise3D(xoff, yoff, zoff),
        -1,
        1,
        p5.width / 4,
        p5.width / 2
      );

      //perlin
      // let r = p5.map(
      //   p5.noise(xoff, yoff, zoff),
      //   0,
      //   1,
      //   p5.width / 4,
      //   p5.width / 2
      // );

      let x = r * p5.cos(a);
      let y = r * p5.sin(a);

      shapeArray.push([x, y]);

      if (prevX && prevY) {
        circumference += p5.dist(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;
    }
    p5.scale(desiredLength / circumference);
    p5.beginShape();
    shapeArray.forEach((point) => p5.vertex(point[0], point[1]));
    p5.endShape();
    if (animate) {
      phase += 0.003;
      zoff += 0.001;
    }
  };

  p5.mousePressed = (event) => {
    if (event.target.className === "slider") return;
    animate = !animate;
    if (animate) {
      p5.loop();
    } else {
      p5.noLoop();
    }
  };

  // trigger svg save
  p5.keyTyped = () => {
    if (p5.key === "s") {
      downloadSvg();
    }
  };

  // save svg
  function downloadSvg() {
    let svgElement = document.getElementsByTagName("svg")[0];
    let svg = svgElement.outerHTML;
    let file = new Blob([svg], { type: "plain/text" });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);

    a.href = url;
    a.download = "circles.svg";
    document.body.appendChild(a);
    a.click();

    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
});
