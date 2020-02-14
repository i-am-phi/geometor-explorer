

var elements = [];



//TODO: create a common class of Eleemnt for Line and Circle

//add a point to the parent element
function addPointToList(point) {
  // check if point is already in list
  if (!this.points.includes(point)) {
    // add new point to parent
    this.points.push(point);
  }

}




// test two element equations for an intersection
function intersect(element1, element2){

  // if either equation is 1 dimension do subst
  // if both are 2 dimension - then subtract

  if (element1.dim == 1) {

    substitute(element1, element2)

  } else if (element2.dim == 1) {

    //REVERSE ELEMENTS
    substitute(element2, element1)

  } else {

    // both equations are two dimensions
    subtract(element1, element2)

  }

}

function substitute(element1, element2) {
  let x, y

  setSystem(element1, element2)

  console.group(`solution`)

  log(`* substitute E1 into E2`)

  if (element1.eqX) {
    log(`* use element1.eqX  `)

    element1.eqX.forEach( E1x => {


      // else solve for scalar x after y

      // does eqX contain a y term?
      if (E1x.indexOf("y")) {
        alglog(`   E1x = ${ E1x }`)
        log(   `       = ${ alg(`E1x`) }`)

        // TODO: check if
        if (element2.degX != 0) {

        }
        
        alglog(`   E2s = subst(E1x, x, E2)`)
        log(   `       = ${ alg(`E2s`) }`)

        alglog(`   E2ry = roots(E2s, y)`)
        roots = parseRoots( alg(`E2ry`) )

        roots.forEach( y => {
          console.group("root")
          log(   `     y = ${ y }`)

          alglog(`   E2x = roots(subst(${ y }, y, E2), x)`)
          x = alg(`E2x`)
          log(   `     x = ${ x }`)
          addPoint(x, y, element1, element2);
          console.groupEnd("root")
        })

      } else {
        //eqX is scalar value
        x = E1x
        if (element2.degX != 0) {

        } else {
          y = element2.eqY
        }
        //
      }


      alglog(`   E1x = ${ E1x }`)
      log(   `       = ${ alg(`E1x`) }`)

      // TODO: check if
      alglog(`   E2s = subst(E1x, x, E2)`)
      log(   `       = ${ alg(`E2s`) }`)

      alglog(`   E2ry = roots(E2s, y)`)
      roots = parseRoots( alg(`E2ry`) )

      roots.forEach( y => {
        console.group("root")
        log(   `     y = ${ y }`)

        alglog(`   E2x = roots(subst(${ y }, y, E2), x)`)
        x = alg(`E2x`)
        log(   `     x = ${ x }`)
        addPoint(x, y, element1, element2);
        console.groupEnd("root")
      })

    })

  } else if (element1.eqY) {
    // degX == 1
    // eqX has a y term
    log(`* use element1.eqY`)

    element1.eqY.forEach( E1y => {

      alglog(`   E1y = ${ E1y }`)
      log(   `       = ${ alg(`E1y`) }`)

      alglog(`   E2s = subst((${ E1y }), y, E2)`)
      log(   `       = ${ alg(`E2s`) }`)

      alglog(`   E2rx = roots(E2s, x)`)
      roots = parseRoots( alg(`E2rx`) )

      roots.forEach( x => {
        console.group("root")
        log(   `     x = ${ x }`)

        alglog(`   E2y = roots(subst(${ x }, x, E2), y)`)
        y = alg(`E2y`)
        log(   `     y = ${ y }`)
        addPoint(x, y, element1, element2);
        console.groupEnd("root")
      })
    })
  }

  console.groupEnd(`solution`)

}

function subtract(element1, element2) {
  let x, y

  setSystem(element1, element2)

  console.group(`solution`)

  log(`subtract E2 from E1`)
  cmd = `    S = E1 - E2`
  alglog(cmd)
  log(  `      = ${ alg(`S`) }`)

  // check if there is an x term in S
  var degSx = alg("deg(S, x)")
  log(" degSx = deg(S, x)")
  log("       = " + degSx)

  // check if there is an x term in S
  var degSy = alg("deg(S, y)")
  log(" degSy = deg(S, y)")
  log("       = " + degSy)

  if (degSx != 0) { // more than 1 but not zero

    var rootsSx = parseRoots( alg("roots(S, x)") )
    log(" rootsSx = roots(S, x)")


    rootsSx.forEach( rootSx => {

      console.group(`rootSx`)

        // log(`  Sx = roots(S, x)[${i}]`)
        log("   Sx = " + alg( `Sx = ${ rootSx } \n Sx` ) )
        log("        deg(Sx) = " + alg( `deg(Sx)` ) )

        // check both equations

        E1Sx = alg( "E1Sx = subst( Sx, x, E1 ) \n E1Sx" )
        log(" E1Sx = subst( Sx, x, E1 )"  )
        log("      = " + E1Sx )

        E2Sx = alg( "E2Sx = subst( Sx, x, E1 ) \n E2Sx" )
        log(" E2Sx = subst( Sx, x, E2 )"  )
        log("      = " + E2Sx )

        if (E1Sx != E2Sx) {
          console.warn(`E1Sx != E2Sx`)
        }

        // if both equations show same result

        var rootsE1y = parseRoots( alg( "roots( E1Sx, y )" ) )
        log("rootsE1y = roots( E1Sx, y )" )
        rootsE1y.forEach( rY => {
          // log("       = " + rY )

          console.group(`rY`)
          log(`    rY = ` + alg( `rY = ${ rY } \n rY` ) )

          if (degSx == 1) {
            // Sx = x
            x = rootSx
            y = rY
            addPoint(x, y, element1, element2);

          } else {

            var rootsX = parseRoots( alg( `roots( E1x, x )` ) )
            log("rootsX = roots( E1x, x )" )
            rootsX.forEach( rX => {

              log("       = " + rX )
              console.group("  x = " + rootsX[k] )
              x = rX
              y = rY

              addPoint(rX, rY, element1, element2);
              console.groupEnd();

            })

          }

          console.groupEnd(`rY`);

        })



      console.groupEnd(`rootSx`)

    }) //forEach rootsSx

  } else { // degX == 0 or something bad

    log(`* no x term in S`)

    var degSy = alg("deg(S, y)")
    log(" deg(S, y): " + degSy)

    if (degSy != "0") {

      var rootsSy = parseRoots( alg("roots(S, y)") )
      log(" rootsSy = roots(S, y)")

      rootsSy.forEach( rootSy => {

        console.group(`rootSy`)


          log(" Sy: " + alg(`Sy = ${ rootSy }] \n Sy`) )

          // check both equations

          x1 = alg( "x1 = roots( subst( Sy, y, E1 ), x ) \n x1" )
          log("  x1 = " + x1 )

          x2 = alg( "x2 = roots( subst( Sy, y, E2 ), x ) \n x2" )
          log("  x2 = " + x2 )


          if (x1 == x2) {

            log(" E1y: " + alg(`E1y = subst( x1, x, E1 ) \n E1y`) )

            var degE1y = alg("deg(E1y, x)")
            log("  degE1y = " + degE1y )

            for (let j = 1; j <= degE1y; j++) {

              y = alg( `roots( E1y, y )[${j}]` )
              log("  y = " + y )

              addPoint(x1, y, element1, element2);

            }

          } else {
            console.warn("x1 != x2")
          }

        console.groupEnd("rootSy")

      }) //forEach rootSy
    }
  }

  console.groupEnd(`solution`)

}



function setSystem(element1, element2) {

  console.group(`system`)

  // get equation of element1
  cmd = `E1 = ${element1.eq}`
  alglog(cmd)
  log(  `   = ${ alg(`E1`) }`)
  log(  `     E1.dim: ${ element1.dim }`)

  // get equation of element2
  cmd = `E2 = ${element2.eq}`
  alglog(cmd)
  log(  `   = ${ alg(`E2`) }`)
  log(  `     E2.dim: ${ element2.dim }`)

  console.groupEnd(`system`)

}
