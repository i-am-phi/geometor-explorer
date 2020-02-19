/**
 * - represents the set of two points on a line<br>
 * - derives length for determining *Golden Ratio* instances

 * TODO: could be of type {@link Element}
 *
 * @constructor
 * @param {Point} pt1 -  endpoint of the segment
 * @param {Point} pt2 -  endpoint of the segment
 * @param {Line} line -  the line.
 */
export function Segment(pt1, pt2, line) {
  if (!(this instanceof Segment)) {
    return new Segment(pt1, pt2)
  }

  /**
  * id of the segment - set by the context of the {@link Model}<br>
  * usually the index in the elements array
  * @returns {string}
  */
  this.id = ""

  /**
  * convenience type check for the element
  * @returns {string} "line"
  */
  this.type = "segment"


  this.line = line

  /**
  * an array of points on this segment - ordered
  * - only two for a segment
  * @returns {Array} of {@link Point}
  */
  this.points = [pt1, pt2]
  this.points.sort( comparePoints )

  /**
  * algebraic value - set by constructor
  * @returns {algValue} algebraic value
  */
  this.length = pt1.distanceTo(pt2)
  /**
  * floating point value - set by constructor - converted from AlgValue
  * @returns {float}
  */
  this.lengthVal = A.run(`float(${this.length})`)

  /**
  * formatted string representing attribute of the circle
  * @function
  * @returns {string}
  */
  this.toString = function() {
    var str = `${this.type}: ${this.id}
  length: ${this.length}
  lengthVal: ${this.lengthVal}
  points: ${this.points.length}\n`;
  //TODO: list related points
    this.points.forEach( function(point){
      str += "    " +  point.type + " :\t" + point.id + "\n";
    });
    return str;
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
