// the array of points withing the geometric construction
var points = [];

//

function Point(x, y, parent1, parent2) {

  //if someone calls function without instantiating object - return new object
  if (!(this instanceof Point)) {
    return new Point(x, y, parent1, parent2);
  }

  this.id = points.length;
  this.type = "point";

  console.group( `+ ${this.type} : ${this.id} ` );


  this.x = x;
  this.y = y;

  this.xVal = getNumber( this.x );
  this.yVal = getNumber( this.y );

  this.isValid = true;

  // all point values must be able to be parsed a real float value
  if (isNaN( this.xVal )) {
    this.isValid = false;
    console.error(`x value (${this.x}) is not a number: ${this.xVal}`)
    return
  }
  if (isNaN( this.yVal )) {
    this.isValid = false;
    console.error(`y value (${this.y}) is not a number: ${this.yVal}`)
    return
  }

  this.parents = [];
  this.addParent = addParentToPoint

  //first points have no parents
  if (parent1 && parent2) {
    this.addParent(parent1)
    this.addParent(parent2)
  }

  //TODO: make the point an SVG symbol

  this.render = renderPoint

  this.distanceTo = distanceTo


  this.toString = toStringPoint

  this.log = consolePoint

  console.dir(this);
  console.groupEnd();
}

////////////////

function toStringPoint() {
  var str =
`${this.type}: ${this.id}
   x =  ${this.x}
xVal =  ${this.xVal}
   y =  ${this.y}
yVal =  ${this.yVal}
* parents: ${this.parents.length}\n`

  this.parents.forEach( function(parent){
    str += "    " +  parent.id + " :\t" + parent.type + "\n";
  });

  return str;
}

function renderPoint() {

  //draw into SVG panel
  this.element = groupPoints.circle(PTRAD * 2).cx(this.xVal).cy(this.yVal)
    .addClass("Point")
    .attr({
      id: 'p' + this.id,
      'point-id': this.id,
      title: `[${this.x}, ${this.y}]`,
    });

  //add point to the animation timeline
  setPoint("#p" + this.id);

  // set ui interactivity
  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);

}

////////////////
// log point to console
function consolePoint(title){

  let titleStr = title || "point"

  console.group(`${titleStr}: ` + this.id)
  log(this.toString());
  console.groupEnd();

}

////////////////

// add a point to list but check if it exists first
function addPointToList(point) {

  // look for other points with same x, y
  point = findPoint(point.x, point.y);

  if (point) {
    log("point exists: " + point.id )
    return false

  } else {
    log("add point to list: " + point.id )
    points.push(point)
    return true
  }

}


//add a parent to the point
function addParentToPoint(parent) {
  // check if parent is already in list
  if (!this.parents.includes(parent)) {
    // add new parent to point
    this.parents.push(parent);
  }
}

// for sorting points along a line
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


//used in Point object
function distanceTo(point) {
  var d = Algebrite.run(
    `( ((${this.x}) - (${point.x}))^2 + ((${point.y}) - (${this.y}))^2 )^(1/2)` );
  return d;
}

function findPoint(x, y) {
  for (var i = 0; i < points.length; i++) {
    if ( points[i].x == x  &&  points[i].y == y ) {
      return points[i];
    }
  }
}
