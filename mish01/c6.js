const { lerp } = require('canvas-sketch-util/math')
const radians = require('degrees-radians');
const CONFIG = require('./config');

const genC6data = (settings) => {
  let points = [];
  let offset = 0;

  const {
    circles,
    radius,
    vOffset,
    position,
    colors,
    comps,
  } = settings;

  const { x, y } = position;

  for (let c = circles; c > 0; c--) {
    // convert to u,v coordinates
    const u = x;
    const v = y + offset;
    points.push(
      {
        fill: colors[c - 1],
        position: [u, v],
        comp: comps[c -1],
        radius: radius[c - 1], // Gaussian distribution -3.5 to 3.5
      }
    );
    offset += vOffset * 0.01;
  }
  // console.log(points)
  return points;
}

const drawC6 = (context, width, height, data)  => {
  console.warn('drawRedCircleData')
  return new Promise((resolve, reject) => {
    context.globalCompositeOperation = 'source-over'
    data.forEach(element => {
      const {
        position,
        radius,
        fill,
        comp,
      } = element;

      const [u , v] = position;
      let x = lerp(CONFIG.project.margin, width - CONFIG.project.margin, u);
      let y = lerp(CONFIG.project.margin, height - CONFIG.project.margin, v);
      context.globalCompositeOperation = comp || 'source-over'
      context.beginPath();
      context.arc(x, y, radius * width, 0, radians(360), false);
      context.closePath();
      context.fillStyle = fill;
      context.linearWidth = 0;
      context.fill();
    });
    context.globalCompositeOperation = 'source-over'
    resolve();
  })
};


module.exports = {
  genC6data,
  drawC6
}