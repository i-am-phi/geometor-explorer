/**
 * provides the context for an algebriac framework to explore proportions in classical constructive geometry.
 * - establishes a two dimensional cartesian plane
 * - maintains the {@link Model} - a collection of {@link Element} objects
 * - controls the {@link View} - methods for rendering an {@link Element} in SVG and UI lists
 * - provides an interface to create {@link Point} and {@link Struct} objects
 * - script the construction in {@link main}

 *
 * @class
 * @example

 * const E = new Explorer();

 * // initial points set by X Y
 * let P0 = new Point( "-1/2", "0" )
 * E.addPoint(P0)
 * P0.log()

 * let P1 = new Point( "1/2", "0" )
 * E.addPoint(P1)
 * P1.log()

 * const L1 = new Line( P0, P1 )
 * E.addStruct(L1)
 * L1.log()

 */
class Explorer {

  constructor() {
    /**
    * Global instance of the {@link Model} object
    * @const
    */
    this.M = new Model()

    /**
    * Global instance of the {@link View} object
    * @const
    */
    this.V = new View()

  }

  /**
   * add Point to Model and View
   * @function
   * @param {Point} point
   * @returns {Point} return existing if found.
   */
  addPoint(point) {

    // reassign in case existing point is found
    point = this.M.addPoint(point)

    this.V.addPoint(point)

    return point
  }

  getPoints() {
    return this.M.points
  }

  /** add {@link Struct} (ie - Line or Circle) to {@link Model} and {@link View}

  * TODO: get intersection points with other structs

  * @function
  * @param {Struct} struct
  * @returns {Struct} return existing if found.
  */
  addStruct(struct) {

    // reassign in case existing struct is found
    struct = this.M.addStruct(struct)

    let intersectionPoints = this.M.getIntersectionPoints(struct)

    this.V.addStruct(struct)

    intersectionPoints.forEach( point => this.V.addPoint(point) )

    return struct

  }

  /** @author 𝚽 <phi@geometor.com>
   * @license MIT
   */
} //class
