const PRECISION = 8;

//constants

// connect to SVG element
var D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

// radius for point icon
const PTRAD = .025;
// for variable width stroke on segments in proportion to the line length
const STROKEFACTOR = 20;

var points = [];
var elements = [];
var segments = [];
var golden = [];


//use groups as layers to keep points on top and selectable
var groupCircles = D.group().attr({ id: "Circles" });
var groupLines = D.group().attr({ id: "Lines" });
var groupSegments = D.group().attr({ id: "Segments" });
var groupPoints = D.group().attr({ id: "Points"  });

/* ****************************************************************/
function Point(x, y, parent1, parent2) {

  //if someone calls function without instantiating object - return new object
  if (!(this instanceof Point)) {
    return new Point(x, y, parent1, parent2);
  }

  this.id = points.length;
  this.type = "point";

  console.group( `+ ${this.type} : ${this.id} ` );

  // trust that the values are ok
  this.x = x;
  this.y = y;
  // this.x =  alg( `simplify( ${x} )` )
  // this.y =  alg( `simplify( ${y} )` )
  this.xVal = getNumber( this.x );
  this.yVal = getNumber( this.y );

  this.parents = [];
  //first points have no parents
  if (parent1 && parent2) {
    this.parents = [parent1, parent2];
  }

  //TODO: make the point an SVG symbol

  this.element = groupPoints.circle(PTRAD * 2).cx(this.xVal).cy(this.yVal)
    .addClass("Point")
    .attr({
      id: 'p' + this.id,
      'point-id': this.id,
      title: `[${this.x}, ${this.y}]`,
    });

  // add point to the array
  points.push(this);

  //add point to the animation
  setPoint("#p" + this.id);

  this.distanceTo = distanceTo;
  this.addParent = addParentToList;

  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);

  this.toString = function() {

    var str = `${this.type}: ${this.id}
     x: ${this.x}
  xVal: ${this.xVal}
     y: ${this.y}
  yVal: ${this.yVal}
  * parents: ${this.parents.length}\n`;
    this.parents.forEach( function(parent){
      str += "    " +  parent.id + " :\t" + parent.type + "\n";
    });

    return str;
  }

  logPoint(this);
  // log(this);
  console.dir(this);
  console.groupEnd();
}

// add a point but check if it exists first
function addPoint(x, y, parent1, parent2) {
  // log(`    + add point: ${x}, ${y} `);
  var point;
  console.group("+ point")
  log(`x: ${x}`)
  log(`y: ${y}`)

  // TODO: determine if value check is necessary
  var xVal = getNumber(x);
  var yVal = getNumber(y);

  if (!isNaN( xVal ) && !isNaN( yVal )) {

    // look for other points with same x, y
    // if point exists, add unique "parents" to point
    point = findPoint(x, y);

    if (point) {
      log("point exists: " + point.id )
      // add new parents to existing point
      point.addParent(parent1);
      point.addParent(parent2);

    } else {
      log("create new point")
      point = new Point(x, y, parent1, parent2);

    }
  } else {
    log("      * not a valid point\n");
    return;
  }

  //add point to each parent point list
  parent1.addPoint(point);
  parent2.addPoint(point);

  console.groupEnd();

  return point;

}

//add a parent to the point
function addParentToList(parent) {
  // check if parent is already in list
  if (!this.parents.includes(parent)) {
    // add new parent to point
    this.parents.push(parent);
  }
}

//add a point to the parent element
function addPointToList(point) {
  // check if point is already in list
  if (!this.points.includes(point)) {
    // add new point to parent
    this.points.push(point);
  }

}

// for sorting points
function comparePoints(p1, p2) {
  var p1x = p1.xVal;
  var p1y = p1.yVal;
  var p2x = p2.xVal;
  var p2y = p2.yVal;

  if (p1x < p2x) {
    return -1;
  }
  if (p1x > p2x) {
    return 1;
  }

  //compare strings for equality - not values
  if (p1.x === p2.x) {
    if (p1y < p2y) {
      return -1;
    }
    if (p1y > p2y) {
      return 1;
    }
  }
  // p1 must be equal to p2
  return 0;
}

/* ****************************************************************/
function Line(pt1, pt2) {

  if (!(this instanceof Line)) {
    return new Line(pt1, pt2);
  }

  this.id = elements.length;
  this.type = "line";

  console.group( `+ ${this.type} : ${this.id} ` );

  this.points = [];

  this.points[0] = pt1;
  this.points[1] = pt2;

  console.group("point: " + pt1.id)
  log(`pt1.x = ${pt1.x}`);
  log(`pt1.y = ${pt1.y}`);
  console.groupEnd();
  console.group("point: " + pt2.id)
  log(`pt2.x = ${pt2.x}`);
  log(`pt2.y = ${pt2.y}`);
  console.groupEnd();
  log(`---`)

  //calculate equation 1 coefficients
  // ax + by + c form
  var cmd

  alg(`clearall`)

  // coefficent a
  log(  `    a = (pt1.y) - (pt2.y)`)
  cmd = `    a = (${pt1.y}) - (${pt2.y})`
  alglog(cmd)
  this.a = alg(`a`)
  log(  `      = ${this.a}`)

  // coefficent b
  log(  `    b = (pt2.x) - (pt1.x)`)
  cmd = `    b = (${pt2.x}) - (${pt1.x})`
  alglog(cmd)
  this.b = alg(`b`)
  log(  `      = ${this.b}`)

  // coefficent c
  log(  `    c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))`)
  cmd = `    c = ((${pt1.x}) * (${pt2.y})) - ((${pt2.x}) * (${pt1.y}))`
  alglog(cmd)
  this.c = alg(`c`)
  log(  `      = ${this.c}`)

  // equation
  cmd = `   eq = (a) x + (b) y + (c)`
  alglog(cmd)
  this.eq = alg(`eq`)
  log(  `   eq = (${this.a}) x + (${this.b}) y + (${this.c})`)
  log(  `      = ${this.eq}`)

  // degree of x term - should be 1 or 0 for vertical line
  cmd = ` degX = deg(eq, x)`
  alglog(cmd)
  this.degX = alg(`degX`)
  log(  `      = ${this.degX}`)

  if (this.degX != 0) {
    // solve eq for x
    cmd = `  eqX = roots(eq, x)`
    alglog(cmd)
    // this.eqX = alg(`eqX`)
    this.eqX = parseRoots( alg(`eqX`) )
    if (this.eqX) {
      this.eqX.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.eqX}`)
    }
  }

  // degree of y term - should be 1 or 0 for vertical line
  cmd = ` degY = deg(eq, y)`
  alglog(cmd)
  this.degY = alg(`degY`)
  log(  `      = ${this.degY}`)

  if (this.degY != 0) {
    // solve eq for y
    cmd = `  eqY = roots(eq, y)`
    alglog(cmd)
    // this.eqY = alg(`eqY`)
    this.eqY = parseRoots( alg(`eqY`) )
    if (this.eqY) {
      this.eqY.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.eqY}`)
    }

    this.dim = this.degX > this.degY ? this.degX : this.degY

    //calculate equation 1 coefficients
    // y = mx + n form
    // var bVal = getNumber(this.b);

    var cmd = `
    # i think a should be negative
    m = -(a) / (b)
    m
    n = -(c) / (b)
    n
    eq2 = m * x + n
    eq2
    `;

    // run script and parse result
    // returns m, n, eq2
    var result = alg(cmd).split("\n");

    this.m = result[0];
    this.n = result[1];
    this.eq2 = result[2];

    log(`   m: ${this.m}`)
    log(`   n: ${this.n}`)
    log(` eq2: ${this.eq2}`)

  }


  log(`---`)

  // set xRoot if not horizontal
  if (this.a != 0) {
    this.xRoot = alg( `roots(eq, x)` );
  } else {
    // leave undefined
  }

  // set yRoot if not vertical
  if (this.b != 0) {
    this.yRoot = alg( `roots(eq, y)` );
  } else {
    // leave undefined
  }

  //////////////////////////////////////////////
  //methods

  this.addPoint = addPointToList;

  // get y value for corresponding x
  this.getY = function(x) {
    var y, deg;
    if (this.yRoot) {
      deg = alg( `deg(${this.yRoot})` );
      if (deg == 1) {
        y = alg( `subst((${x}), x, (${this.yRoot}))` );
      } else {
        y = this.yRoot;
      }
    } else {
      // y is undefined
    }
    return y;
  }

  // get x value for corresponding y
  this.getX = function(y) {
    var x, deg;
    if (this.xRoot) {
      deg = alg( `deg(${this.xRoot})` );
      if (deg == 1) {
        x = alg( `subst((${y}), y, (${this.xRoot}))` );
      } else {
        x = this.xRoot;
      }
    } else {
      // x is undefined
    }
    return x;
  }

  //////////////////////////////////////////////
  // draw line to edge of the viewbox
  var box = getViewboxIntersection(this);
  // log(box);
  //create SVG element
  this.element = groupLines.line(box[0], box[1], box[2], box[3])
    .addClass("Line")
    .attr({
      id: "i" + this.id,
      'element-id': this.id
    })
    ;

  setLine("#i" + this.id);

  //////////////////////////////////////////////
  //check for intersections with existing elements
  // this.intersect = lineIntersect;
  elements.forEach(function(element) {
    console.group(`> ${element.id} : ${element.type} `)
    intersect(this, element) ;
    console.groupEnd();
  }, this);


  //add this element to array
  elements.push(this);

  // set UI hover and click
  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);

  // summarize attributes for toString
  this.toString = function() {
    var str = `${this.type}: ${this.id}
      a: ${this.a}
      b: ${this.b}
      c: ${this.c}
     eq: ${this.eq} [ = 0 ]
      m: ${this.m}
      n: ${this.n}
    eq2: [ y = ] ${this.eq2}
  xRoot: ${this.xRoot}
  yRoot: ${this.yRoot}
  points: ${this.points.length}\n`;
    // list related points
    this.points.forEach( function(point){
      str += "    " +  point.type + " :\t" + point.id + "\n";
    });
    return str;
  }

  logLine(this);
  // log(this);
  console.dir(this);
  console.groupEnd();

}

function lineIntersect (line, element) {

  //intersect this Line with Line
  if ((element instanceof Line)) {
    intersectLineLine(line, element);
  }

  //intersect this Line with Circle
  if ((element instanceof Circle)) {
    intersectLineCircle(line, element);
  }

}

function intersectLineLine (line1, line2) {
  console.group("line:" + line1.id + " > line:" + line2.id);
  var x, y;

  if (line1.m == line2.m) {
    //lines are parallel;
    log(`parallel: m eq: ${line1.m}`)
    console.groupEnd()
    return;
  }

  //TODO: not sure why this second test is in here :)
  // order of the points might have created +/- issue
  var test1 = alg(`(${line1.a}) * (${line2.b})`)
  var test2 = alg(`(${line2.a}) * (${line1.b})`)

  if ( test1 == test2 ) {
    //lines are parallel;
    log(`parallel: cross ab eq: ${test1}`)
    console.groupEnd()
    return;
  }

  // console.group("subtract");

  var cmd = `
  L1 = ${line1.eq}
  L2 = ${line2.eq}
  # subtract equations
  S = L1 - L2
  `;
  alg(cmd)

  log("L1: " + alg("L1"))
  log("L2: " + alg("L2"))
  log(" S: " + alg("S"))

  var degX = alg("deg(S, x)")
  log(" deg(S, x): " + degX)

  if (degX != "0") {

    log(" Sx: " + alg("Sx = roots(S, x)\nSx") )
    y = alg( "y1 = roots( subst( Sx, x, L1 ), y ) \n y1" )
    log("  y = " + y )
    x = alg( "roots( subst( y1, y, L1 ), x )" )
    log("  x = " + x )

  } else {

    var degY = alg("deg(S, y)")
    log(" deg(S, y): " + degY)

    if (degY != "0") {

      log(" Sy: " + alg("Sy = roots(S, y) \n Sy") )
      x = alg("x1 = roots( subst( Sy, y, L1 ), x ) \n x1")
      log("  x = " + x )
      y = alg(" roots( subst( x1, x, L1 ), y )")
      log("  y = " + y )

    } else {
      console.warn("no solution!")
      // console.groupEnd(); //subtract
      return
    }

  }

  // console.groupEnd(); //subtract

  addPoint( x, y, line1, line2 )


  //check if line1 is vertical
  // if ( line1.b !== "0") {
  //
  //   x = alg(`( (${line2.b}) * (${line1.c}) - (${line1.b}) * (${line2.c}) )/( (${line2.a}) * (${line1.b}) - (${line1.a}) * (${line2.b}) )`);
  //   y = line1.getY(x);
  //
  //   addPoint(x, y, line1, line2);
  //
  // } else {
  //   //line is vertical
  //   // log("   l1:" + line1.id + " vertical\n");
  //   x = '0'; //TODO: i think this needs to be a / c
  //   y = line2.getY(x);
  //
  //   addPoint(x, y, line1, line2);
  //
  // }

  console.groupEnd();

}

// test two element equations for an intersection
function intersect(element1, element2){

  //TODO: return R as set of solutions
  let result = {}


  cmd = `   E1 = ${element1.eq}`
  alglog(cmd)
  log(  `      = ${ alg(`E1`) }`)
  log(  `        E1.dim: ${ element1.dim }`)

  cmd = `   E2 = ${element2.eq}`
  alglog(cmd)
  log(  `      = ${ alg(`E2`) }`)
  log(  `        E2.dim: ${ element2.dim }`)

  cmd = `    S = E1 - E2`
  alglog(cmd)
  log(  `      = ${ alg(`S`) }`)


  if (element2.dim == 1) {
    // pass E2 root set to E1 to eliminate variable
    if (element2.eqX) {
      log(`* subst E2x for x in E1`)
      element2.eqX.forEach( E2x => {
        // subst element2.eqX for x in E1

        cmd = `  E2x = ${ E2x }`
        alglog(cmd)
        log(  `      = ${ alg(`E2x`) }`)

        cmd = `  E1y = subst(E2x, x, E1)`
        alglog(cmd)
        log(  `      = ${ alg(`E1y`) }`)

        cmd = `  R1y = roots(E1y, y)`
        alglog(cmd)
        log(  `      = ${ alg(`R1y`) }`)

      })
    } else {
      if (element2.eqY) {
        log(`* subst E2y for y in E1`)
        element2.eqY.forEach( E2y => {
          // subst element2.eqY for y in E2
          cmd = `  E2y = ${ E2y }`
          alglog(cmd)
          log(  `      = ${ alg(`E2y`) }`)

          cmd = `  E1x = subst(E2y, y, E1)`
          alglog(cmd)
          log(  `      = ${ alg(`E1x`) }`)

          cmd = `  R1x = roots(E1x, x)`
          alglog(cmd)
          log(  `      = ${ alg(`R1x`) }`)


        })
      }
    }
  }





  // check if there is an x term
  var degX = alg("deg(S, x)")
  log(" degX = deg(S, x)")
  log("      = " + degX)

  if (degX !== "0") { // more than 1 but not zero

    // log("* roots(S, x): " + alg("roots(S, x)"))
    // log("* deg(roots(S, x), y): " + alg("deg(roots(S, x), y)"))

    var rootsSx = alg("roots(S, x)").replace("[", "").replace("]", "").split(",")
    log(" rootsSx = roots(S, x)")
    rootsSx.forEach( root => {
      log("         = " + root )
    })

    // console.dir(rootsSx)

    for (let i = 0; i < rootsSx.length; i++) {
      console.group(`rootsSx[${i}]`)

        // log(`  Sx = roots(S, x)[${i}]`)
        log("   Sx = " + alg( `Sx = ${ rootsSx[i] } \n Sx` ) )
        log(" deg(Sx) = " + alg( `deg(Sx)` ) )

        // check both equations

        E1Sx = alg( "E1Sx = subst( Sx, x, E1 ) \n E1Sx" )
        log(" E1Sx = subst( Sx, x, E1 )"  )
        log("      = " + E1Sx )

        y1 = alg( "y1 = roots( E1Sx, y ) \n y1" )
        log("   y1 = roots( E1Sx, y )"  )
        log("      = " + y1 )

        E2Sx = alg( "E2Sx = subst( Sx, x, E1 ) \n E2Sx" )
        log(" E2Sx = subst( Sx, x, E2 )"  )
        log("      = " + E2Sx )

        y2 = alg( "y2 = roots( E2Sx, y ) \n y2" )
        log("   y2 = roots( E2Sx, y )" )
        log("      = " + y2 )

        // if both equations show same result
        if (y1 == y2) {

          var rootsY = alg( "roots( E1Sx, y )" ).replace("[", "").replace("]", "").split(",")
          log("rootsY = roots( E1Sx, y )" )
          rootsY.forEach( root => {
            log("       = " + root )
          })

          for (let j = 0; j < rootsY.length; j++) {

            console.group(`rootsY[${j}]`)
            log(`    rY = ` + alg( `rY = ${ rootsY[j] } \n rY` ) )

            E1x = alg( "E1x = subst( rY, y, E1 ) \n E1x" )
            log(`   E1x = subst( rY, y, E1 ) ` )
            log("       = " + E1x )

            var rootsX = alg( `roots( E1x, x )` ).replace("[", "").replace("]", "").split(",")
            log("rootsX = roots( E1x, x )" )
            rootsX.forEach( root => {
              log("       = " + root )
            })

            for (let k = 0; k < rootsX.length; k++) {
              console.group("  x = " + rootsX[k] )

              addPoint(rootsX[k], rootsY[j], element1, element2);
              console.groupEnd();
            }
            console.groupEnd();
          }

        }

      console.groupEnd()

    }


  } else { // degX == 0 or something bad

    log(`* no x term`)
    var degY = alg("deg(S, y)")
    log(" deg(S, y): " + degY)

    if (degY != "0") {

      for (let i = 1; i <= degY; i++) {

        console.group("root y: " + i)

          log(" Sy: " + alg(`Sy = roots(S, y)[${i}] \n Sy`) )

          // check both equations

          x1 = alg( "x1 = roots( subst( Sy, y, E1 ), x ) \n x1" )
          log("  x1 = " + x1 )

          x2 = alg( "x2 = roots( subst( Sy, y, E2 ), x ) \n x2" )
          log("  x2 = " + x2 )


          if (x1 == x2) {

            log(" E1y: " + alg(`E1y = subst( x1, x, E1 ) \n E1y`) )

            var degE1y = alg("deg(E1y, x)")
            log("  degE1y = " + degE1y )

            for (let j = 1; j <= degE1y; j++) {

              y = alg( `roots( E1y, y )[${j}]` )
              log("  y = " + y )

              addPoint(x1, y, element1, element2);

            }

          } else {
            console.warn("x1 != x2")
          }

        console.groupEnd()

      }

    }
  }

}




function intersectLineCircle (line, circle) {

  console.group("line:" + line.id + " > circle:" + circle.id);

  // var cmd = `
  // L = ${line.eq}
  // C = ${circle.eq}
  // # subtract equations to define the system
  // S = L - C
  // `;
  // alg(cmd)
  //
  // log("L: " + alg("L"))
  // log("C: " + alg("C"))
  // log("S: " + alg("S"))
  //
  // var degX = alg("deg(S, x)")
  // log(" deg(S, x): " + degX)
  //
  // if (degX != "0") {
  //
  //   log("roots(S, x): " + alg("roots(S, x)"))
  //
  //   for (let i = 1; i <= degX; i++) {
  //     console.group("root x: " + i)
  //
  //       log(" Sx: " + alg(`Sx = roots(S, x)[${i}] \n Sx`) )
  //
  //       y = alg( "y1 = roots( subst( Sx, x, C ), y ) \n y1" )
  //       log("  y = " + y )
  //
  //       log(" Cx: " + alg(`Cx = subst( y1, y, C ) \n Cx`) )
  //       var degCx = alg("deg(Cx, x)")
  //       for (let j = 1; j <= degCx; j++) {
  //
  //         x = alg( `roots( Cx, x )[${j}]` )
  //         log("  x = " + x )
  //
  //         addPoint(x, y, line, circle);
  //       }
  //     console.groupEnd()
  //
  //     /// old
  //     // y = alg(`roots(S, y)[${i}]`);
  //     // x = line.getX(y);
  //     // if (checkValid(x) && checkValid(y)) {
  //     //   // log("    > add circle intersection: " + x + ", " + y);
  //     //   addPoint(x, y, line, circle);
  //     // } else {
  //     //   console.warn(`not a valid point: [${x}, ${y}]`);
  //     // }
  //
  //   }
  //
  //
  // } else {
  //
  //   var degY = alg("deg(S, y)")
  //   log(" deg(S, y): " + degY)
  //
  //   if (degY != "0") {
  //
  //     for (let i = 1; i <= degY; i++) {
  //
  //       console.group("root y: " + i)
  //
  //
  //         log(" Sy: " + alg(`Sy = roots(S, y)[${i}] \n Sy`) )
  //
  //         x = alg( "x1 = roots( subst( Sy, y, C ), x ) \n x1" )
  //         log("  x = " + x )
  //
  //         y = alg( "roots( subst( x1, x, C ), y )" )
  //         log("  y = " + y )
  //
  //         addPoint(x, y, line, circle);
  //
  //       console.groupEnd()
  //
  //     }
  //
  //     // log(" Sy: " + alg("Sy = roots(S, y) \n Sy") )
  //     // x = alg("x1 = roots( subst( Sy, y, L1 ), x ) \n x1")
  //     // log("  x = " + x )
  //     // y = alg(" roots( subst( x1, x, L1 ), y )")
  //     // log("  y = " + y )
  //
  //   }
  //
  // }




  /////////////////////////
  // old
  var r = circle.r;
  var h = circle.h;
  var k = circle.k;


  if ((line.xRoot)) {
    // if not vertical solve for y
    alg(`
    C = ${circle.eq}
    L = ${line.xRoot}
    S = subst(L,x,C)`);

    log(" C: " + alg("L1"))
    log(" L: " + alg("L2"))
    log(" S: " + alg("S"))

    var deg = alg(`deg(S)`);

    var x, y;

    // TODO: get roots as array
    for (var i = 1; i <= deg; i++) {
      y = alg(`roots(S, y)[${i}]`);
      x = line.getX(y);
      if (checkValid(x) && checkValid(y)) {
        // log("    > add circle intersection: " + x + ", " + y);
        addPoint(x, y, line, circle);
      } else {
        console.warn(`not a valid point: [${x}, ${y}]`);
      }

    }

  } else {
    // if vertical solve for x
    alg(`
    C = ${circle.eq}
    L = ${line.yRoot}
    S = subst(L,y,C)`);

    var deg = alg(`deg(S)`);

    var x, y;

    // TODO: get roots as array
    for (var i = 1; i <= deg; i++) {
      x = alg(`roots(S, x)[${i}]`);
      y = line.getY(x);

      if (checkValid(x) && checkValid(y)) {
        // log("    > add circle intersection: " + x + ", " + y);
        addPoint(x, y, line, circle);
      } else {
        console.warn(`not a valid point: [${x}, ${y}]`);
      }
    }
  }
  console.groupEnd();

}


/* ****************************************************************/
function Circle(cpt, rpt) {

  if (!(this instanceof Circle)) {
    return new Circle(cpt, rpt);
  }

  this.id = elements.length;
  this.type = "circle";

  console.group( `+ ${this.type} : ${this.id} ` );

  //center point is not a point on the circle
  this.points = [rpt];
  this.addPoint = addPointToList;


  this.center = cpt;

  console.group("center pt: " + cpt.id)
  log(`cpt.x = ${cpt.x}`);
  log(`cpt.y = ${cpt.y}`);
  console.groupEnd();
  console.group("radius pt: " + rpt.id)
  log(`rpt.x = ${rpt.x}`);
  log(`rpt.y = ${rpt.y}`);
  console.groupEnd();

  log(`---`)
  //
  // //calculate equation 1 coefficients
  // // ax + by + c form
  var cmd

  alg(`clearall`)

  // h = x offest
  log(  `    h = cpt.x`)
  cmd = `    h = (${cpt.x})`
  alglog(cmd)
  this.h = alg(`h`)
  log(  `      = ${this.h}`)


  // y offset
  log(  `    k = cpt.y`)
  cmd = `    k = (${cpt.y})`
  alglog(cmd)
  this.k = alg(`k`)
  log(  `      = ${this.k}`)

  //get radius length
  this.r = cpt.distanceTo(rpt);
  log(`  r: ${this.r}`)

  // generate equation for circle
  // (x - h)^2 + (y - k)^2 + r^2

  log(  `   eq = (x - h)^2 + (y - k)^2 + r^2`)
  cmd = `   eq = (x - (${this.h}))^2 + (y - (${this.k}))^2 - (${this.r})^2`
  alglog(cmd)
  this.eq = alg(`eq`)
  log(  `      = ${this.eq}`)

  cmd = ` degX = deg(eq, x)`
  alglog(cmd)
  this.degX = alg(`degX`)
  log(  `      = ${this.degX}`)
  if (this.degX != 0) {
    // set eq equal to x
    cmd = `  eqX = roots(eq, x)`
    alglog(cmd)
    this.eqX = parseRoots( alg(`eqX`) )
    if (this.eqX) {
      this.eqX.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.eqX}`)
    }
  }

  cmd = ` degY = deg(eq, y)`
  alglog(cmd)
  this.degY = alg(`degY`)
  log(  `      = ${this.degY}`)
  if (this.degY != 0) {
    // set eq equal to y
    cmd = `  eqY = roots(eq, y)`
    alglog(cmd)
    this.eqY = parseRoots( alg(`eqY`) )
    if (this.eqY) {
      this.eqY.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.eqY}`)
    }

  }

  this.dim = this.degX > this.degY ? this.degX : this.degY

  log(`---`)


  ////////////////////////////////////////////////////////
  //TODO: whay does the radius need to be multiplied by 2??
  var cx = getNumber( cpt.x );
  var cy = getNumber( cpt.y );
  var r = getNumber( this.r );

  this.element = groupCircles.circle( r * 2 )
    .cx(cx)
    .cy(cy)
    .addClass("Circle")
    .attr({
      'id': `c${this.id}`,
      'element-id': this.id
      });

  setCircle("#c" + this.id);

  ////////////////////////////////////////////////////////
  // find all intersections with other elements
  elements.forEach(function(element) {
    console.group(`> ${element.id} : ${element.type} `)
    intersect(this, element) ;
    console.groupEnd();
  }, this); //pass this context in

  // elements.forEach( function(element){
  // });

  // add this to elements array
  elements.push(this);

  //TODO: rotate circle to align start point with Radius

  //UI interactvity
  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);


  this.toString = function() {
    var str = `${this.type} - ${this.id}
    c pt: ${this.center.id} : ${this.center.x}, ${this.center.y}
       h: ${this.h}
       k: ${this.k}
       r: ${this.r}
      eq: ${this.eq} = 0
  points: ${this.points.length}\n`;
  //TODO: list related points
    this.points.forEach( function(point){
      str += "    " +  point.type + " :\t" + point.id + "\n";
    });

    return str;
  }

  logCircle(this);
  // log(this);

  console.dir(this);
  console.groupEnd();
}

//used in Point object
function distanceTo(point) {
  var d = Algebrite.run(
    `( ((${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 )^(1/2)` );
  return d;
}

function circleIntersect (circle, element) {
  //intersect this Line with Line
  if ((element instanceof Line)) {
    intersectLineCircle(element, circle);
  }

  //intersect this Line with Circle
  if ((element instanceof Circle)) {
    intersectCircleCircle(circle, element);
  }
}

function intersectCircleCircle(c1, c2) {
  console.group("circle: " + c1.id + " > circle:" + c2.id);


  //TODO: check degree before running roots

  // Algebrite Script
  var cmd = `
  C1 = ${c1.eq}
  C2 = ${c2.eq}
  # subtract two circle equations
  # this should provide a linear equation
  S = C1 - C2

  # solve this equation for x
  X = roots(S, x)

  # substitute this x value into a circle equation
  Y = subst(X, x, C1)

  # solve for y
  roots(Y, y)
`;

  log(`  C1: ${c1.eq}`)
  log(`  C2: ${c2.eq}`)
  log(`   S: ${ alg(`S`) }`)

  var result = alg(cmd);

  if ( checkValid(result) ) {
    var yRoots = result.replace("[", "").replace("]", "").split(",");

    // substitute each y value into the linear equation
    yRoots.forEach( function(y) {
      var x = alg(`subst(${y}, y, X)`);

      //check values
      if (checkValid(x) && checkValid(y)) {
        // log("    > add circle intersection: " + x + ", " + y);
        addPoint(x, y, c1, c2);
      } else {
        console.warn(`    not a valid point: [${x}, ${y}]`);
      }
    })

  } else {

    // solve for x-roots
    cmd = `
    C1 = ${c1.eq}
    C2 = ${c2.eq}
    # subtract two circle equations
    # this should provide a linear equation
    S = C1 - C2

    Y = roots(S, y)
    X = subst(Y, y, C1)
    roots(X, x)
    `;

    var result = alg(cmd);

    if ( checkValid(result) ) {
      var xRoots = result.replace("[", "").replace("]", "").split(",");

      xRoots.forEach( function(x) {
        var y = alg(`subst(${x}, x, Y)`);
        //check values
        if (checkValid(x) && checkValid(y)) {
          // log("    > add circle intersection: " + x + ", " + y);
          addPoint(x, y, c1, c2);
        } else {
          console.warn(`    not a valid point: [${x}, ${y}]`);
        }
      }) //forEach

    }
  }
  console.groupEnd();
}


function findPoint(x, y) {
  for (var i = 0; i < points.length; i++) {
    if ( points[i].x == x  &&  points[i].y == y ) {
      return points[i];
    }
  }
}

function round(number) {
  var factor = Math.pow(10, PRECISION);
  return Math.floor(number * factor) / factor;
}

function getElementById(id) {
  for (i = 0; i < elements.length; i++) {
    if (elements[i].id == id) {
      return elements[i];
    }
  }
}
function getPointById(id) {
  for (i = 0; i < points.length; i++) {
    if (points[i].id == id) {
      return points[i];
    }
  }
}


var click = function() {
  this.toggleClass('click');
  log("click");
}

//us hover event
var hover = function() {

  this.toggleClass('hover');

  var element;
  var latex;

  if (this.hasClass("Point")) {
    var id = this.attr( 'point-id' );
    element = points[id];
    latex = alg(`printlatex([ ${element.x}, ${element.y} ])`)
  }

  if (this.hasClass("Circle")) {
    var id = this.attr( 'element-id' );
    element = elements[id];
    latex = alg(`printlatex(${element.eq})`) + " = 0"
  }


  if (this.hasClass("Line")) {
    var id = this.attr( 'element-id');
    element = elements[id];
    latex = "0 = " + alg(`printlatex(${element.eq})`);
  }

  if (this.hasClass("Segment")) {


    var id = this.attr( 'segment-id' );
    element = segments[id];

    $(element.markerStart).toggleClass('hover');
    $(element.markerEnd).toggleClass('hover');

    latex = alg(`printlatex([ ${element.length} ])`)
  }

  // log(info);
  infoPanel.innerHTML = element;
  footerPanel.innerHTML = element.type + " " + element.id + ":  " + katex.renderToString(latex);

  // log(info);

  // log("hover: " + this.hasClass('hover'));
}


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
