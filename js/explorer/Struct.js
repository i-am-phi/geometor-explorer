/**
 * - base class for structures within the the {@link Model}
 * - extends from {@link Element} class
 * - a structure is an {@link Element} defined by a set of proportions establsihed by two {@link Point} objects
 * - see {@link Line}
 * - see {@link Circle}

 * **TODO** Struct should take an Array of Point objects - allowing for polygons

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @class
 * @param {Point} pt1 - initial point of the structure
 * @param {Point} pt2 - initial point of the structure
 * @param {string} type - default: "Struct"
 * @param {string} id - optional

 */
class Struct extends Element {

  constructor(pt1, pt2, type, id) {

    type = type || "Struct"

    super( type, id )

    this.points = []

    this.points.push(pt1)
    this.points.push(pt2)

    /** all Struct objects have an equation */
    this.eq = ""

  }

  /**
  * - adds {@link Point} object **ON** the Struct
  * - usually from the intersection with another Struct
  * - derived by the {@link System}
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

}
