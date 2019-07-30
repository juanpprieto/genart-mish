// DOC https://github.com/mattdesl/canvas-sketch/blob/master/docs/api.md
const canvasSketch = require('canvas-sketch');
// use degress instead of radians
const radians = require('degrees-radians');

// https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/math.md#lerp
const { lerp } = require('canvas-sketch-util/math')

// https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/random.md
const random = require('canvas-sketch-util/random')

const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [ 2048, 2048 ], // or... 'A4', 'letter', 'postcard',
  // pixelsPerInch: 300 // For print.
  // units: 'cm',
  // orientation: 'landscape'
};

const sketch = () => {
  // Local state
  const maxColors = random.rangeFloor(1,4);
  console.log('maxColors', maxColors)
  const singlePalette = random.shuffle(random.pick(palettes)).slice(0, maxColors)
  console.log(singlePalette)

  const randomSeed = true;
  const noiseRadius = false;
  let currentSeed = null;
  const randomGrid = true;
  const margin = 300;

  const cellType = 'text'; // 'circle', 'text
  const radiusSeed = {text: 90, circle: .05 }
  const cellsCount = {text: 200, circle: 100 }
  const seeds = {text: 674846, circle: 256 }

  // Random with state with deterministic seed. Ensure a randomness config. i.e to avoid new random on every page load.
  if (randomSeed) {
    // Set an initial random seed
    random.setSeed(random.getRandomSeed());
    currentSeed = random.getSeed();
    // Log it for later reproducibility
    console.log('Random seed: %s', currentSeed);
    console.log('current seed', currentSeed)
  } else {
    // save on refresh.
    random.setSeed(seeds[cellType]); //316679 // 756410 | ["#355c7d", "#f8b195"]
  }

  const createGrid = (cells) => {
    const points = [];

    // x-dimension
    for (let x = 0; x < cells; x++ ) {
      for (let y = 0; y < cells; y++) {
        // u v coordinates (0,0 to 1,1)
        const u = cells <= 1 ? .5 : x / (cells - 1);
        const v =  cells <= 1 ? .5 : y / (cells - 1);
        const r = noiseRadius ? Math.abs(random.noise2D(u,v)) * radiusSeed[cellType] : Math.abs(.01 - (random.gaussian() * radiusSeed[cellType])); // Gaussian distribution -3.5 to 3.5;
        points.push(
          {
            fill: random.pick(singlePalette),
            position: [u, v],
            rotation: random.rangeFloor(1,8),
            radius: r, // Gaussian distribution -3.5 to 3.5
          }
        );
      }
    }
    return points
  }

  // Generate Grid
  let points;
  if (randomGrid) points = createGrid(cellsCount[cellType]).filter((cell) => random.value() < .5);
  else points = createGrid(cellsCount[cellType]);

  // Render function
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // if testing random seeds, show the current seed in case we want to save it.
    if (randomSeed) {
      context.font = '70px serif';
      context.fillStyle = 'black';
      console.log('fillText', currentSeed)
      context.fillText(`Seed: ${currentSeed}`, 80, 140);
    }

    points.forEach(data => {

      const {
        position,
        radius,
        rotation,
        fill
      } = data;

      const [u , v] = position;

      // lerp is used to create the margin by interpolating the values of the u/v coordinate.
      // i.e push/scale the grid inwards by the margin. see doc
      let x = lerp(margin, width - margin, u);
      let y = lerp(margin, height - margin, v);

      if (cellType === 'circle'){
        context.beginPath();
        context.arc(x, y, radius * width, 0, radians(360), false);
        context.fillStyle = fill;
        context.linearWidth = 0;
        context.fill();
      } else if (cellType === 'text') {
        context.font = `${radius}px serif`;
        context.fillStyle = fill;
        context.rotate(rotation);
        context.fillText('=', x, y);
      } else {

      }

    })
  };
};

canvasSketch(sketch, settings);