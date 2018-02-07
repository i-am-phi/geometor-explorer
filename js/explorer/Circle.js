/**
 * represents a radial proportion between two points
 *
 * @constructor
 * @param {Point} cpt - center point of the circle
 * @param {Point} rpt - radius point of the circle.
 */
function Circle(cpt, rpt) {

  // TODO: Circle class should derive from Element

  if (!(this instanceof Circle)) {
    return new Circle(cpt, rpt)
  }

  /**
  * id of the element - set by the context of the {@link Model}<br>
  * usually the index in the elements array
  * @returns {string}
  */
  this.id = ""

  /**
  * convenience type check for the element
  * @returns {string} "circle"
  */
  this.type = "circle"

  /**
  * an array of points on this element
  *
  * does not include center point (not on the circle)
  * @returns {Array} of {@link Point}
  */
  this.points = [rpt]

  /**
  * add a point to this element's point list

  * usually called by the {@link Model} to add intersection points

  * checks to determine if the point is already present
  * @function
  * @param {Point}
  * @returns {Point}
  */
  this.addPoint = addPointToElement

  /**
  * center point - set by constructor
  * @returns {Point}
  */
  this.center = cpt

  //***************************************

  var cmd
  alg(`clearall`)

  // h = x offest
  // log(  `    h = cpt.x`)
  cmd = `    h = (${cpt.x})`
  alg(cmd)
  /**
  * represents the x-offset in `(x - h)^2 + (y - k)^2 = r^2`

  * h = (${cpt.x})

  * @returns {string} algebraic value
  */
  this.h = alg(`h`)
  // log(  `      = ${this.h}`)

  // a coefficient
  cmd = `    a = -2h`
  alg(cmd)
  let a = alg(`a`)
  // log(  `      = ${a}`)

  // k = y offset
  // log(  `    k = cpt.y`)
  cmd = `    k = (${cpt.y})`
  alg(cmd)
  /**
  * represents the y-offset in `(x - h)^2 + (y - k)^2 = r^2`
  * @returns {string} algebraic value
  */
  this.k = alg(`k`)
  // log(  `      = ${this.k}`)

  // b coefficient
  cmd = `    b = -2k`
  alg(cmd)
  let b = alg(`b`)
  // log(  `      = ${b}`)


  // calculate radius
  // log(  `    r = ( (cpt.x - rpt.x)^2 + (rpt.y - cpt.y)^2 )^(1/2)`)
  cmd = `    r = ( ((${cpt.x}) - (${rpt.x}))^2 + ((${rpt.y}) - (${cpt.y}))^2 )^(1/2)`
  alg(cmd)
  /**
  * represents the radius length in `(x - h)^2 + (y - k)^2 = r^2`

  * r = ( (cpt.x - rpt.x)^2 + (rpt.y - cpt.y)^2 )^(1/2)`)

  * @returns {string} algebraic value
  */
  this.r = alg(`r`)
  // log(  `      = ${this.r}`)

  // c coefficient
  cmd = `    c = h^2 + k^2 - r^2`
  alg(cmd)
  let c = alg(`c`)
  // log(  `      = ${c}`)

  /**
  * the equation associated with this element
  * set by constructor

  * `d x^2 + e x y + f y^2 + a x + b y = c`

  * `d = 1` // always for a circle <br>
  * `e = 0` // always for a circle <br>
  * `f = 1` // always for a circle <br>
  * `a = -2h` <br>
  * `b = -2k` <br>
  * `c = h^2 + k^2 - r^2` // but sign is changed to put it on the other side of the equals <br>

  * @returns {Equation}
  */
  this.eq = new Equation(1,0,1,a,b,'-'+c)

  /**
  * formatted string representing attribute of the circle
  * @function
  * @returns {string}
  */
  this.toString = toStringCircle

  /**
  * grouped console output to represent the object<br>
  * perfect for logging
  * @function
  * @returns {console}
  */
  this.log = consoleCircle

}

function toStringCircle() {
  var str = `${this.type} - ${this.id}
  c pt: ${this.center.id} : ${this.center.x}, ${this.center.y}
     h: ${this.h}
     k: ${this.k}
     r: ${this.r}
    eq: ${this.eq}
points: ${this.points.length}\n`;
//TODO: list related points
  this.points.forEach( function(point){
    str += "    " +  point.type + " :\t" + point.id + "\n";
  });

  return str;
}

// log line to console
function consoleCircle(title){

  let titleStr = title || "circle"

  console.group( `${this.id} : ${titleStr}` )
  log(this.toString());
  console.groupEnd();

}
