/////////////////////////////////

// Equation - a set of proportions for an ELEMENT
// uses a generalized form that supports both lines and circles
// d x^2 + e x y + f y^2 + a x + b y + c
// note that we position the c value - the constant term - on the other side of the equations
// ensure that the sign of c is passed in correctly
// can support other conic 2d forms in the future
// the coefficients are held in an object as algebraic strings
// algebrite provides all the calculatiosn of the values


// TODO - Equation should be treated as a static immutable object
// anything that can be precalculated should be

function Equation(d, e, f, a, b, c) {

  this.params = {
    d: d,
    e: e,
    f: f,
    a: a,
    b: b,
    c: alg(c)
  }

  this.general = generalizeEq
  this.simple = simplifiedEq
  this.render = renderSimple

  this.renderAlg = function () {
    let latex = alg(`printlatex([ ${ this.simple() } ])`)
    return katex.renderToString(latex);
  }

  this.toString = simplifiedEq
  this.toStringLog = toStringEquation
  this.log = logEquation

  /////////////////////////

  this.listParams = listParams
  this.getRow = getRow
  this.nonZeroCoeffients = nonZeroCoeffients
  // this.firstNonZero = firstNonZeroIndex

  this.multiply = multiply
  this.add = add
  this.clone = cloneEquation

  // return letter of variable that can be solved - or false
  this.canSolve = canSolve

  //true or false
  this.hasX = hasX
  this.hasY = hasY

  //true or false
  this.hasXonly = hasXonly
  this.hasYonly = hasYonly

  //returns dimension of the x variable
  this.dimX = dimX
  this.dimY = dimY

  //functions
  this.getXroots = getXroots
  this.getYroots = getYroots

  // static array of values
  this.xRoots = this.getXroots()
  this.yRoots = this.getYroots()

  // return value of first itme in root array
  this.XforY = getXforY
  this.YforX = getYforX

  this.getXRootsforY = getXRootsforY
  this.getYRootsforX = getYRootsforX

}

function toStringEquation(){
  return this.toString()
}

function logEquation(){

  // check equation
  console.group(`equation`)

  this.listParams()

  log(  `   eq = (${ this.general() })`)
  cmd = `   eq = ${ this.simple() }`
  alglog(cmd)
  log(  `      = ${ alg(`eq`) }`)


  log(`getRow: ` + this.getRow())
  log(`nonZeroCoeffients: ` + this.nonZeroCoeffients())
  log(`canSolve: ` + this.canSolve())
  log(`hasX: ` + this.hasX())
  log(`hasY: ` + this.hasY())
  log(`dimX: ` + this.dimX())
  log(`dimY: ` + this.dimY())

  console.group(`roots`)
  console.group(`xRoots`)
  if (this.xRoots) {
    this.xRoots.forEach(root => {
      log(  `    x = (${ root })`)
    })
  }
  console.groupEnd(`xRoots`)
  console.group(`yRoots`)

  if(this.yRoots) {
    this.yRoots.forEach(root => {
      log(  `    y = (${ root })`)
    })
  }
  console.groupEnd(`yRoots`)
  console.groupEnd(`roots`)
  console.groupEnd(`equation`)

}

function listParams() {
  for (var key in this.params){
    console.log( key + ' : ' + this.params[key]);
  }
}

function getRow() {
  let p = this.params
  // return `|\t${p['d']}\t${p['e']}\t${p['f']}\t${p['a']}\t${p['b']}\t|\t${p['c']}\t|`
  return `|\t${p.d}\t${p.e}\t${p.f}\t${p.a}\t${p.b}\t|\t${p.c}\t|`
}

// count the number of nonrzero coeffiencts
// if one then solve
function nonZeroCoeffients() {
  let count = 0;
  for (var key in this.params) {
    // don't count the final constant
    if (key != 'c') {
      if (this.params[key] != 0) { count++ }
    }
  }
  return count
}

function multiply(val) {
  // this.params.forEach( function (element, index, params) {
  //   params[index] = alg(`(${element}) * (${val})`)
  // }, this )
  log("multiply: " + val)
  for(var key in this.params) {
    let newVal = alg(`(${ this.params[key] }) * (${val})`)
    this.params[key] = newVal
  }
}

function add(eq) {
  log("add: " + eq.toString())

  for(var key in this.params) {
    let newVal = alg(`(${ this.params[key] }) + (${ eq.params[key] })`)
    this.params[key] = newVal
  }
}

function cloneEquation() {
  return new Equation(
    this.params.d,
    this.params.e,
    this.params.f,
    this.params.a,
    this.params.b,
    this.params.c
  )
}

// returns variable name that can be isolated
function canSolve() {
  if (this.hasX()) {return 'x'}
  if (this.hasY()) {return 'y'}
  return false
}

////////////

// return true if the equation has a Y term
function hasX() {
  let p = this.params
  // test the coeffients with x variables
  if ( p.d != 0 || p.e != 0 || p.a != 0 ) {
    return true
  }
  return false
}

function hasXonly() {
  let p = this.params
  // test the coeffients with x variables
  if ( this.hasX() && !this.hasY() ) {
    return true
  }
  return false
}

// return true if the equation has a Y term
function dimX() {
  let p = this.params
  // test the coeffients with x variables
  if ( p.d != 0 ) {
    return 2
  } else if ( p.e != 0 || p.a != 0 ) {
    return 1
  }
  return 0
}

////////////

// return true if the equation has a Y term
function hasY() {
  let p = this.params
  // test the coeffients with y variables
  if ( p.f != 0 || p.e != 0 || p.b != 0 ) {
    return true
  }
  return false
}

// return true if the equation has a Y term
function hasYonly() {
  let p = this.params
  // test the coeffients with y variables
  if ( !this.hasX() && this.hasY() ) {
    return true
  }
  return false
}

// return the highest order for y -
function dimY() {
  let p = this.params
  // test the coeffients with x variables
  if ( p.f != 0 ) {
    return 2
  } else if ( p.e != 0 || p.b != 0 ) {
    return 1
  }
  return 0
}

/////////////////////

function getXroots() {
  if (this.hasX()) {
    return parseRoots( alg(`roots((${ this.simple() }), x)`) )
  }
}

function getXRootsforY(y) {
  if (this.hasY()) {
    return parseRoots( alg(`roots(subst((${y}), y, (${ this.simple() })), x)`) )
  }
}

// shortcut for linear equations
function getXforY(y) {
  if (this.hasY()) {
    return this.getXRootsforY(y)[0]
  }
}

/////////////////////

function getYroots() {
  if (this.hasY()) {
    return parseRoots( alg(`roots((${this.simple()}), y)`) )
  }
}


function getYRootsforX(x) {
  if (this.hasX()) {
    return parseRoots( alg(`roots(subst((${x}), x, (${ this.simple() })), y)`) )
  }
}

// return first value of root list (shortcut for lines)
function getYforX(x) {
  if (this.hasX()) {
    return this.getYRootsforX(x)[0]
  }
}

///////////////

function generalizeEq() {
  let p = this.params
  return `(${p.d})x^2 + (${p.e})xy + (${p.f})y^2 + (${p.a})x + (${p.b})y + (${p.c})`
}

function simplifiedEq() {
  let str = ""

  let p = this.params

  if (p.d != 0) {
    str += `(${p.d})x^2`
  }
  if (p.e != 0) {
    if ( str != "" ) { str += " + " }
    str += `(${p.e})xy`
  }
  if (p.f != 0) {
    if ( str != "" ) { str += " + " }
    str += `(${p.f})y^2`
  }
  if (p.a != 0) {
    if ( str != "" ) { str += " + " }
    str += `(${p.a})x`
  }
  if (p.b != 0) {
    if ( str != "" ) { str += " + " }
    str += `(${p.b})y`
  }
  if (p.c != 0) {
    if ( str != "" ) { str += " + " }
    str += `(${p.c})`
  }
  return str
}

function renderSimple() {
  return katex.renderToString( this.simple() );
}
