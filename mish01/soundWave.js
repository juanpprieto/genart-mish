const { lerp } = require('canvas-sketch-util/math')
const radians = require('degrees-radians');
const random = require('canvas-sketch-util/random')
const CONFIG = require('./config');

const genSWdata = (settings) => {
  let points = {
    wave: SW.genWaveData(settings),
    moons: SW.genMoonsData(settings)
  };

  return points;
}

const drawSWdata = (context, width, height, data, settings)  => {
  console.warn('drawSW', data)
  let {
    shapeWidth,
    axis
  } = settings;

  return new Promise((resolve, reject) => {
    SW.drawAxis(context, width, height, data.wave[0].lineTo.x, data.wave[0].moveTo.y, shapeWidth, axis)
    SW.drawWaveData(data.wave, context, width, height)
    SW.drawMoonsData(data.moons, context, width, height)

    context.globalCompositeOperation = 'source-over'
    resolve();
  })
};

const SW = {
  drawAxis(context, width, height, x, y, shapeWidth, axis){
    context.globalCompositeOperation = 'source-over'
    let {color, wOffset, lineWidth} = axis;
    let axisWidth = x + shapeWidth + wOffset;
    let axisWidthX = lerp(CONFIG.project.margin, width - CONFIG.project.margin, axisWidth);
    let mtx = lerp(CONFIG.project.margin, width - CONFIG.project.margin, x - (wOffset));
    let mty = lerp(CONFIG.project.margin, height - CONFIG.project.margin, y);
    context.beginPath()
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.moveTo(mtx, mty);
    context.lineTo(axisWidthX, mty);
    context.closePath();
    context.stroke();
  },
  genWaveData(settings){
    let points = [];

    let {
      barsGap,
      colors,
      minAmplitude,
      maxAmplitude,
    } = settings.wave;

    let {position, shapeWidth} = settings;

    let barsCount = Math.floor(shapeWidth / barsGap);
    let last_bx = position.x;
    let rx = 0;

    for (let i = 0; i < barsCount; i++) {
      let randY = random.range(minAmplitude, maxAmplitude)

      let ry = position.y + randY;
      if (i === 0) rx = position.x;
      else rx = last_bx + barsGap;

      points.push(
        {
          moveTo: {
            y: position.y
          },
          lineTo: {
            x: rx,
            y: ry
          },
          lineWidth: random.range(1,8) + Math.abs(random.noise2D(rx, ry)) / 100,
          color: random.pick(colors)
        }
      )
      last_bx = rx;
    }

    return points;
  },
  drawWaveData(waveData, context, width, height){
    waveData.forEach(element => {
      const {
        moveTo,
        lineTo,
        color,
        lineWidth,
      } = element;

      let mty = lerp(CONFIG.project.margin, height - CONFIG.project.margin, moveTo.y);
      let ltx = lerp(CONFIG.project.margin, width - CONFIG.project.margin, lineTo.x);
      let lty = lerp(CONFIG.project.margin, height - CONFIG.project.margin, lineTo.y);
      // context.globalCompositeOperation = comp || 'source-over'
      context.lineWidth = lineWidth;
      context.beginPath();
      context.strokeStyle = color;
      context.moveTo(ltx, mty);
      context.lineTo(ltx, lty);
      context.stroke()
      context.closePath();
    });
  },
  genMoonsData(settings){
    let points = [];

    let {
      count,
      colors,
      padding,
      gap,
      bigMoons,
      mirrored,
      maxRadius,
      minRadius,
    } = settings.moons;

    let {position, shapeWidth} = settings;

    let bigMoonsCounter = 0;
    let moonRadius = 0;
    let last_u = 0;
    position.x = position.x - padding;

    let u = position.x;

    // left set
    for (let m = 0; m < count; m++) {

      if (bigMoonsCounter < bigMoons) {
        // big moon
        moonRadius = maxRadius - (bigMoonsCounter * (maxRadius * .15)); // reduce by 0% of max, 15% max and 30% max;
      } else {
        // small moon
        moonRadius = minRadius;
      }

      if (m > 0){
        u = last_u - gap - moonRadius
      }

      points.push(
        {
          u: u,
          v: position.y,
          radius: moonRadius,
          color: random.pick(colors)
        }
      )

      last_u = u;
      bigMoonsCounter++;
    }

    // right set
    if (mirrored) {
      bigMoonsCounter = 0;
      moonRadius = 0;
      last_u = 0;
      position.x = position.x + shapeWidth + (padding * 2);
      u = position.x;

      for (let m = 0; m < count; m++) {
        if (bigMoonsCounter < bigMoons) {
          // big moon
          moonRadius = maxRadius - (bigMoonsCounter * (maxRadius * .15)); // reduce by 0% of max, 15% max and 30% max;
        } else {
          // small moon
          moonRadius = minRadius;
        }

        if (m > 0){
          u = last_u + gap + moonRadius
        }

        points.push(
          {
            u: u,
            v: position.y,
            radius: moonRadius,
            color: random.pick(colors)
          }
        )

        last_u = u;
        bigMoonsCounter++;
      }
    }

    return points;

  },
  drawMoonsData(moonData, context, width, height){
    console.warn('moonData', moonData)
    moonData.forEach(element => {
      const {
        u,
        v,
        radius,
        color,
      } = element;

      let x = lerp(CONFIG.project.margin, width - CONFIG.project.margin, u);
      let y = lerp(CONFIG.project.margin, height - CONFIG.project.margin, v);

      context.beginPath();
      context.fillStyle = color;
      context.arc(x,y,radius * width,0, radians(360),false);
      context.closePath();
      context.fill();
    })
  }

}

module.exports = {
  genSWdata,
  drawSWdata
}