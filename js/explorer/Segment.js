
var segments = [];
var golden = [];



//////////////////////////////////////////////

function Segment(pt1, pt2, line) {

  if (!(this instanceof Segment)) {
    return new Segment(pt1, pt2);
  }

  this.id = segments.length;
  this.type = "segment";
  this.line = line;

  log( `+ ${this.type} : ${this.id} ` );

  this.points = [pt1, pt2];
  this.points.sort( comparePoints );


  this.length = pt1.distanceTo(pt2);
  this.lengthVal = alg(`float(${this.length})`);

  var p1x = pt1.xVal;
  var p1y = pt1.yVal;
  var p2x = pt2.xVal;
  var p2y = pt2.yVal;

  var strokeWidth = this.lengthVal / STROKEFACTOR;
  var dashOffset = strokeWidth;
  var dashLength =  this.lengthVal - (dashOffset * 2);

  this.element = groupSegments.line(p1x, p1y, p2x, p2y)
    .addClass("Segment")
    .attr({
      id: "s" + this.id,
      'segment-id': this.id,
      'stroke-width': strokeWidth,
      'stroke-dashoffset': -dashOffset,
      'stroke-dasharray': dashLength + " " + dashOffset,

    })
    .marker('start', 4, 4, function(add) {
      add.circle(2).center(2,2)
    })
    .marker('end', 4, 4, function(add) {
      add.circle(2).center(2,2)
    })

  this.markerStart = this.element.attr('marker-start').replace("url(", "").replace(")", "")
  this.markerEnd = this.element.attr('marker-end').replace("url(", "").replace(")", "")

  setSegment(this);

  //add this element to array
  segments.push(this);

  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);


  this.toString = function() {
    var str = `${this.type}: ${this.id}
  length: ${this.length}
  lengthVal: ${this.lengthVal}
  points: ${this.points.length}\n`;
  //TODO: list related points
    this.points.forEach( function(point){
      str += "    " +  point.type + " :\t" + point.id + "\n";
    });
    return str;
  }

}





//check all points ona line for Golden Ration instances
function checkSegments(line) {

  console.groupCollapsed("line: " + line.id + "");

  // clone points before sorting
  var points = line.points.slice(0);

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

      if ( checkValid(A) ){

        console.groupCollapsed(`> (${pt2.id}) : ${A} ` );

        // loop the remaining points to set second segment
        for (var k = j+1; k < points.length; k++) {
          var pt3 = points[k];

          // get the length of the second segment
          cmd = `B = ${pt2.distanceTo(pt3)}
          B
          `;
          var B = alg(cmd);

          if ( checkValid(B) ){

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
              var str = `[${line.id}] : ${pt1.id}> ${A} <${pt2.id}> ${B} <${pt3.id}
        : ${ratio}\n`;
              console.warn("Golden! ", str );
              logSegments( str );
              var s1 = addSegment(pt1, pt2, line);

              var s2 = addSegment(pt2, pt3, line);
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

// maintain single instance of a segment
function addSegment(pt1, pt2, line) {
  // look for a segment on the line with matching points
  var seg = segments.filter( function (segment) {
      if ( segment.line === line ) {
        if ( segment.points.includes(pt1) && segment.points.includes(pt2) ) {
          return true
        }
      }
    });

  if ( seg.length != 0 ) {
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
