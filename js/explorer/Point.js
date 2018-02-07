// @namespace Geometry */

/**
 * represents a position within a two dimension cartesian plane - specified by two values

 * other than the two starting points, points are derived through the intersection of elements

 * TODO: points should be immutable after instantiation

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 * @param {algValue} x - string with algebraic value
 * @param {algValue} y - string with algebraic value
 * @param {Element} parent1 - parent element - intersecting line or circle.
 * @param {Element} parent2 - parent element - intersecting line or circle.
 */
function Point(x, y, parent1, parent2) {

  //if someone calls function without instantiating object - return new object
  if (!(this instanceof Point)) {
    return new Point(x, y, parent1, parent2);
  }

  /**
  * id of the element - set by the context of the {@link Model}<br>
  * usually the index in the elements array
  * @returns {string}
  */
  this.id = ""

  /**
  * convenience type check for the element
  * @returns {string} "point"
  */
  this.type = "point"

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
  this.xVal = getNumber( this.x )

  /**
  * floating point value - set by constructor - converted from AlgValue
  * @returns {float}
  */
  this.yVal = getNumber( this.y )

  /**
  * set to false if x or y are not a number
  * @returns {boolean}
  */
  this.isValid = true;

  // all point values must be able to be parsed a real float value
  if (isNaN( this.xVal )) {
    this.isValid = false;
    console.error(`x value (${this.x}) is not a number: ${this.xVal}`)
    return
  }
  if (isNaN( this.yVal )) {
    this.isValid = false;
    console.error(`y value (${this.y}) is not a number: ${this.yVal}`)
    return
  }

  /**
  * an array of parent elements that this point lies on
  * @returns {Array} of Elements
  */
  this.parents = [];

  /**
  * add a point to this element's point list
  * usually called by the {@link Model} to add intersection points
  * checks to determine if the point is already present
  * @function
  * @param {Point}
  * @returns {Point}
  */
  this.addParent = addParentToPoint

  //first points have no parents
  if (parent1 && parent2) {
    this.addParent(parent1)
    this.addParent(parent2)
  }

  /**
  * determine the distance from this point to the supplied point
  * @function
  * @param {Point}
  * @returns {string} algebraic value
  */
  this.distanceTo = distanceTo

  /**
  * used for sorting points on a line
  * - if this point is less than test point return -1
  * - if this point is greater than test point return 1
  * - return zero if equal
  * @function
  * @param {Point} point to test
  * @returns {int} -1, 0, 1
  */
  this.compare = comparePoint

  /**
  * formatted string representing attribute of the object
  *
  * @function
  * @returns {string}
  */
  this.toString = toStringPoint

  /**
  * grouped console output to represent the object
  *
  * perfect for logging
  * @function
  * @returns {string}
  */
  this.log = consolePoint

}

////////////////

function toStringPoint() {
  var str =
`${this.type}: ${this.id}
   x =  ${this.x}
xVal =  ${this.xVal}
   y =  ${this.y}
yVal =  ${this.yVal}
* parents: ${this.parents.length}\n`

  this.parents.forEach( function(parent){
    str += "    " +  parent.id + " :\t" + parent.type + "\n";
  });

  return str;
}


/** @private */
function consolePoint(title){

  let titleStr = title || "point"

  console.group( `${this.id} : ${titleStr}` )
  log(this.toString());
  console.groupEnd();

}


//add a parent to the point
function addParentToPoint(parent) {
  // check if parent is already in list
  if (!this.parents.includes(parent)) {
    // add new parent to point
    this.parents.push(parent);
  }
}


//used in Point object
function distanceTo(point) {
  var d = alg(
    `( ((${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 )^(1/2)` );
  return d;
}



// for sorting points along a line
function comparePoint(point) {
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
