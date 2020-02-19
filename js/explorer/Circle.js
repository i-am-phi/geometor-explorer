import * as A from './Algebra.js'
import Struct from './Struct.js'
import Equation from './Equation.js'

/**
 * represents a circular proportion between two points
 * - constructor calculates a generalized algebraic {@link Equation} to represent the circular proportions of the x, y values of the points recieved

 * @constructor
 * @param {Point} cpt - center point of the circle
 * @param {Point} rpt - radius point of the circle.
 * @param {string} type - optional: type of element - default: "Circle"
 * @param {string} id - optional: unique id for the element - default: ""

*/
export default class Circle extends Struct {
  constructor(cpt, rpt, type, id) {

    type = type || "Circle"

    // TODO: !!!! IS center point on the points array of the Struct
    super(cpt, rpt, type, id)

    // /**
    //  * an Array of {@link Point} objects on this Circle
    //  * - does not include center point (not on the Circle)
    //
    //  * @returns {Array} of {@link Point}
    //  */
    // this.points = [rpt]

    /**
     * center point - set by constructor
     * @returns {Point}
     */
    this.center = cpt

    //***************************************

    var cmd
    A.run(`clearall`)

    cmd = `h = (${cpt.x})`
    this.hlog(cmd)
    A.run(cmd)

    /**
    * the x-offset in `(x - h)^2 + (y - k)^2 = r^2`
    * - `h = cpt.x`
    * @returns {string} algebraic value
    */
    this.h = A.run(`h`)

    // a coefficient
    cmd = `a = -2h`
    this.hlog(cmd)
    A.run(cmd)
    let a = A.run(`a`)
    this.hlog(`  = ${a}`)


    cmd = `k = (${cpt.y})`
    this.hlog(cmd)
    A.run(cmd)
    /**
     * the y-offset in `(x - h)^2 + (y - k)^2 = r^2`
     * - `k = cpt.y`
     * @returns {string} algebraic value
     */
    this.k = A.run(`k`)

    // b coefficient
    cmd = `b = -2k`
    this.hlog(cmd)
    A.run(cmd)
    let b = A.run(`b`)
    this.hlog(`  = ${b}`)


    cmd = `r = ( ((${cpt.x}) - (${rpt.x}))^2 + ((${rpt.y}) - (${cpt.y}))^2 )^(1/2)`
    this.hlog(cmd)
    A.run(cmd)
    /**
    * the radius length in `(x - h)^2 + (y - k)^2 = r^2`
    * - `r = ( (cpt.x - rpt.x)^2 + (rpt.y - cpt.y)^2 )^(1/2) )`
    * @returns {string} algebraic value
    */
    this.r = A.run(`r`)
    this.hlog(`  = ${this.r}`)

    // c coefficient
    cmd = `c = h^2 + k^2 - r^2`
    this.hlog(cmd)
    A.run(cmd)
    let c = A.run(`c`)
    this.hlog(`  = ${c}`)

    /**
    * the {@link Equation} associated with this Circle

    * **`d x^2 + e x y + f y^2 + a x + b y = c`**

    * - `d = 1` // always for a circle <br>
    * - `e = 0` // always for a circle <br>
    * - `f = 1` // always for a circle <br>
    * - `a = -2h` <br>
    * - `b = -2k` <br>
    * - `c = h^2 + k^2 - r^2` // but sign is changed to put it on the other side of the equals <br>

    * @returns {Equation}
    */
    this.eq = new Equation("1", "0", "1", a, b, `-(${c})`)

  }

  // /**
  //  * formatted string representing attribute of the circle
  //  * @function
  //  * @returns {string}
  //  */
  // toString() {
  //   var str = `${this.type} - ${this.id}
  //   c pt: ${this.center.id} : ${this.center.x}, ${this.center.y}
  //      h: ${this.h}
  //      k: ${this.k}
  //      r: ${this.r}
  //     eq: ${this.eq}
  // points: ${this.points.length}\n`;
  //   //TODO: list related points
  //   this.points.forEach(function(point) {
  //     str += "    " + point.type + " :\t" + point.id + "\n";
  //   });
  //
  //   return str;
  // }


  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
