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
  this.addLine   = addLineToExplorer
  this.addCircle = addCircleToExplorer

}

function addPointToExplorer(point) {

  this.model.addPoint(point)

  this.view.addPoint(point)


}

function addLineToExplorer(line) {

  this.model.addLine(line)

  //get intersection points with other elements


  this.view.addLine(line)


}

function addCircleToExplorer(circle) {

  this.model.addCircle(circle)

  this.view.addCircle(circle)

}
