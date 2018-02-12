/**
 * represents an ordered **List** of two algebraic values
 * - extends from {@link Element}
 * - can be considered the coordinates `x, y` within a two dimensional cartesian plane
 * - other than the two "given" starting points, new points in the model are derived
 from the root set of a {@link System} of algebraic expressions defined by two {@link Struct}
 * - the starting values of the first two points are explicitly set and have no parent {@link Struct}

 * **TODO:** points should be immutable after instantiation<br>
 * **TODO:** each x, y value pair is a part of a result set from a {@link System} of two Structs - relate the System to the Point<br>
 * **TODO:** create a {@link Value} object as a container for Algebraic and Float representations
 * **TODO:** make x, y {@link Value} objects - validate
 *
 * @class
 * @param {algValue} x - string with algebraic value
 * @param {algValue} y - string with algebraic value
 * @param {Struct} struct1 - parent structure - such as intersecting line or circle.
 * @param {Struct} struct2 - parent structure - such as intersecting line or circle.
 * @param {string} type - optional: type of Element - default: "Point"
 * @param {string} id - optional: unique id for the Element

 */
class Point extends Element {

  constructor(x, y, struct1, struct2, type, id) {

    type = type || "Point"

    super(type, id)


    /** TODO: set these as {@link Value} objects
    * - every element should have a set of defining parameters*/
    this.params = {
      x: x,
      y: y
    }


    // TODO: use get method to prevent changing value
    /**
     * algebraic value - set by constructor
     * @returns {algValue} algebraic value
     */
    this.x = x

    /**
     * algebraic value - set by constructor
     * @returns {algValue} algebraic value
     */
    this.y = y

    /**
     * floating point value - set by constructor - converted from algValue
     * @returns {float}
     */
    this.xVal = A.parseFloat(this.x)

    /**
     * floating point value - set by constructor - converted from algValue
     * @returns {float}
     */
    this.yVal = A.parseFloat(this.y)

    /** intended as a unique idenifier for the element withing the model. based on its parameters */
    this.tag = `[ (${this.x}), (${this.y}) ]`

    /**
     * Quadrance - the square of the vector of this point from origin
     * - `(x)^2 + (y)^2`
     * @returns {algValue} algebraic value
     */
    this.Qv = A.run(`(${x})^2 + (${y})^2`)

    /**
     * set to false if x or y are not a number
     * @returns {boolean}
     */
    this.isValid = true;

    // all Point values must be able to be parsed a real float value
    if (isNaN(this.xVal)) {
      this.isValid = false;
      console.error(`x value (${this.x}) is not a number: ${this.xVal}`)
      return
    }
    if (isNaN(this.yVal)) {
      this.isValid = false;
      console.error(`y value (${this.y}) is not a number: ${this.yVal}`)
      return
    }

    /**
     * an array of parent {@link Struct} objects that this Point lies on
     * @returns {Array} of Elements
     */
    this.structs = [];
    //first points have no structs
    if (struct1 && struct2) {
      this.addStructs(struct1)
      this.addStructs(struct2)
    }

  } //constructor


  /**
   * add a parent {@link Struct} to this Point's structs array
   * usually called by the {@link Model} to add intersection points
   * checks to determine if the parent is already present before adding a new one
   * @function
   * @param {Struct} newStruct
   */
  addStructs(newStruct) {
    // check if newStruct is already in list
    if (!this.structs.includes(newStruct)) {
      // add new newStruct to point
      this.structs.push(newStruct);
    }
  }


  /**
   * determine the quadrance (square of distance) from this point to the supplied point
   * - `((this.x) - (point.x))^2 + ((point.y) - (this.y))^2 `
   * @function
   * @param {Point} point
   * @returns {string} algebraic value
   */
  quadranceTo(point) {
    var q = A.run(
      `((${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 `);
    return q;
  }



  /**
   * determine the distance from this point to the supplied point
   * - `( ((this.x) - (point.x))^2 + ((point.y) - (this.y))^2 )^(1/2)`
   * @function
   * @param {Point} point
   * @returns {string} algebraic value
   */
  distanceTo(point) {
    var d = A.run(
      `( ((${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 )^(1/2)`);
    return d;
  }


  /**
   * used for sorting points on a line
   * - if this point is less than test point return -1
   * - if this point is greater than test point return 1
   * - return zero if equal
   * @function
   * @param {Point} point to test
   * @returns {int} -1, 0, 1
   */
  comparePoint(point) {
    var p1x = this.xVal;
    var p1y = this.yVal;
    var p2x = point.xVal;
    var p2y = point.yVal;


    if (p1x < p2x) {
      return -1;
    }
    if (p1x > p2x) {
      return 1;
    }

    //compare strings for equality - not values
    if (this.x === point.x) {
      if (p1y < p2y) {
        return -1;
      }
      if (p1y > p2y) {
        return 1;
      }
    }
    // p1 must be equal to p2
    return 0;
  }

  /** for use with sort
  * - first by x then y - low to high
  * - useful for lines
  * @param {Point} point1
  * @param {Point} point2
  */
  static compare(point1, point2) {
    var p1x = point1.xVal;
    var p1y = point1.yVal;
    var p2x = point2.xVal;
    var p2y = point2.yVal;


    if (p1x < p2x) {
      return -1;
    }
    if (p1x > p2x) {
      return 1;
    }

    //compare strings for equality - not values
    if (point1.x === point2.x) {
      if (p1y < p2y) {
        return -1;
      }
      if (p1y > p2y) {
        return 1;
      }
    }
    // p1 must be equal to p2
    return 0;
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
