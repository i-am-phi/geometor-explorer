
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
* alg(cmd)
* let c = alg(`c`)

*/
function alg( cmd ) {
  var result

  result = Algebrite.run( cmd.toString() )
  if ( algCheckValid(result) ) {
    return result
  } else {
    console.error(`ALG: "${cmd}"
    returns:
    ${result}`)
    //return nothing
  }
}

function alglog(cmd) {
  log(cmd)
  return alg(cmd)
}

//return array of values
function parseRoots(roots) {
  if (roots) {
    return roots.replace("[", "").replace("]", "").split(",")
  }
}

// check if algebraic value can be converted to a decimal float number
function checkNumber( val ) {
  var num = alg( `float(${val})` );
  if ( isNaN( num ) ) {
    log( `*** checkNumber: "${val}" is not a Number.` );
    stop;
    return false;
  }
  return true;
}

// check if algebraic value then return decimal float value
function getNumber( val ) {
  var num = parseFloat(alg( `float(${val})` ));
  if ( isNaN( num ) ) {
    log( `*** getNumber: "${val}" is not a Number.` );
    stop;
    return false;
  }
  return num;
}

function round(number) {
  var factor = Math.pow(10, PRECISION);
  return Math.floor(number * factor) / factor;
}


/**
* check if algExpression string has `"Stop:"` or `"nil"`
*
* @function
* @param {algExpression} str - Algebrite command string
* @returns {boolean} true or false
*/
function algCheckValid(str) {
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

function checkComplex(str) {
  let complex = false

  if ( str.indexOf("i") !== -1 ) {
    complex = true
  }

  return complex
}
