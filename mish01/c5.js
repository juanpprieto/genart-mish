// Dotted circle

const { lerp } = require('canvas-sketch-util/math')
const radians = require('degrees-radians');
const random = require('canvas-sketch-util/random')
const CONFIG = require('./config');

const genC5data = (settings) => {
  let points = [];
  let desiredRadianAngleOnCircle = 0;

  let {
    dots,
    dotRadius,
    radius,
    position,
    color,
  } = settings;

  const { x, y } = position;

  const interval = ((radians(360)) / dots);
  desiredRadianAngleOnCircle += interval;

  for (let i = 0; i < dots; i++) {
    desiredRadianAngleOnCircle = interval*i;
    // dots along circle
    u = x + radius*1.5*Math.cos(desiredRadianAngleOnCircle);
    v = y + radius*Math.sin(desiredRadianAngleOnCircle);
    points.push(
      {
        fill: color,
        position: [u, v],
        radius: random.range(dotRadius -= dotRadius *.05, dotRadius += dotRadius*.05), // Gaussian distribution -3.5 to 3.5
      }
    );
  }
  return points;
}

const drawC5 = (context, width, height, data)  => {
  console.warn('drawDottedCircleData')
  return new Promise((resolve, reject) => {
    data.forEach(element => {
      const {
        position,
        radius,
        fill
      } = element;

      const [u , v] = position;

      let x = lerp(CONFIG.project.margin, width - CONFIG.project.margin, u);
      let y = lerp(CONFIG.project.margin, height - CONFIG.project.margin, v);
      context.globalCompositeOperation = 'source-over'
      context.beginPath();
      context.arc(x, y, radius * width, 0, radians(360));
      context.closePath();
      context.fillStyle = fill;
      context.fill();

      

      //reset context
      context.globalCompositeOperation = 'source-over'

      resolve()
    });
  })
};


module.exports = {
  genC5data,
  drawC5
}