const CONFIG = {
  project: {
    margin: 250
  },
  shapes: {
    dottedConcave: {
      points: [],
      settings: {
        dots: 200,
        radius: .175,
        position: {
          x: .5,
          y: .344
        },
        dotRadius: .0007,
        color: 'black'
      }
    },
    c1: {
      info: 'Dotted circle (top)',
      points: [],
      settings: {
        dots: 100,
        radius: .105,
        position: {
          x: .5,
          y: .208
        },
        dotRadius: .0009,
        color: 'black'
      }
    },
    c2: {
      info: 'Dotted circle (big)',
      points: [],
      settings: {
        dots: 200,
        radius: .2,
        position: {
          x: .5,
          y: .415
        },
        dotRadius: .0009,
        color: 'black'
      }
    },
    c3: {
      info: 'Dotted circle (middle)',
      points: [],
      settings: {
        dots: 150,
        radius: .15,
        position: {
          x: .5,
          y: .465
        },
        dotRadius: .001,
        color: 'black'
      }
    },
    c4: {
      info: 'Split circle',
      points: [],
      settings: {
        radius: .1,
        position: {
          x: .5,
          y: .665
        },
        circles: {
          base: {
            type: 'base',
            color: 'pink',
            vOffset: 0,
            radiusScale: 0,
            comp: 'source-over'
          },
          top: {
            type: 'top',
            color: 'yellow',
            vOffset: -0.175,
            radiusScale: .6,
            comp: 'source-atop'
          },
          bottom: {
            type: 'bottom',
            color: 'red',
            vOffset: 0.1335,
            radiusScale: .54,
            comp: 'source-atop'
          },
        },
      }
    },
    c5: {
      info: 'Dotted circle',
      points: [],
      settings: {
        dots: 150,
        radius: .12,
        position: {
          x: .5,
          y: .798
        },
        dotRadius: .001,
        color: 'black'
      }
    },
    c6 : {
      info: 'Red circle',
      points: [],
      settings: {
        circles: 2,
        vOffset: .5,
        position: {
          x: .5,
          y: .882
        },
        radius: [.04, .045],
        colors: ['red', 'black'],
        comps: [],
      }
    },
    soundWave: {
      info: 'Soundwave',
      points: [],
      settings: {
        shapeWidth: .377,
        axis: {
          wOffset:0.0175,
          lineWidth: 5,
          color: 'black',
        },
        wave: {
          barsGap: 0.0006,
          minAmplitude: -0.015,
          maxAmplitude: .015,
          colors: ['lightgray', 'black'],
        },
        moons: {
          count: 10,
          padding: .0375,
          gap: 0.015,
          maxRadius: 0.0045,
          minRadius: 0.001,
          bigMoons: 3,
          mirrored: true,
          colors: ['black'],
        },
        position: {
          x: .3095,
          y: .8
        },
      }
    }
  }
}

module.exports = CONFIG;
