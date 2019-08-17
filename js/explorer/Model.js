
/**
 * a container for holding a sets of points, elements.
 * - segments and other graphical elements may also be contained in the model
 * - generally instantiated by Explorer
 *
 * @class
 */
class Model {

  constructor() {

    /**
    * the array of {@link Point} objects within the Model
    * @returns {Array} of {@link Point}
    */
    this.points = []

    /**
    * the array of {@link Struct} objects (Lines and Circles) within the Model
    * @returns {Array}
    */
    this.structs = []

    /**
    * the array of {@link Segment} along lines that are participating in golden sections
    * @returns {Array}
    */
    this.segments = []

    /**
    * the array of {@link Section} objects on a line that are in the golden ratio
    * @returns {Array}
    */
    this.sections = []

    // store each system solution in an array
    /**
    * the array of {@link System} objects
    * @returns {Array}
    */
    this.systems = [];

  }
  /**
  * add a {@link Point} to the Model.points Array<br>
  * usually called to add new intersection points<br>
  * checks to determine if the newPoint is already in the Array - if so, returns exisitng point<br>
  * @function
  * @param {Point} newPoint
  * @returns {Point} returns existing point if there is a match or new point if not
  */
  addPoint(newPoint) {

    // look for exisiting points with same x, y
    let existingPoint = this.findPointbyTag(newPoint.tag);

    if (existingPoint) {

      console.log("existing point found")
      // add new point parents to existing point
      if (newPoint.parents) {
        newPoint.parents.forEach( parent => {
          existingPoint.addParent(parent)
        })

      }

      return existingPoint

    } else {

      newPoint.id = this.points.length
      this.points.push(newPoint)

      return newPoint

    }

  }


  /**
  * Find {@link Point} in Model.points with a matching tag string
  * tag should be a unique string with the X, Y values
  * @function
  * @param {String} tag
  * @returns {Point} returns existing point if there is a match
  */
  findPointbyTag(tag) {

    for (const i in this.points) {
      if ( this.points[i].tag == tag ) {
        return this.points[i]
      }
    }

  }

  /**
  * add an {@link Struct} to the Model.structs Array
  * usually called after a valid Struct is created
  * checks to determine if the Struct is already present
  * @function
  * @param {Struct} newStruct
  * @returns {Struct} returns existing element if there is a match
  */
  addStruct(newStruct) {

    // look for other points with same x, y
    let existingStruct //= this.findStruct( newStruct );

    if (existingStruct) {

      return existingStruct

    } else {

      newStruct.id = this.structs.length

      this.structs.push(newStruct)

      return newStruct

    }

  }

  /**
  * get list of new intersection points for the struct
  * @function
  * @param {Struct} newStruct
  * @returns {Array} array of intersection points
  */

  getIntersectionPoints(newStruct) {

    let intersectionPoints = []

    // check all other existing structs for intersection
    this.structs.forEach( exStruct => {

      if (newStruct.id != exStruct.id) {
        let sys = new System(newStruct, exStruct)

        //add new points to each Struct
        sys.points.forEach( point => {

          this.addPoint(point)
          intersectionPoints.push(point)

          //add point to each parent point list
          newStruct.addPoint(point);
          exStruct.addPoint(point);

        }, this)

        //add this system to the collection
        this.systems.push(sys)

        console.dir(sys)
      }


    }, this);

    return intersectionPoints

  }
  /**
  * Find {@link Struct} in Model.structs with a matching equation parameters

  * TODO: complete this

  * @function
  * @param {Struct} newStruct
  * @returns {Struct} returns existing Struct if there is a match
  */
  findStruct( newStruct ) {

    // check equation parameters for sameness
    this.structs.forEach( exStruct => {
      if ( exStruct.eq.a == newStruct.eq.a  &&
           exStruct.eq.b == newStruct.eq.b  &&
           exStruct.eq.c == newStruct.eq.c  &&
           exStruct.eq.d == newStruct.eq.d  &&
           exStruct.eq.e == newStruct.eq.e  &&
           exStruct.eq.f == newStruct.eq.f
          ) {
        return exStruct
      }
    })
  }

  /**
  * add a {@link Segment} to the Model.segments Array
  * usually called when the lengths of pair of segments are in the golden ratio
  * checks to determine if the point is already present

  * - **TODO** needs rework
  * @function
  * @param {Segment} newSegment
  * @returns {Segment} returns existing segment if there is a match
  */
  addSegment( newSegment ) {

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

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class








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
