
/** for the round function */
const PRECISION = 8;

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
export function run( cmd ) {
  var result = Algebrite.run( cmd.toString() )
  if ( checkValid(result) ) {
    return result
  } else {
    console.error(`ALG: "${cmd}"
        returns:
        ${result}`)
    //return nothing
  }
}

/** run command with logging cmd string before */
export function runLog( cmd ) {
  console.log(cmd + "\n")
  return run(cmd)
}

/** Algebrite may return a scalar (one result) or a tensor (a set of results) when solving.
 * This function parses the result and always returns an array of one or more results
 * @function
 * @param {algValue} roots - Algebrite command string
 * @returns {Array} of algValues
 */
export function parseRoots( roots ) {
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
export function isNumber( val ) {
  var num = run( `float(${val})` )
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
export function parseFloat( val ) {
  let num = run( `float(${val})` )
  let re = /(.*)\.\.\./
  num = num.replace(re, '$1')
  if ( isNaN( num ) ) {
    console.log( `*** parseFloat: "${val}" is not a Number.` )
    console.log( num )
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
export function checkValid(str) {
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
export function isComplex(str) {
  let complex = false

  if ( str.indexOf("i") !== -1 ) {
    complex = true
  }

  return complex
}

/** round for float comparison */
export function round(number) {
  let factor = Math.pow(10, PRECISION);
  return Math.floor(number * factor) / factor;
}

export function kat(str) {
  let latex = run(`printlatex(simplify(${str}))`);
  let kStr = katex.renderToString(latex)

  return kStr
}

/** @author 𝚽 <phi@geometor.com>
 * @license MIT
 */
