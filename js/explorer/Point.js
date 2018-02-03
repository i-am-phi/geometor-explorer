
var points = [];



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

function getPointById(id) {
  for (i = 0; i < points.length; i++) {
    if (points[i].id == id) {
      return points[i];
    }
  }
}
