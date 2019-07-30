const { lerp } = require('canvas-sketch-util/math')
const radians = require('degrees-radians');
const random = require('canvas-sketch-util/random')
const CONFIG = require('./config');

const genC3data = (settings) => {
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
  // console.log('interval', interval);
  // increament desiredRadianAngleOnCircle for each new x,y
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
        radius: dotRadius
      }
    );
  }
  // console.log(points)
  return points;
}

const drawDottedCircleConcaveData = (context, width, height, data)  => {
  data.forEach(element => {
    const {
      position,
      radius,
      fill
    } = element;
    // console.log(element)

    const [u , v] = position;

    let x = lerp(CONFIG.project.margin, width - CONFIG.project.margin, u);
    let y = lerp(CONFIG.project.margin, height - CONFIG.project.margin, v);

    context.beginPath();
    context.arc(x, y, radius * width, 0, radians(360));
    context.closePath();
    context.fillStyle = fill;
    context.fill();
  });
};


module.exports = {
  genDottedCircleConcaveData,
  drawDottedCircleConcaveData
}