      const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
      const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
      const concat = Function.bind.call(Function.call, Array.prototype.concat);
      const keys = Reflect.ownKeys;

      if (!Object.values) {
        Object.values = function values(O) {
          return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
        };
      }

      if (!Object.entries) {
        Object.entries = function entries(O) {
          return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [
            [k, O[k]]
          ] : []), []);
        };
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/windmill/service-worker.js');
      }


      const floor = num => num << 0;
      const str2num = str => parseInt(str.slice(0, -2));
      const vw = window.innerWidth || 2000;
      const vh = window.innerHeight || 2000;
      const len = 3 * (vh + vw);
      const dots = {};
      const getpos = (elm) => {
        const rect = elm.getBoundingClientRect();
        const x = str2num(elm.style.left) + floor(len / 2);
        const y = str2num(elm.style.top);
        return {
          x,
          y
        };
      }
      const setpos = (elm, x, y) => {
        elm.style.left = `${x - floor(len / 2)}px`;
        elm.style.top = `${y}px`
      }
      const universe = document.querySelector('#main');
      const line = document.querySelector('.line');
      line.style['width'] = `${len}px`;
      line.style['left'] = '0px';
      line.style['top'] = '0px';
      line.style['overflow'] = 'hidden';
      getpos(line);
      setpos(line, floor(vw / 2), floor(vh / 2));
      //setpos(line,0,0);

      getpos(line);


      var start = null;
      var slope = 0;
      var shouldUseislope = false;
      var nextDot;
      var nextDotDeg = 365;
      var digs = [];
      var curDot;

      var tic = 0;

      function doStuff() {

        let islope = slope + 180;
        if (islope < 0) {
          islope = 360 + islope;
        } else if (islope > 360) {
          islope = islope - 360;
        }
        const tryslope = shouldUseislope ? islope : slope;
        const linebuffer = tryslope - .6;

        const shouldPivot = tryslope == 0 && nextDotDeg < 360 && nextDotDeg > 359;
        if (shouldPivot || tryslope >= nextDotDeg && linebuffer < nextDotDeg) {
          setpos(line, nextDot.x, nextDot.y);
          nextDot.ref.className = "hit";
          if (navigator.vibrate) {
            navigator.vibrate([100])
          }
          const p1 = getpos(line);
          let pdiff = 0;
          digs = [];
          Object.values(dots).forEach(p2 => {
            if (p1.x == p2.x && p1.y == p2.y) {

            } else {
              let pointDegs = Math.atan2((p2.y * -1) - (p1.y * -1), p2.x - p1.x) * 180 / Math.PI;
              if (pointDegs < 0) {
                pointDegs = 360 + pointDegs;
              }
              digs.push({
                d: pointDegs,
                p: p2
              });
            }

          });
          digs.sort((a, b) => a.d - b.d);
          let potentialdig = 'false';
          let potentialdot = 'false';
          let pdig;
          let pdot;
          for (const dig of digs) {
            if (slope < dig.d) {
              potentialdig = dig.d;
              potentialdot = dig.p;
              break;
            }
          }

          if (potentialdig === 'false' && digs[0]) {
            pdig = digs[0].d
            pdot = digs[0].p;
          } else {
            pdig = potentialdig
            pdot = potentialdot;
          }


          let islope = slope + 180;
          if (islope < 0) {
            islope = 360 + islope;
          } else if (islope > 360) {
            islope = islope - 360;
          }
          let ipotentialdig = 'false';
          let ipotentialdot = 'false';
          let ipdig;
          let ipdot;
          for (const dig of digs) {

            if (islope < dig.d) {
              ipotentialdig = dig.d;
              ipotentialdot = dig.p;
              break;
            }
          }

          if (ipotentialdig === 'false' && digs[0]) {
            ipdig = digs[0].d
            ipdot = digs[0].p;
          } else {
            ipdig = ipotentialdig
            ipdot = ipotentialdot;
          }
          let sdif = (pdig - slope < 0) ? pdig + (360 - slope) : pdig - slope;
          let isdif = (ipdig - islope < 0) ? ipdig + (360 - islope) : ipdig - islope;

          if (sdif > isdif) {
            nextDotDeg = ipdig;
            nextDot = ipdot;
            shouldUseislope = true;
          } else {
            nextDotDeg = pdig;
            nextDot = pdot;
            shouldUseislope = false;
          }



          console.log({
            nextDotDeg,
            nextDot,
            shouldUseislope,
            slope,
            islope,
          })

        }
        line.style.transform = `rotate(${ 360 - slope}deg)`;
        slope = slope + 0.5;
        if (slope === 360) {
          slope = 0;
        }
      }

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        doStuff();
        window.requestAnimationFrame(step);
        /* if (progress < dkwtd) {
           window.requestAnimationFrame(step);
         } */
      }

      window.requestAnimationFrame(step);


      const makeDot = (parent, x, y) => {
        const newDot = document.createElement("div");
        newDot.style.left = `${x}px`;
        newDot.style.top = `${y}px`;
        newDot.className = "dot";
        parent.appendChild(newDot);
        dots[`${x},${y}`] = {
          x,
          y,
          ref: newDot
        }
        console.log({
          dots
        });
        const p1 = getpos(line);
        let pdiff = 0;
        digs = [];
        Object.values(dots).forEach(p2 => {
          if (p1.x == p2.x && p1.y == p2.y) {

          } else {
            let pointDegs = Math.atan2((p2.y * -1) - (p1.y * -1), p2.x - p1.x) * 180 / Math.PI;
            if (pointDegs < 0) {
              pointDegs = 360 + pointDegs;
            }
            digs.push({
              d: pointDegs,
              p: p2
            });
          }

        });
        digs.sort((a, b) => a.d - b.d);
        let potentialdig = 'false';
        let potentialdot = 'false';
        let pdig;
        let pdot;
        for (const dig of digs) {
          if (slope < dig.d) {
            potentialdig = dig.d;
            potentialdot = dig.p;
            break;
          }
        }

        if (potentialdig === 'false' && digs[0]) {
          pdig = digs[0].d
          pdot = digs[0].p;
        } else {
          pdig = potentialdig
          pdot = potentialdot;
        }


        let islope = slope + 180;
        if (islope < 0) {
          islope = 360 + islope;
        } else if (islope > 360) {
          islope = islope - 360;
        }
        let ipotentialdig = 'false';
        let ipotentialdot = 'false';
        let ipdig;
        let ipdot;
        for (const dig of digs) {

          if (islope < dig.d) {
            ipotentialdig = dig.d;
            ipotentialdot = dig.p;
            break;
          }
        }

        if (ipotentialdig === 'false' && digs[0]) {
          ipdig = digs[0].d
          ipdot = digs[0].p;
        } else {
          ipdig = ipotentialdig
          ipdot = ipotentialdot;
        }
        let sdif = (pdig - slope < 0) ? pdig + (360 - slope) : pdig - slope;
        let isdif = (ipdig - islope < 0) ? ipdig + (360 - islope) : ipdig - islope;

        if (sdif > isdif) {
          nextDotDeg = ipdig;
          nextDot = ipdot;
          shouldUseislope = true;
        } else {
          nextDotDeg = pdig;
          nextDot = pdot;
          shouldUseislope = false;
        }


        console.log({
          nextDotDeg,
          nextDot,
          shouldUseislope,
          slope,
          islope,
        })
      }

      var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

      const clickOrTap = (event) => {
        makeDot(universe, event.clientX || event.pageX, event.clientY || event.pageY);
      }

      var clickortouch = (iOS && 'ontouchstart' in window) ? 'touchstart' : 'click';
      document.addEventListener(clickortouch, clickOrTap);
