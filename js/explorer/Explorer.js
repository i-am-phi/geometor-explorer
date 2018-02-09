

/**
 * Controller for the {@link Model} and {@link View}

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @class
 */
class Explorer {

  /**
  * add Point to Model and View
  * @function
  * @param {Point} point
  * @returns {Point} return existing if found.
  */
  addPoint(point) {

    point = M.addPoint(point)

    V.addPoint(point)

    return point

  }

  /** add {@link Struct} (ie - Line or Circle) to Model and View

  * TODO: get intersection points with other structs

  * @function
  * @param {Struct} struct
  * @returns {Struct} return existing if found.
  */
  addStruct(struct) {

    struct = M.addStruct(struct)

    //TODO: get intersection points with other structs

    // V.addStruct(struct)

    return struct

  }

}
