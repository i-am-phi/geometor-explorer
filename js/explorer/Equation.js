/**
 * a set of parameters representing proportions for a {@link Struct}

 * uses a generalized form that supports both {@link Line} and {@link Circle} structs

 * `d x^2 + e x y + f y^2 + a x + b y = c`

 * - ensure that the sign of c is passed in correctly
 * - can support other conic 2d forms in the future

 * the parameters are set as strings representing algebraic values <br>
 * these parameters are held as properties of an object so that the properties can be iterated through for analysis

 * **Algebrite** library {@link http://algebrite.org} provides all the calculations of the algebraic values and conversion to float when necessary

 * - TODO: Equation should be treated as a static immutable object
 * - TODO: all values that don't change should be calculated on construction.
 *
 * @class
 * @param {string} d - coefficient for x^2 term - always 1 for a circle - 0 for line
 * @param {string} e - coefficient for xy term - should always be zero in this model
 * @param {string} f - coefficient for y^2 term - always 1 for a circle - 0 for line
 * @param {string} a - coefficient for x term
 * @param {string} b - coefficient for y term
 * @param {string} c - constant - WATCH SIGN - note that we position the c value on the other side of the equations
 */
class Equation {

  constructor(d, e, f, a, b, c) {

    /** internal log to **Show The Work** */
    this.history = []

    /**
    * - an object of parameters
    * - can be iterated

    * **TODO:** each parameter should be checked as a valid Value object - if string, create new Value object

    * @returns {Object} with properties for each coefficient
    * @example
    * function nonZeroCoeffients() {
    * let count = 0;
    * for (var key in this.params) {
    *   // don't count the final constant
    *   if (key != 'c') {
    *     if (this.params[key] != 0) { count++ }
    *   }
    * }
    * return count
    * }
    */
    this.params = {
      d: d,
      e: e,
      f: f,
      a: a,
      b: b,
      c: A.run(c)
    }

    this.history.push(this.getRow())

    //convenience for code
    let p = this.params

    // get greatest common divisor
    let gcd = A.run( `gcd( (${p.d}), (${p.e}), (${p.f}), (${p.a}), (${p.b}), (${p.c}) )`)

    this.history.push(`gcd: ${gcd}`)

    // if greated common divisor is valid and not equal to 1,
    if ( A.checkValid(gcd) && gcd != 1 ) {

      for(var key in this.params) {

        this.params[key] = A.run(`(${ this.params[key] }) / (${gcd})`)

      }

      this.history.push(this.getRow())

    }

    /** full expression for the Equation
    * - `(d)x^2 + (e)xy + (f)y^2 + (a)x + (b)y + (c)`
    * TODO: validate corrct sign for c

    * @return {algExpression}
    */
    this.general = `(${p.d})x^2 + (${p.e})xy + (${p.f})y^2 + (${p.a})x + (${p.b})y - (${p.c})`

    /** simplified expression for the Equation
    * - removes terms with coeffient of `0`
    * TODO: validate correct sign for c

    * @return {algExpression}
    */
    this.simple = this.getSimple()

    /** returns expression equal to `0` */
    this.simple0 = this.getSimple0()

    this.simple0Parsed = A.run( `simplify(${this.simple0})` )

    /** does the equation have an x variable?
    *  - `( p.d != 0 || p.e != 0 || p.a != 0 )`
    * @return {boolean}
    */
    this.hasX = ( p.d != 0 || p.e != 0 || p.a != 0 ) ? true : false
    this.hasXonly = ( p.f == 0 && p.e == 0 && p.b == 0 ) ? true : false

    /** does the equation have a y variable?
    * @return {boolean}
    */
    this.hasY = ( p.f != 0 || p.e != 0 || p.b != 0 ) ? true : false
    this.hasYonly = ( p.d == 0 && p.e == 0 && p.a == 0 ) ? true : false

    /**
    * - use this.vars().count to determine number of variables in the equation
    * @return {Array} returns an array of strings representing the vars in the equation ["x", "y"]
    */
    this.vars = []
    if (this.hasX) { this.vars.push('x') }
    if (this.hasY) { this.vars.push('y') }

    /** returns dimension of the x variable
    * @return {int} 0, 1, 2
    */
    this.dimX = 0
    if ( p.d != 0 ) { this.dimX = 2 }
    else if ( p.e != 0 || p.a != 0 ) { this.dimX = 1 }

    /** returns dimension of the y variable
    * @return {int} 0, 1, 2
    */
    this.dimY = 0
    if ( p.f != 0 ) { this.dimY = 2 }
    else if ( p.e != 0 || p.b != 0 ) { this.dimY = 1 }

    /** highest dimension for the equation
    * @return {int} 0, 1, 2
    */
    this.dim = ( this.dimX >= this.dimY ) ? this.dimX : this.dimY


    /** get all roots `x` for the Equation
    * @return {Array} of algExpressions
    */
    this.xRoots = []
    if (this.hasX) {
      this.xRoots = A.parseRoots( A.run(`roots((${this.simple0}), x)`) )
    }

    /** get all roots `y` for the Equation
    * @return {Array} of algExpressions
    */
    this.yRoots = []
    if (this.hasY) {
      this.yRoots = A.parseRoots( A.run(`roots((${this.simple0}), y)`) )
    }


  } //constructor

  getRootsByName(varName) {
    if (varName == `x`) {
      return this.xRoots
    }
    if (varName == `y`) {
      return this.yRoots
    }
  }

  getRootsByOppositeName(varName) {
    if (varName == `y`) {
      return this.xRoots
    }
    if (varName == `y`) {
      return this.yRoots
    }
  }

  /** get roots of `x` for a value of `y`
  * @param {algValue} y
  * @return {Array} of algExpression
  */
  getXRootsforY(y) {
    if (this.hasY) {
      return A.parseRoots( A.run(`roots(subst((${y}), y, (${ this.simple0 })), x)`) )
    } else {
      return this.xRoots
    }
  }

  /** shortcut for 1 dimensional equations
  * - returns first value in array from getXRootsforY
  * @param {algValue} y
  * @return {algExpression}
  */
  getXforY(y) {
    if (this.hasY) {
      return this.getXRootsforY(y)[0]
    } else {
      return this.xRoots
    }
  }

  /** get roots of `y` for a value of `x`
  * @param {algValue} x
  * @return {Array} of algExpression
  */
  getYRootsforX(x) {
    if (this.hasX) {
      return A.parseRoots( A.run(`roots(subst((${x}), x, (${ this.simple0 })), y)`) )
    } else {
      return this.yRoots
    }
  }

  /** shortcut for 1 dimensional equations
  * - returns first value in array from getYRootsforX
  * @param {algValue} x
  * @return {algExpression}
  */
  getYforX(x) {
    if (this.hasX) {
      return this.getYRootsforX(x)[0]
    } else {
      return this.yRoots
    }
  }


  getSimple() {
    let str = ""

    let p = this.params

    //skip the term if coefficient is zero
    if (p.d != 0) {
      // skip the coefficient if it is 1
      str += (p.d != 1) ? `(${p.d})x^2` : `x^2`
    }
    if (p.e != 0) {
      if ( str != "" ) { str += " + " }
      str += (p.e != 1) ? `(${p.e})xy` : `xy`
    }
    if (p.f != 0) {
      if ( str != "" ) { str += " + " }
      str += (p.f != 1) ? `(${p.f})y^2` : `y^2`
    }
    if (p.a != 0) {
      if ( str != "" ) { str += " + " }
      str += (p.a != 1) ? `(${p.a})x` : `x`
    }
    if (p.b != 0) {
      if ( str != "" ) { str += " + " }
      str += (p.b != 1) ? `(${p.b})y` : `y`
    }
    str += ` = ${p.c}`
    return str
  }

  getSimple0() {
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
    str += ` - (${p.c})`
    return str
  }

  /** render simple equation latex in Katex */
  simpleKatex() {
    let latex = A.run(`printlatex([ ${ this.simple } ])`)
    return katex.renderToString(latex);
  }


  // this.listParams = listParams
  // this.getRow = getRow
  // this.nonZeroCoeffients = nonZeroCoeffients
  // this.firstNonZero = firstNonZeroIndex

  /** clone this equation then multiply all the parameters by the value
   * @param {algValue} val
   * @return {Equation}
  */
  multiply(val) {

    var p = {}

    for(var key in this.params) {

      p[key] = A.run(`(${ this.params[key] }) * (${val})`)

    }

    return new Equation( p.d, p.e, p.f, p.a, p.b, p.c )

  }

  /** clone this equation then divide all the parameters by the value
   * @param {algValue} val
   * @return {Equation}
  */
  divide(val) {

    var p = {}

    for(var key in this.params) {

      p[key] = A.run(`(${ this.params[key] }) / (${val})`)

    }

    return new Equation( p.d, p.e, p.f, p.a, p.b, p.c )

  }

  /** clone this equation then add all the parameters from the passed equation
   * @param {Equation} eq
   * @return {Equation}
  */
  add(eq) {

    var p = {}

    for(var key in this.params) {

      p[key] = A.run(`(${ this.params[key] }) + (${ eq.params[key] })`)

    }

    return new Equation( p.d, p.e, p.f, p.a, p.b, p.c )

  }


  /////////////////////////

  /** list properties */
  toString() {
    let str = ""

    for (var key in this){

      let label = " ".repeat(10-key.length) + key

      // list array items
      if (this[key] instanceof Array) {
        // label with count of items
        str += label + ' : ' + this[key].length + '\n'

        this[key].forEach( item => {
          label = " ".repeat(15-item.id.toString().length) + item.id
          str += `${label} : ${item.type}\n`
        })
      } else if (this[key] instanceof Equation) {

        str += label + ' : ' + this[key].simple + '\n'
      } else {
        str += label + ' : ' + this[key] + '\n'
      }
    }

    return str;
  }

  /** this.toString() in a console.group() */
  log() {
    console.group(`equation`)
    this.toString()
    console.groupEnd(`equation`)
  }

  /** get tab-delimited matrix row */
  getRow() {
    let p = this.params
    // return `|\t${p['d']}\t${p['e']}\t${p['f']}\t${p['a']}\t${p['b']}\t|\t${p['c']}\t|`
    return `|\t${p.d}\t${p.e}\t${p.f}\t${p.a}\t${p.b}\t|\t${p.c}\t|`
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
