import * as A from './Algebra.js'
import Struct from './Struct.js'
import Equation from './Equation.js'

/**
 * represents a linear proportion established by two points
 * - constructor calculates a generalized algebraic {@link Equation} to represent the linear proportions of the x, y values of the points recieved
 *
 * @class
 * @param {Point} pt1 - initial point of the Line
 * @param {Point} pt2 - initial point of the Line.
 * @param {string} type - type of element - default: "Line"
 * @param {string} id - optional: unique id for the Struct

*/
export default class Line extends Struct {
  constructor(pt1, pt2, type, id) {

    type = type || "Line"

    super(pt1, pt2, type, id)

    //***************************************

    // calculate equation 1 coefficients
    // ax + by + c form

    var cmd
    A.run(`clearall`)

    // coefficent a
    this.hlog(`a = (pt1.y) - (pt2.y)`)
    cmd = `a = (${pt1.y}) - (${pt2.y})`
    this.hlog(cmd)
    A.run(cmd)
    let a = A.run(`a`)
    this.hlog(`  = ${a}`)

    // coefficent b
    this.hlog(`b = (pt2.x) - (pt1.x)`)
    cmd = `b = (${pt2.x}) - (${pt1.x})`
    this.hlog(cmd)
    A.run(cmd)
    let b = A.run(`b`)
    this.hlog(`  = ${b}`)

    // coefficent c
    this.hlog(`c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))`)
    cmd = `c = ((${pt1.x}) * (${pt2.y})) - ((${pt2.x}) * (${pt1.y}))`
    this.hlog(cmd)
    A.run(cmd)
    let c = A.run(`c`)
    this.hlog(`  = ${c}`)

    // log(  `  = ${c}`)


    /**
    * the equation associated with this element
    * - set by constructor

    * `d x^2 + e x y + f y^2 + a x + b y = c`

    * `d = 0` // always for a line <br>
    * `e = 0` // always for a line <br>
    * `f = 0` // always for a line <br>
    * `a = (pt1.y) - (pt2.y)` <br>
    * `b = (pt2.x) - (pt1.x)` <br>
    * `c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))`   // but sign is changed to put it on the other side of the equals <br>

    * @returns {Equation}
    */
    this.eq = new Equation("0", "0", "0", a, b, `-(${c})`)

  } //constructor

  /**
   * check all pairs of contiguous segments on this line for golden ratio instances
   * @function
   * @returns {Array} collection of new {@link Section} objects where `.isGoldenRatio = true`
   */
  checkSegments() {

    console.groupCollapsed("line: " + this.id + "");

    // clone points before sorting
    var points = this.points.slice(0);

    // sort points on the line
    points.sort(comparePoints);

    //check for golden ratio
    // const GR = "1/2 + 1/2 5^(1/2)"
    // const GRval = A.run( `float(${GR})`)

    for (var i = 0; i < points.length - 2; i++) {
      //get first segment point
      var pt1 = points[i];

      console.groupCollapsed("(" + pt1.id + ")");


      var cmd = `clearall
        PHI = 1/2 + 1/2 5^(1/2)
        `;
      A.run(cmd);

      //loop the remaining points to set first segment
      for (var j = i + 1; j < points.length - 1; j++) {
        var pt2 = points[j];

        // get the length of the first segment
        cmd = `A = ${pt1.distanceTo(pt2)}
        A
        `;
        var A = A.run(cmd);

        if (A.checkValid(A)) {

          console.groupCollapsed(`> (${pt2.id}) : ${A} `);

          // loop the remaining points to set second segment
          for (var k = j + 1; k < points.length; k++) {
            var pt3 = points[k];

            // get the length of the second segment
            cmd = `B = ${pt2.distanceTo(pt3)}
            B
            `;
            var B = A.run(cmd);

            if (A.checkValid(B)) {

              // console.groupCollapsed(`>> (${pt3.id}) : ${B} = ${Bval}` );
              console.groupCollapsed(`>> (${pt3.id}) : ${B}`);

              // get the ratio fo the segments
              cmd = `R = simplify( A / B )
              R
              `;
              var ratio = A.run(cmd);

              log("        * ratio: " + ratio);

              var check = A.run(` R - PHI `);
              var checkVal = A.run(`float( R - PHI )`)

              log("check: " + check);
              log("  val: " + checkVal);

              if (checkVal == 0 || checkVal == -1) {
                //Success!
                var str = `[${this.id}] : ${pt1.id}> ${A} <${pt2.id}> ${B} <${pt3.id}
          : ${ratio}\n`;
                console.warn("Golden! ", str);
                logSegments(str);
                var s1 = addSegment(pt1, pt2, this);

                var s2 = addSegment(pt2, pt3, this);
                golden.push([s1, s2]);

              }
              console.groupEnd();
            } else {
              // B not valid
            }
          } //for k
          console.groupEnd();
        } else {
          // A not valid
        }
      } // for j
      console.groupEnd();
    } // for i
    console.groupEnd();
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
