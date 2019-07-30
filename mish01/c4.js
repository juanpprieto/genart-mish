const { lerp } = require('canvas-sketch-util/math')
const radians = require('degrees-radians');
const random = require('canvas-sketch-util/random')
const CONFIG = require('./config');


const genC4data = (settings) => {
  let points = [];
  let {
    radius,
    position,
    circles
  } = settings;

  Object.keys(circles).forEach((key) => {
    let config = circles[key];
    points.push(C4.genData(radius, position, config));
  })
  console.log('points', points);
  return points;
};

const drawC4data = (context, width, height, data) => {
  console.warn('drawC4data')
  return new Promise((resolve, reject) => {
    context.globalCompositeOperation = 'destination-over';
    data.forEach((circle) => {
      let {
        u, v, cRadius, color, comp, type
      } = circle;

      console.log('drawing', type);

      let x = lerp(CONFIG.project.margin, width - CONFIG.project.margin, u);
      let y = lerp(CONFIG.project.margin, height - CONFIG.project.margin, v);

      if (type === 'base') {
        C4.draw.base(context, width, height, x, y, u, v, cRadius, color, comp, type)
      } else if (type === 'top')  {
        context.save()
        C4.draw.top(context, width, height, x, y, u, v, cRadius, color, comp, type)
      } else if (type === 'bottom')  {
        context.restore()
        C4.draw.bottom(context, width, height, x, y, u, v, cRadius, color, comp, type)
      }

     })
    // reset context
    context.globalCompositeOperation = 'source-over'
    resolve()
  })
};

const C4 = {
  genData(radius, position, config) {
    let { x, y } = position;
    let {vOffset, color, comp, type, radiusScale } = config;
    let u = x;
    let v = y + vOffset;
    let cRadius = radius + radius * radiusScale;

    return { u, v, cRadius, color, comp, type}
  },
  draw: {
    base(context, width, height, x, y, u, v, cRadius, color, comp, type){
      console.log('base..');
      if(comp && comp !== null) {
        context.globalCompositeOperation = comp;
      }
      context.beginPath();
      context.fillStyle = color;
      context.arc(x,y,cRadius * width,0,radians(360), false);
      context.closePath();
      context.fill();
      context.clip();
      context.save();
      console.log('x', x)
      console.log('y', y)
      console.log('u', u)
      console.log('v', v)
      console.log('cRadius', cRadius)

      let startX, endX, startY, endY;
      startX =  x - (cRadius * width);
      endX = x + (cRadius * width);
      startY = y - (cRadius * width);
      endY = y + (cRadius * width);

      context.globalCompositeOperation = 'source-in';
      context.fillStyle = "white";
      context.fillRect(startX, startY, endX, endY);
      context.fill();
      console.log('startX', startX);
      console.log('endX', endX);
      console.log('startY', startY);
      console.log('endY', endY);

      let cells = 400;
      let symbols = [
        // 'ʹ',
        'ˏ'
      ];
      let points = createGrid(cells, startX, endX, startY, endY )
      context.globalCompositeOperation = 'source-over';
      console.log('points', points)
      let diam = ((endX - startX) / cells);
      let radiu = diam /2;
      console.log('radiu', radiu);
      let colors = ['yellow' , 'black', 'black', 'black']
      // render each symbol
      points.forEach((point, index) => {
        let { u, v } = point.pos;
        context.fillStyle = random.pick(colors);
        context.beginPath();
        context.font = `${random.rangeFloor(20,30)}px serif`;
        context.rotate(random.noise2D(u,v));
        context.fillText(random.pick(symbols), u, v)
      })
      context.fill();
      context.restore();
    },
    top(context, width, height, x, y, u, v, cRadius, color, comp, type){
      console.log('top..');

      if(comp && comp !== null) {
        context.globalCompositeOperation = comp;
      }
      context.beginPath();
      context.fillStyle = color;
      context.arc(x,y,cRadius * width,0,radians(360), false);
      context.closePath();
      context.fill();
      context.clip();
      // context.fillStyle = "orange";
      context.fillRect(x, y, - cRadius * width,cRadius * width);
      context.fillRect(x, y, cRadius * width,cRadius * width);

    },
    bottom(context, width, height, x, y, u, v, cRadius, color, comp, type){
      console.log('bottom..');
      if(comp && comp !== null) {
        context.globalCompositeOperation = comp;
      }
      context.beginPath();
      context.fillStyle = color;
      context.arc(x,y,cRadius * width,0,radians(360), false);
      context.closePath();
      context.fill();
      context.clip();

      let startX, endX, startY, endY;
      startX =  x - (cRadius * width);
      endX = x + (cRadius * width);
      startY = y - (cRadius * width);
      endY = y + (cRadius * width);

      context.globalCompositeOperation = 'source-in';
      context.fillStyle = "white";
      context.fillRect(startX, startY, endX, endY);
      context.fill();
      console.log('startX', startX);
      console.log('endX', endX);
      console.log('startY', startY);
      console.log('endY', endY);

      let cells = 100;
      let points = createGrid(cells, startX, endX, startY, endY )
      context.globalCompositeOperation = 'source-over';
      console.log('points', points)
      let diam = ((endX - startX) / cells);
      let radiu = diam /2;
      console.log('radiu', radiu);
      let colors = ['orange' , 'blue']
      points.forEach((point, index) => {
        let { u, v } = point.pos;
        // context.strokeStyle = "white";
        context.fillStyle = random.pick(colors);
        context.strokeStyle = "green";
        context.beginPath();
        // context.arc(u, v, radiu, 0, radians(360), false);
        // context.fillRect(u, v, diam, radiu /2);
        // context.closePath();
        // context.stroke();
        context.font = `${random.rangeFloor(40,60)}px serif`;
        context.fillStyle = 'black';
        // context.fillStyle = 'white';
        context.fillText('_', u, v)
        // context.fill();
      })
      context.fill();

    },
  }
};

const createGrid = (cells, startX, endX, startY, endY) => {
  const points = [];

  // x-dimension
  for (let x = 0; x < cells; x++ ) {
    for (let y = 0; y < cells; y++) {
      // u v coordinates (0,0 to 1,1)
      const u = cells <= 1 ? .5 : (((endX - startX)  / cells) * x) + startX;
      const v =  cells <= 1 ? .5 : (((endY - startY) / cells) * y) + startY;

      points.push(
        {
          pos: {
            u,
            v,
          }
        }
      );
    }
  }
  return points
}

module.exports = {
  genC4data,
  drawC4data
}