/**
 * Intended to be a parent class for the common properties of {@link Line} and {@link Circle}

* TODO: create a common Class of Element for Line and Circle

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 * @param {Point} pt1 - initial point of the element
 * @param {Point} pt2 - initial point of the element
 */
function Element(pt1, pt2) {

}


//add a point to the parent element
function addPointToElement(point) {
  // check if point is already in list
  if (!this.points.includes(point)) {
    // add new point to parent
    this.points.push(point);
  }
}
