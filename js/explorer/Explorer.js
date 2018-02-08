/**
* Global instance of the {@link Model} object
* @const
*/
const M = new Model()
/**
* Global instance of the {@link View} object
* @const
*/
const V = new View()

/**
 * Controller for the {@link Model} and {@link View}

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 */
function Explorer() {

  /**
  * add Point to Model and View
  * @function
  * @param {Point}
  * @returns {Point} return existing if found.
  */
  this.addPoint  = addPointToExplorer
  /** add Element to Model and View
  * @function
  * @param {Element}
  * @returns {Element} return existing if found.
  */
  this.addElement   = addElementToExplorer

}

function addPointToExplorer(point) {

  point = M.addPoint(point)

  V.addPoint(point)

  return point

}

function addElementToExplorer(element) {

  element = M.addElement(element)

  //get intersection points with other elements

  V.addElement(element)

  return element

}

function addCircleToExplorer(circle) {

  M.addCircle(circle)

  V.addCircle(circle)

}
