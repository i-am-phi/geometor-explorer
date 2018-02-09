// @namespace Geometry */

/**
 * - represents a position within a two dimension cartesian plane - specified by two values
 * - also represents a node in a system of algebraic expressions

 * - other than the two starting points, points are derived through the intersection of elements
 * - the starting values of the first two points are explicitly set and have no parent {@link Struct}

 * TODO: points should be immutable after instantiation

 * TODO: each x, y value is a part of a result set from a System of two Structs

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @class
 * @param {algValue} x - string with algebraic value
 * @param {algValue} y - string with algebraic value
 * @param {Struct} parent1 - parent structure - intersecting line or circle.
 * @param {Struct} parent2 - parent structure - intersecting line or circle.
 * @param {string} type - type of Element - such as "Point" - like a class in CSS
 * @param {string} id - unique id for the Element

 */
class Point extends Element {

  constructor(x, y, parent1, parent2, type, id) {

    type = type || "Point"
    super(type, id)

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
     * floating point value - set by constructor - converted from AlgValue
     * @returns {float}
     */
    this.xVal = A.parseFloat(this.x)

    /**
     * floating point value - set by constructor - converted from AlgValue
     * @returns {float}
     */
    this.yVal = A.parseFloat(this.y)

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

    // all point values must be able to be parsed a real float value
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
     * an array of parent elements that this point lies on
     * @returns {Array} of Elements
     */
    this.parents = [];
    //first points have no parents
    if (parent1 && parent2) {
      this.addParent(parent1)
      this.addParent(parent2)
    }

  } //constructor


  /**
   * add a parent Element or Struct to this Point's parent array
   * usually called by the {@link Model} to add intersection points
   * checks to determine if the parent is already present before adding a new one
   * @function
   * @param {Element}
   */
  addParent(parent) {
    // check if parent is already in list
    if (!this.parents.includes(parent)) {
      // add new parent to point
      this.parents.push(parent);
    }
  }


  /**
   * determine the quadrance (square of distance) from this point to the supplied point
   * @function
   * @param {Point}
   * @returns {string} algebraic value
   */
  quadranceTo(point) {
    var q = A.run(
      `( (${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 )`);
    return q;
  }



  /**
   * determine the distance from this point to the supplied point
   * @function
   * @param {Point}
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

}
