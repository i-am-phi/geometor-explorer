

// TODO: Circle class should derive from Elelemnt
/* ****************************************************************/
function Circle(cpt, rpt) {

  if (!(this instanceof Circle)) {
    return new Circle(cpt, rpt);
  }

  this.id = elements.length;
  this.type = "circle";

  console.group( `+ ${this.id} : ${this.type} ` );

  //center point is not a point on the circle
  this.points = [rpt];
  this.addPoint = addPointToList;

  this.center = cpt;

  cpt.log("center point")
  rpt.log("radius point")

  //***************************************
  console.group(`eq`)

  // //calculate equation 1 coefficients
  var cmd

  alg(`clearall`)


  // h = x offest
  log(  `    h = cpt.x`)
  cmd = `    h = (${cpt.x})`
  alglog(cmd)
  this.h = alg(`h`)
  log(  `      = ${this.h}`)

  // a coefficient
  cmd = `    a = -2h`
  alglog(cmd)
  let a = alg(`a`)
  log(  `      = ${a}`)



  // k = y offset
  log(  `    k = cpt.y`)
  cmd = `    k = (${cpt.y})`
  alglog(cmd)
  this.k = alg(`k`)
  log(  `      = ${this.k}`)

  // b coefficient
  cmd = `    b = -2k`
  alglog(cmd)
  let b = alg(`b`)
  log(  `      = ${b}`)


  // calculate radius
  log(  `    r = ( (cpt.x - rpt.x)^2 + (rpt.y - cpt.y)^2 )^(1/2)`)
  cmd = `    r = ( ((${cpt.x}) - (${rpt.x}))^2 + ((${rpt.y}) - (${cpt.y}))^2 )^(1/2)`
  alglog(cmd)
  this.r = alg(`r`)
  log(  `      = ${this.r}`)

  // c coefficient
  cmd = `    c = h^2 + k^2 - r^2`
  alglog(cmd)
  let c = alg(`c`)
  log(  `      = ${c}`)

  // instantiate the equation object
  this.eq = new Equation(1,0,1,a,b,'-'+c)


  console.groupEnd(`eq`)

  this.render = renderCircle

  ////////////////////////////////////////////////////////
  // find all intersections with other elements
  elements.forEach(function(element) {

    console.group(`> ${element.id} : ${element.type} `)
    intersect(this, element) ;
    console.groupEnd();
  }, this); //pass this context in


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

  logElement(this);
  // log(this);

  console.dir(this);
  console.groupEnd();
}

function renderCircle() {
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

  //TODO: rotate circle to align start point with Radius

  //UI interactvity
  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);


}
