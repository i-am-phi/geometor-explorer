/**
 * A global instance of the {@link Alg} object

 * @author 𝚽 <phi@geometor.com>
 * @license MIT

 * @const
 * @example
 * A.run( `a = x^2 - x - 1` )
 */
const A = new Alg()

/**
 * A container object for Algebrite helper functions<br>
 * run from {@link A}

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @class
 */

function Alg() {

  /** for the round function */
  this.PRECISION = 8;

  /**
  * shortcut for Algebrite.run see: {@link http://algebrite.org}

  * checks for valid result
  *
  * @function
  * @param {algCommand} cmd - Algebrite command string
  * @returns {algExpression} algebraic expression - nothing on error
  * @example
  * cmd = `c = ((${pt1.x}) * (${pt2.y})) - ((${pt2.x}) * (${pt1.y}))`
  * A.run(cmd)
  * let c = A.run(`c`)

  */
  this.run = function( cmd ) {
    var result

    result = Algebrite.run( cmd.toString() )
    if ( A.checkValid(result) ) {
      return result
    } else {
      console.error(`ALG: "${cmd}"
        returns:
        ${result}`)
      //return nothing
    }
  }
  /** run command with logging cmd string before */
  this.runLog = function( cmd ) {
    console.log(cmd + "\n")
    return this.run(cmd)
  }

  /** Algebrite may return a scalar (one result) or a tensor (a set of results) when solving.
  * This function parses the result and always returns an array of on or more results
  * @function
  * @param {algValue} roots - Algebrite command string
  * @returns {Array} of algValues
  */
  this.parseRoots = function( roots ) {
    if (roots) {
      return roots.replace("[", "").replace("]", "").split(",")
    }
  }

  /** check if algebraic value can be converted to a decimal float number
  * returns false if not a number
  *
  * @function
  * @param {algValue} val - Algebrite command string
  * @returns {boolean}
  */
  this.isNumber = function( val ) {
    var num = A.run( `float(${val})` )
    if ( isNaN( num ) ) {
      log( `*** isNumber: "${val}" is not a Number.` )
      return false;
    }
    return true;
  }

  /** convert the algebraic value to float and check if number<br>
  * returns false if not a number
  *
  * @function
  * @param {algValue} val - Algebrite command string
  * @returns {float | false}
  */
  this.parseFloat = function ( val ) {
    var num = parseFloat(A.run( `float(${val})` ))
    if ( isNaN( num ) ) {
      log( `*** parseFloat: "${val}" is not a Number.` )
      return false
    }
    return num
  }

  /**
  * check if algExpression string has `"Stop:"` or `"nil"`
  *
  * @function
  * @param {algExpression} str - Algebrite command string
  * @returns {boolean} true or false
  */
  this.checkValid = function (str) {
    let valid = true;

    if ( str.indexOf("Stop:") !== -1 ) {
      console.warn(`value: (${str}) contains 'Stop'`);
      valid = false;
    }

    if ( str.indexOf("nil") !== -1 ) {
      console.warn(`value: (${str}) contains 'nil'`);
      valid = false;
    }

    return valid;
  }


  /** check if algebraic value has the value `i`
  *
  * @function
  * @param {algExpression} str - Algebrite command string
  * @returns {boolean} true or false
*/
  this.isComplex = function (str) {
    let complex = false

    if ( str.indexOf("i") !== -1 ) {
      complex = true
    }

    return complex
  }

  /** round for float comparison */
  this.round = function (number) {
    var factor = Math.pow(10, PRECISION);
    return Math.floor(number * factor) / factor;
  }


}
