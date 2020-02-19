import Element from './Element.js'
/**
  * represents a structure defined by a set of proportions establsihed by two {@link Point} objects
 * - extends from {@link Element}
 * - base class for structures within the {@link Model}
 * - see subclass {@link Line}
 * - see subclass {@link Circle}

 * **TODO** Struct should take an Array of Point objects - allowing for polygons<br>
 * **TODO** There are only 3 distinct relationships that can occur between two points - a Line and two Circle.
The determination of these three relationships could happen here as fundamental to a Struct of two points

These three objects, Line and two Circles, always imply at least 4 additional points to the model

 *
 * @class
 * @param {Point} pt1 - initial point of the structure
 * @param {Point} pt2 - initial point of the structure
 * @param {string} type - optional - default: "Struct"
 * @param {string} id - optional

 */
export default class Struct extends Element {
  constructor(pt1, pt2, type, id) {

    type = type || "Struct"

    super( type, id )

    /** Array of {@link Point} objects on this Struct */
    this.points = []

    if (pt1) { this.points.push(pt1) }
    if (pt2) { this.points.push(pt2) }

    /** all Struct objects have an equation that are set by the sub class */
    this.eq = ""
  }

  /**
  * - adds {@link Point} object **ON** the Struct
  * - usually from the intersection with another Struct
  * - derived by a {@link System} object
  * @function
  * @param {Point} newPoint
  * @returns {Point} returns existing point if there is a match
  */
  addPoint(newPoint) {
    // check if point is already in list
    if (!this.points.includes(newPoint)) {
      // add new point to parent
      this.points.push(newPoint)
    }
    return newPoint
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
