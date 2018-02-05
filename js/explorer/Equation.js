/////////////////////////////////
function Equation(d, e, f, a, b, c) {

  this.d = d || 0
  this.e = e || 0
  this.f = f || 0
  this.a = a || 0
  this.b = b || 0
  this.c = c || 0

  this.general = function () {
    return `(${this.d})x^2 + (${this.e})xy + (${this.f})y^2 + (${this.a})x + (${this.b})y + (${this.c})`
  }

  this.simple = function () {
    let str = ""

    if (this.d != 0) {
      str += `(${this.d})x^2`
    }
    if (this.e != 0) {
      if ( str != "" ) { str += " + " }
      str += `(${this.e})xy`
    }
    if (this.f != 0) {
      if ( str != "" ) { str += " + " }
      str += `(${this.f})y^2`
    }
    if (this.a != 0) {
      if ( str != "" ) { str += " + " }
      str += `(${this.a})x`
    }
    if (this.b != 0) {
      if ( str != "" ) { str += " + " }
      str += `(${this.b})y`
    }
    if (this.c != 0) {
      if ( str != "" ) { str += " + " }
      str += `(${this.c})`
    }
    return str
  }

  this.render = function () {
    return katex.renderToString( this.simple() );
  }

  this.renderAlg = function () {
    let latex = alg(`printlatex([ ${ this.simple() } ])`)
    return katex.renderToString(latex);
  }

  this.toString = function () {
    return this.simple()
  }

  /////////////////////////

  // check equation
  log(  `   eq = (${ this.general() })`)
  cmd = `   eq = ${ this.simple() }`
  alglog(cmd)
  log(  `      = ${ alg(`eq`) }`)

  // degree of x term - should be 1 or 0 for vertical line
  cmd = ` degX = deg(eq, x)`
  alglog(cmd)
  this.degX = parseInt(alg(`degX`))
  log(  `      = ${this.degX}`)

  if (this.degX != 0) {

    // solve eq for x
    cmd = ` forX = roots(eq, x)`
    alglog(cmd)
    // this.forX = alg(`forX`)
    this.forX = parseRoots( alg(`forX`) )
    if (this.forX) {

      this.forX.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.forX}`)
    }

  }

  // degree of y term - should be 1 or 0 for vertical line
  cmd = ` degY = deg(eq, y)`
  alglog(cmd)
  this.degY = parseInt(alg(`degY`))
  log(  `      = ${this.degY}`)

  if (this.degY != 0) {

    // solve eq for y
    cmd = ` forY = roots(eq, y)`
    alglog(cmd)
    // this.forY = alg(`forY`)
    this.forY = parseRoots( alg(`forY`) )
    if (this.forY) {

      this.forY.forEach( root => {
        log(  `      = ${root}`)
      })
    } else {
      log(  `      = ${this.forY}`)
    }

  }

  // dim represents the hiegest order of the equation
  this.dim = this.degX
  if (this.dim < this.degY) {
    this.dim = this.degY
  }


}
