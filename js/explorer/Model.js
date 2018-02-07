/**
 * a container for holding a sets of points, elements.
 * segments and other graphical elements may also be contained in the model

 * generally instantiated by Explorer

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 */
function Model() {

  /**
  * the array of {@link Point} objects within the Model

  * @returns {Array} of {@link Point}
  */
  this.points = []
  /**
  * add a {@link Point} to the Model.points Array<br>
  * usually called to add new intersection points<br>
  * checks to determine if the newPoint is already in the Array - if so, returns exisitng point<br>
  * @function
  * @param {Point} newPoint
  * @returns {Point} returns existing point if there is a match or new point if not
  */
  this.addPoint = addPointToModel
  /**
  * Find {@link Point} in Model.points with a matching x, y
  * @function
  * @param {algValue} x
  * @param {algValue} y
  * @returns {Point} returns existing point if there is a match
  */
  this.findPoint = findPointInModel

  /**
  * the array of {@link Element} objects (Lines and Circles) within the Model
  * @returns {Array}
  */
  this.elements = []
  /**
  * add an {@link Element} to the Model.elements Array
  * usually called after a valid Element is created
  * checks to determine if the Element is already present
  * @function
  * @param {Element} newElement
  * @returns {Element} returns existing element if there is a match
  */
  this.addElement = addElementToModel
  /**
  * Find {@link Element} in Model.elements with a matching equation parameters

  * TODO: complete this

  * @function
  * @param {Element} x
  * @param {algValue} y
  * @returns {Point} returns existing point if there is a match
  */
  this.findElement = findElementInModel

  /**
  * the array of {@link Segment} along lines that are participating in golden sections
  * @returns {Array}
  */
  this.segments = []
  /**
  * add a {@link Segment} to the Model.segments Array
  * usually called when the lengths of pair of segments are in the golden ratio
  * checks to determine if the point is already present
  * @function
  * @param {Segment} newSegment
  * @returns {Segment} returns existing segment if there is a match
  */
  this.addSegment = addSegmentToModel

  /**
  * the array of {@link Section} objects on a line that are in the golden ratio
  * @returns {Array}
  */
  this.goldensections = []

  // store each system solution in an array
  /**
  * the array of {@link System} objects
  * @returns {Array}
  */
  this.systems = [];


}

// add a point to list but check if it exists first
function addPointToModel(newPoint) {

  // look for exisiting points with same x, y
  existingPoint = this.findPoint(newPoint.x, newPoint.y);

  if (existingPoint) {

    log("point exists: " + existingPoint.id )

    // add new point parents to existing point
    newPoint.parents.forEach( parent => {
      existingPoint.addParent(parent)
    })

    return existingPoint

  } else {

    log("add point to list: " + newPoint.id )
    newPoint.id = this.points.length
    this.points.push(newPoint)
    return newPoint

  }

}

function findPointInModel(x, y) {

  this.points.forEach(point => {
    if ( point.x == x  &&  point.y == y ) {
      return point
    }
  })

}


function addElementToModel(newElement) {

  // look for other points with same x, y
  existingElement = this.findElement( newElement );

  if (existingElement) {

    log("element exists: " + existingElement.id )
    return existingElement

  } else {

    log("adding element to model: " + newElement.id )

    //////////////////////////////////////////////
    // TODO check for intersections with existing elements
    // this.intersect = lineIntersect;
    elements.forEach( element => {

      // console.group(`> ${element.id} : ${element.type} `)
      let sys = new System(newElement, element)
      this.systems.push(sys)

      sys.roots.forEach( point => {
        this.addPoint(point)
      })      // console.groupEnd();

    }, this);

    newElement.id = this.elements.length

    this.elements.push(newElement)
    return newElement

  }

}

function findElementInModel(element) {

  // check equation parameters for sameness
  this.elements.forEach( exElement => {
    if ( exElement.eq.a == element.eq.a  &&
         exElement.eq.b == element.eq.b  &&
         exElement.eq.c == element.eq.c  &&
         exElement.eq.d == element.eq.d  &&
         exElement.eq.e == element.eq.e  &&
         exElement.eq.f == element.eq.f
        ) {
      return exElement
    }
  })
}


// maintain single instance of a segment
function addSegmentToModel(pt1, pt2, line) {

  // look for a segment on the line with matching points
  var seg = segments.filter( segment => {
      if ( segment.line === line ) {
        if ( segment.points.includes(pt1) && segment.points.includes(pt2) ) {
          return true
        }
      }
    });

  if ( seg.length != 0 ) {
    // if any segments were found, send the first
    return seg[0]
  } else {
    return new Segment( pt1, pt2, line )
  }

}

function getPointAncestors(point, ancestors) {
  //stop at starting points
  console.group("point: " + point.id)
  if ( point.id == "0" || point.id == "1" ) {
    // end with starting points
    console.warn("skip this point")

  } else {


    // get first two parents on point
    for (var i = 0; i <=1; i++) {

      var parent = point.parents[i];

      //don't repeat parents in array
      if (!ancestors[parent.id]) {
        console.group("parent: " + parent.id);
        ancestors[parent.id] = parent;


        if ( parent.type === "line" ) {
          getPointAncestors( parent.points[0], ancestors );
          getPointAncestors( parent.points[1], ancestors );

        }
        if ( parent.type === "circle" ) {
          // getPointAncestors( parent.center, ancestors );
          getPointAncestors( parent.points[0], ancestors );
        }


        console.groupEnd();
      } else {
        //ancestor already in list
      }
    }

  }
  console.groupEnd();

}

// call checkSegments for all lines
function checkAllSegments(){
  elements.forEach( function(element) {
    if (element.type == 'line') {
      checkSegments(element);
    }
  });
}
