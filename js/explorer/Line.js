/**
 * a linear proportion established by two points

 * constructor calculates linear proportions from the x, y values of the points recieved

 * TODO: points should be immutable after instantiation

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 * @param {Point} pt1 - initial point of the line
 * @param {Point} pt2 - initial point of the line.
 */
function Line(pt1, pt2) {

  if (!(this instanceof Line)) {
    return new Line(pt1, pt2);
  }

  /**
  * id of the element - set by the context of the {@link Model}<br>
  * usually the index in the elements array
  * @returns {string}
  */
  this.id = ""

  /**
  * convenience type check for the element
  * @returns {string} "line"
  */
  this.type = "line"

  /**
  * an array of points on this element
  * @returns {Array} of {@link Point}
  */
  this.points = [];

  /**
  * add a point to this element's point list
  * usually called by the {@link Model} to add intersection points
  * checks to determine if the point is already present
  * @function
  * @param {Point}
  * @returns {Point}
  */
  this.addPoint = addPointToElement;

  // set the first two points
  this.addPoint(pt1)
  this.addPoint(pt2)


  //***************************************

  // calculate equation 1 coefficients
  // ax + by + c form

  var cmd
  alg(`clearall`)

  // coefficent a
  // log(  `    a = (pt1.y) - (pt2.y)`)
  cmd = `a = (${pt1.y}) - (${pt2.y})`
  alg(cmd)
  let a = alg(`a`)
  // log(  `  = ${a}`)

  // coefficent b
  // log(  `b = (pt2.x) - (pt1.x)`)
  cmd = `b = (${pt2.x}) - (${pt1.x})`
  alg(cmd)
  let b = alg(`b`)
  // log(  `  = ${b}`)

  // coefficent c
  // log(  `c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))`)
  cmd = `c = ((${pt1.x}) * (${pt2.y})) - ((${pt2.x}) * (${pt1.y}))`
  alg(cmd)
  let c = alg(`c`)
  // log(  `  = ${c}`)

  /**
  * the equation associated with this element
  * - set by constructor

  * d x^2 + e x y + f y^2 + a x + b y = c

  * d = 0 // always for a line <br>
  * e = 0 // always for a line <br>
  * f = 0 // always for a line <br>
  * a = (pt1.y) - (pt2.y) <br>
  * b = (pt2.x) - (pt1.x) <br>
  * c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))   // but sign is changed to put it on the other side of the equals <br>

  * @returns {Equation}
  */
  this.eq = new Equation(0,0,0,a,b,'-'+c)

  /**
  * check all pairs of contiguous segments on this line for golden ratio instances
  * @function
  * @returns {Array} collection of new {@link Section} objects where `.isGoldenRatio = true`
  */
  this.checkSegments = checkSegments

  /**
  * formatted string representing properties of the line
  *
  * good for logging
  * @function
  * @returns {string}
  */
  this.toString = toStringLine

  /**
  * grouped console output to represent the object
  *
  * perfect for logging
  * @function
  * @returns {string}
  */
  this.log = consoleLine

}


function toStringLine() {

  var str = `${this.type}: ${this.id}
    a: ${this.eq.a}
    b: ${this.eq.b}
    c: ${this.eq.c}
   eq: ${this.eq} [ = 0 ]
xRoot: ${this.xRoot}
yRoot: ${this.yRoot}
points: ${this.points.length}\n`;

  // list related points
  this.points.forEach( function(point){
    str += "    " +  point.type + " :\t" + point.id + "\n";
  })

  return str;
}

// log line to console
function consoleLine(title){

  let titleStr = title || "line"

  console.group( `${this.id} : ${titleStr}` )
  log(this.toString());
  console.groupEnd();

}

//check all points on a line for Golden Ratio instances
function checkSegments() {

  console.groupCollapsed("line: " + this.id + "");

  // clone points before sorting
  var points = this.points.slice(0);

  // sort points on the line
  points.sort( comparePoints );

  //check for golden ratio
  // const GR = "1/2 + 1/2 5^(1/2)"
  // const GRval = alg( `float(${GR})`)

  for (var i = 0; i < points.length-2; i++) {
    //get first segment point
    var pt1 = points[i];

    console.groupCollapsed("(" + pt1.id + ")");


    var cmd = `clearall
      PHI = 1/2 + 1/2 5^(1/2)
      `;
    alg(cmd);

    //loop the remaining points to set first segment
    for (var j = i+1; j < points.length-1; j++) {
      var pt2 = points[j];

      // get the length of the first segment
      cmd = `A = ${pt1.distanceTo(pt2)}
      A
      `;
      var A = alg(cmd);

      if ( algCheckValid(A) ){

        console.groupCollapsed(`> (${pt2.id}) : ${A} ` );

        // loop the remaining points to set second segment
        for (var k = j+1; k < points.length; k++) {
          var pt3 = points[k];

          // get the length of the second segment
          cmd = `B = ${pt2.distanceTo(pt3)}
          B
          `;
          var B = alg(cmd);

          if ( algCheckValid(B) ){

            // console.groupCollapsed(`>> (${pt3.id}) : ${B} = ${Bval}` );
            console.groupCollapsed(`>> (${pt3.id}) : ${B}` );

            // get the ratio fo the segments
            cmd = `R = simplify( A / B )
            R
            `;
            var ratio = alg(cmd);

            log("        * ratio: " + ratio  );

            var check = alg(` R - PHI `);
            var checkVal = alg( `float( R - PHI )`)

            log("check: " + check   );
            log("  val: " + checkVal  );

            if ( checkVal == 0 || checkVal == -1 ) {
              //Success!
              var str = `[${this.id}] : ${pt1.id}> ${A} <${pt2.id}> ${B} <${pt3.id}
        : ${ratio}\n`;
              console.warn("Golden! ", str );
              logSegments( str );
              var s1 = addSegment(pt1, pt2, this);

              var s2 = addSegment(pt2, pt3, this);
              golden.push([s1, s2]);

            }
            console.groupEnd();
          } else {
            // B not valid
          }
        } //for k
        console.groupEnd();
      } else {
        // A not valid
      }
    } // for j
    console.groupEnd();
  } // for i
  console.groupEnd();
}
