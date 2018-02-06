// TODO: Line class should derive from Elelemnt

/* ****************************************************************/
function Line(pt1, pt2) {

  if (!(this instanceof Line)) {
    return new Line(pt1, pt2);
  }

  this.id;
  this.type = "line";

  console.group( `+ ${this.id} : ${this.type} ` );

  this.points = [];

  this.points[0] = pt1;
  this.points[1] = pt2;

  pt1.log()
  pt2.log()

  //***************************************
  console.group(`eq`)


  // calculate equation 1 coefficients
  // ax + by + c form

  var cmd

  alg(`clearall`)

  // coefficent a
  log(  `    a = (pt1.y) - (pt2.y)`)
  cmd = `    a = (${pt1.y}) - (${pt2.y})`
  alglog(cmd)
  let a = alg(`a`)
  log(  `      = ${a}`)

  // coefficent b
  log(  `    b = (pt2.x) - (pt1.x)`)
  cmd = `    b = (${pt2.x}) - (${pt1.x})`
  alglog(cmd)
  let b = alg(`b`)
  log(  `      = ${b}`)

  // coefficent c
  log(  `    c = ((pt1.x) * (pt2.y)) - ((pt2.x) * (pt1.y))`)
  cmd = `    c = ((${pt1.x}) * (${pt2.y})) - ((${pt2.x}) * (${pt1.y}))`
  alglog(cmd)
  let c = alg(`c`)
  log(  `      = ${c}`)

  // instantiate the equation object
  // c resides on other side of equal in equation
  this.eq = new Equation(0,0,0,a,b,'-'+c)
  this.eq.log();

  console.groupEnd(`eq`)

  this.addPoint = addPointToList;

  this.render = renderLine

  //////////////////////////////////////////////
  //check for intersections with existing elements
  // this.intersect = lineIntersect;
  elements.forEach(function(element) {

    console.group(`> ${element.id} : ${element.type} `)
    intersect(this, element) ;
    console.groupEnd();

  }, this);

  this.toString = toStringLine

  console.dir(this);
  console.groupEnd();

}

function renderLine() {

  //////////////////////////////////////////////
  // draw line to edge of the viewbox
  var endPts = getLineEndPts(this);

  if (endPts) {
    let x0 = getNumber( endPts[0].x )
    let y0 = getNumber( endPts[0].y )
    let x1 = getNumber( endPts[1].x )
    let y1 = getNumber( endPts[1].y )

    //create SVG element
    this.element = groupLines.line( x0, y0, x1, y1 )
      .addClass("Line")
      .attr({
        id: "i" + this.id,
        'element-id': this.id
      })
      ;

    setLine("#i" + this.id);

    // set UI hover and click
    this.element.on('click', click);
    this.element.on('mouseover', hover);
    this.element.on('mouseout', hover);
  }

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
