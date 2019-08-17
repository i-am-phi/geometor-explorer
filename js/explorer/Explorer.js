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

  /** add {@link Line} to {@link Model} and {@link View}
  *

  * @function
  * @param {int} pt0Id - index of point in collection to use for first point
  * @param {int} pt1Id - index of point in collection to use for second point
  * @returns {Line} return existing if found.
  */
  addLine(pt0Id, pt1Id) {

    // reassign in case existing struct is found
    let pt0 = this.M.points[pt0Id]
    let pt1 = this.M.points[pt1Id]
    let line = new Line(pt0, pt1)

    let struct = this.M.addStruct(line)

    let intersectionPoints = this.M.getIntersectionPoints(struct)

    this.V.addStruct(struct)

    intersectionPoints.forEach( point => this.V.addPoint(point) )

    return struct
  }

  /** add {@link Circle} to {@link Model} and {@link View}
  *

  * @function
  * @param {int} ptCid - index of point in collection to use for center
  * @param {int} ptRid - index of point in collection to use for radius
  * @returns {Circle} return existing if found.
  */
  addCircle(ptCid, ptRid) {

    // reassign in case existing struct is found
    let ptC = this.M.points[ptCid]
    let ptR = this.M.points[ptRid]
    let circle = new Circle(ptC, ptR)

    let struct = this.M.addStruct(circle)

    let intersectionPoints = this.M.getIntersectionPoints(struct)

    this.V.addStruct(struct)

    intersectionPoints.forEach( point => this.V.addPoint(point) )

    return struct
  }

  /** @author 𝚽 <phi@geometor.com>
   * @license MIT
   */
} //class
