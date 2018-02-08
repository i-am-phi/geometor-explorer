/**
 * Controller for the {@link Model} and {@link View}

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 */
function Explorer() {

  this.model = new Model()
  this.view = new View()

  this.addPoint  = addPointToExplorer
  this.addElement   = addElementToExplorer

}

function addPointToExplorer(point) {

  point = this.model.addPoint(point)

  this.view.addPoint(point)

  return point

}

function addElementToExplorer(element) {

  element = this.model.addElement(element)

  //get intersection points with other elements

  this.view.addElement(element)

}

function addCircleToExplorer(circle) {

  this.model.addCircle(circle)

  this.view.addCircle(circle)

}
