const canvasSketch = require('canvas-sketch');
const radians = require('degrees-radians');
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const { genC6data, drawC6 } = require('./c6');
const { genC5data, drawC5 } = require('./c5');
const { genC4data, drawC4data } = require('./c4');
const { genSWdata, drawSWdata } = require('./soundWave');
const CONFIG = require('./config');

const settings = {
  dimensions: [3508, 4961], // 'A3', //3508, 4961
  // pixelsPerInch: 300 // For print.
};

// Generate shapes data
// CONFIG.shapes.dottedConcave.points = genDottedCircleConcaveData(CONFIG.shapes.dottedConcave.settings)
CONFIG.shapes.c4.points = genC4data(CONFIG.shapes.c4.settings)
CONFIG.shapes.c3.points = genC5data(CONFIG.shapes.c3.settings)
CONFIG.shapes.c2.points = genC5data(CONFIG.shapes.c2.settings)
CONFIG.shapes.c1.points = genC5data(CONFIG.shapes.c1.settings)
CONFIG.shapes.c5.points = genC5data(CONFIG.shapes.c5.settings)
CONFIG.shapes.c6.points = genC6data(CONFIG.shapes.c6.settings)
CONFIG.shapes.soundWave.points = genSWdata(CONFIG.shapes.soundWave.settings)

const sketch = () => {
  return ({ context, width, height }) => {
    // Rest canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // C4
    drawC4data(context, width, height, CONFIG.shapes.c4.points)
      .then(()=> {
        // drawing area
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#F9F9F9';
        context.fillRect(CONFIG.project.margin, CONFIG.project.margin, width - (CONFIG.project.margin*2), height - (CONFIG.project.margin*2));
        // C6
        return drawC6(context, width, height, CONFIG.shapes.c6.points);
      })
      .then(()=> {
        // C5
        return drawC5(context, width, height, CONFIG.shapes.c5.points);
      })
      .then(()=> {
        // C3
        return drawC5(context, width, height, CONFIG.shapes.c3.points);
      })
      .then(()=> {
        // C2
        return drawC5(context, width, height, CONFIG.shapes.c2.points);
      })
      .then(()=> {
        // C1
        return drawC5(context, width, height, CONFIG.shapes.c1.points);
      })
      .then(()=> {
        return drawSWdata(context, width, height, CONFIG.shapes.soundWave.points, CONFIG.shapes.soundWave.settings);
      })

  };
};

canvasSketch(sketch, settings);
