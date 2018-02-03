

// TODO: Circle class should derive from Elelemnt
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
  //TODO: show the work for radius length
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
