

var elements = [];



//TODO: create a common class of Elelemnt for Line and Circle

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

  //TODO: return R as set of solutions
  let result = {}

  // get equation of element1
  cmd = `   E1 = ${element1.eq}`
  alglog(cmd)
  log(  `      = ${ alg(`E1`) }`)
  log(  `        E1.dim: ${ element1.dim }`)

  // get equation of element2
  cmd = `   E2 = ${element2.eq}`
  alglog(cmd)
  log(  `      = ${ alg(`E2`) }`)
  log(  `        E2.dim: ${ element2.dim }`)

  // TODO: move this to the 2x2 dimension
  cmd = `    S = E1 - E2`
  alglog(cmd)
  log(  `      = ${ alg(`S`) }`)

  // if either equation is 1 dimension do subst
  // if both are 2 dimension - then subtract

  let x, y

  if (element1.dim == 1) {
    log(`* substitute element1 into element2`)

    if (element1.degX == 1) {
      log(`* use element1.eqX  `)

      alglog(`   E2y = roots(subst((${ element1.eqX }), x, E2), y)`)
      y = alg(`E2y`)
      log(   `     y = ${ y }`)

      alglog(`   E2x = roots(subst((E2y), y, E2), x)`)
      x = alg(`E2x`)
      log(   `     x = ${ x }`)

    } else if (element1.degY == 1) {
      // degX == 1
      // eqX has a y term
      log(`* use element1.eqY`)

      alglog(`   E2x = roots(subst((${ element1.eqY }), y, E2), x)`)
      x = alg(`E2x`)
      log(   `     x = ${ x }`)

      alglog(`   E2y = roots(subst((E2x), x, E2), y)`)
      y = alg(`E2y`)
      log(   `     y = ${ y }`)
    }

  } else if (element2.dim == 1) {
    log(`* substitute element2 into element1`)
    if (element2.degX == 1) {
      log(`* use element2.eqX  `)

      alglog(`   E2y = roots(subst((${ element2.eqX }), x, E2), y)`)
      y = alg(`E2y`)
      log(   `     y = ${ y }`)

      alglog(`   E2x = roots(subst((E2y), y, E2), x)`)
      x = alg(`E2x`)
      log(   `     x = ${ x }`)

    } else if (element2.degY == 1) {
      // degX == 1
      // eqX has a y term
      log(`* use element2.eqY`)

      alglog(`   E2x = roots(subst((${ element2.eqY }), y, E2), x)`)
      x = alg(`E2x`)
      log(   `     x = ${ x }`)

      alglog(`   E2y = roots(subst((E2x), x, E2), y)`)
      y = alg(`E2y`)
      log(   `     y = ${ y }`)
    }
  } else {
    //bpth are quadratic
  }

  //   // pass E2 root set to E1 to eliminate variable
  //   if (element2.eqX) {
  //     log(`* subst E2x for x in E1`)
  //     element2.eqX.forEach( E2x => {
  //       // subst element2.eqX for x in E1
  //
  //       cmd = `  E2x = ${ E2x }`
  //       alglog(cmd)
  //       log(  `      = ${ alg(`E2x`) }`)
  //
  //       cmd = `  E1y = subst(E2x, x, E1)`
  //       alglog(cmd)
  //       log(  `      = ${ alg(`E1y`) }`)
  //
  //       cmd = `  R1y = roots(E1y, y)`
  //       alglog(cmd)
  //       log(  `      = ${ alg(`R1y`) }`)
  //
  //     })
  //   } else {
  //     if (element2.eqY) {
  //       log(`* subst E2y for y in E1`)
  //       element2.eqY.forEach( E2y => {
  //         // subst element2.eqY for y in E2
  //         cmd = `  E2y = ${ E2y }`
  //         alglog(cmd)
  //         log(  `      = ${ alg(`E2y`) }`)
  //
  //         cmd = `  E1x = subst(E2y, y, E1)`
  //         alglog(cmd)
  //         log(  `      = ${ alg(`E1x`) }`)
  //
  //         cmd = `  R1x = roots(E1x, x)`
  //         alglog(cmd)
  //         log(  `      = ${ alg(`R1x`) }`)
  //
  //
  //       })
  //     }
  //   }
  // }





  // check if there is an x term
  var degX = alg("deg(S, x)")
  log(" degX = deg(S, x)")
  log("      = " + degX)

  if (degX !== "0") { // more than 1 but not zero

    // log("* roots(S, x): " + alg("roots(S, x)"))
    // log("* deg(roots(S, x), y): " + alg("deg(roots(S, x), y)"))

    var rootsSx = parseRoots( alg("roots(S, x)") )
    log(" rootsSx = roots(S, x)")
    rootsSx.forEach( root => {
      log("         = " + root )
    })

    // console.dir(rootsSx)

    for (let i = 0; i < rootsSx.length; i++) {
      console.group(`rootsSx[${i}]`)

        // log(`  Sx = roots(S, x)[${i}]`)
        log("   Sx = " + alg( `Sx = ${ rootsSx[i] } \n Sx` ) )
        log(" deg(Sx) = " + alg( `deg(Sx)` ) )

        // check both equations

        E1Sx = alg( "E1Sx = subst( Sx, x, E1 ) \n E1Sx" )
        log(" E1Sx = subst( Sx, x, E1 )"  )
        log("      = " + E1Sx )

        y1 = alg( "y1 = roots( E1Sx, y ) \n y1" )
        log("   y1 = roots( E1Sx, y )"  )
        log("      = " + y1 )

        E2Sx = alg( "E2Sx = subst( Sx, x, E1 ) \n E2Sx" )
        log(" E2Sx = subst( Sx, x, E2 )"  )
        log("      = " + E2Sx )

        y2 = alg( "y2 = roots( E2Sx, y ) \n y2" )
        log("   y2 = roots( E2Sx, y )" )
        log("      = " + y2 )

        // if both equations show same result
        if (y1 == y2) {

          var rootsY = parseRoots( alg( "roots( E1Sx, y )" ) )
          log("rootsY = roots( E1Sx, y )" )
          rootsY.forEach( root => {
            log("       = " + root )
          })

          for (let j = 0; j < rootsY.length; j++) {

            console.group(`rootsY[${j}]`)
            log(`    rY = ` + alg( `rY = ${ rootsY[j] } \n rY` ) )

            E1x = alg( "E1x = subst( rY, y, E1 ) \n E1x" )
            log(`   E1x = subst( rY, y, E1 ) ` )
            log("       = " + E1x )

            var rootsX = parseRoots( alg( `roots( E1x, x )` ) )
            log("rootsX = roots( E1x, x )" )
            rootsX.forEach( root => {
              log("       = " + root )
            })

            for (let k = 0; k < rootsX.length; k++) {
              console.group("  x = " + rootsX[k] )

              addPoint(rootsX[k], rootsY[j], element1, element2);
              console.groupEnd();
            }
            console.groupEnd();
          }

        }

      console.groupEnd()

    }


  } else { // degX == 0 or something bad

    log(`* no x term`)
    var degY = alg("deg(S, y)")
    log(" deg(S, y): " + degY)

    if (degY != "0") {

      for (let i = 1; i <= degY; i++) {

        console.group("root y: " + i)

          log(" Sy: " + alg(`Sy = roots(S, y)[${i}] \n Sy`) )

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

        console.groupEnd()

      }

    }
  }

}
