// TODO: Line class should derive from Elelemnt

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
