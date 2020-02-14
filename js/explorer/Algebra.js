const PRECISION = 8;


// shortcut for Algebrite.run
// check valid result
// return nothing if error
function alg( cmd ) {
  var result

  result = Algebrite.run( cmd.toString() )
  if ( checkValid(result) ) {
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


// check if Alg string has has i or stop
function checkValid(str) {
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


///////////////////////////////////////////////////////////////////////////////

function testAlgebrite() {


  var cmd = `A = 1/2 y - 1/4 3^(1/2) - 1/2 3^(1/2) x
B = 5/4 + x + x^2 + y^2
C = A - B
C
  `;
  var result = Algebrite.run( cmd );
  result = Algebrite.run( 'C' );
  log('C: ' + result);

  result = Algebrite.run( 'simplify(C)' );
  log('simplify(C): ' + result);
  //
  // result = Algebrite.run( 'expand(C)' );
  // log('expand(C): ' + result);

  result = Algebrite.run( "roots(C, x)" );
  log('roots(C, x): ' + result);

  var latex = Algebrite.run( 'printlatex(roots(C, x))' );
  katex.render(latex, footerPanel);

  result = Algebrite.run( "roots(C, y)" );
  log('roots(C, y): ' + result);

}
