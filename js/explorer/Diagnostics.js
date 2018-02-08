///////////////////////////////////////////////////////////////////////////////


function checkAllPoints() {
  log("check all points *************************")
  points.forEach( point => {
    console.group( "Point: " + point.id )
    // log( point.toString() )

    log(` xVal: ${point.xVal}`)
    log(`    x: ${point.x}`)

    let simpX = A.run( `simplify( ${point.x} )` )
    log(`simpX: ${simpX}`)
    if ( simpX != point.x ) {
      console.warn(`x: ${simpX} != ${point.x}`)
    }

    log(` yVal: ${point.yVal}`)
    log(`    y: ${point.y}`)

    let simpY = A.run( `simplify( ${point.y} )` )
    log(`simpY: ${simpY}`)
    if ( simpY != point.y ) {
      console.warn(`y: ${simpY} != ${point.y}`)
    }

    console.groupEnd()
  })
}

function checkLine( line ) {
  console.group( "Check Line: " + line.id )
  console.dir(line)
  var x1, y1, x2, y2
  var a, b, c

  A.run( "clearall" )


  console.group( "Point: " + line.points[0].id)
    cmd = `x1 = (${line.points[0].x})
    x1`
    log( cmd )
    var x1 = A.run( cmd )
    log( `   = ${x1}` )

    cmd = `y1 = (${line.points[0].y})
    y1`
    log( cmd )
    var y1 = A.run( cmd )
    log( `   = ${y1}` )
  console.groupEnd()

  console.group( "Point: " + line.points[1].id)
    cmd = `x2 = (${line.points[1].x})
    x2`
    log( cmd )
    var x2 = A.run( cmd )
    log( `   = ${x2}` )

    cmd = `y2 = (${line.points[1].y})
    y2`
    log( cmd )
    var y2 = A.run( cmd )
    log( `   = ${y2}` )
  console.groupEnd()


  console.group( "a = y1 - y2" )
    cmd = ` a = (${y1}) - (${y2})`
    log( cmd )
    A.run( cmd )
    var a = A.run( "a" )
    log( `   = ${a}` )

    var a2 = A.run( "a2 = simplify(a) \n a2" )
    log( `   = ${a2}` )
  console.groupEnd()

  // b = x2 - x1
  console.group( "b = x2 - x1" )
    cmd = ` b = (${x2}) - (${x1})`
    log( cmd )
    A.run( cmd )
    var b = A.run( "b" )
    log( `   = ${b}` )

    var b2 = A.run( "b2 = simplify(b) \n b2" )
    log( `   = ${b2}` )
  console.groupEnd()

  console.group( "c = (x1 * y2) - (x2 * y1)" )

    cmd = ` c = ((${x1}) * (${y2})) - ((${x2}) * (${y1}))`
    log( cmd )
    A.run( cmd )
    var c = A.run( "c" )
    log( `   = ${c}` )

    var c2 = A.run( "c2 = simplify(c) \n c2" )
    log( `   = ${c2}` )

  console.groupEnd()

  console.group( "eq = (a) * x + (b) * y + (c)" )

    cmd = `eq = (a) * x + (b) * y + (c) \n eq`
    var eq = A.run( cmd )
    log( `   = ${eq}` )

    var eq2 = A.run( "eq2 = simplify(eq) \n eq2" )
    log( `   = ${eq2}` )

    cmd = `eq3 = (a2) * x + (b2) * y + (c2) \n eq3`
    var eq3 = A.run( cmd )
    log( `   = ${eq3}` )

  console.groupEnd()

  console.group( "xRoot" )

    cmd = `xRoot = roots(eq, x) \n xRoot`
    var xRoot = A.run( cmd )
    log( ` x = ${ xRoot }` )

    var xRoot2 = A.run( `xRoot2 = simplify(xRoot) \n xRoot2`)
    log( `   = ${ xRoot2 }` )

    log()
    log( ` x1 = ${x1}` )
    log( ` y1 = ${y1}` )
    log( ` * test y1 on xRoot`)
    cmd = `subst(y1, y, xRoot)`
    var xForY1 = A.run( cmd )
    log( ` x1 for y1 = ${xForY1}` )
    if (x1 != xForY1) {
      console.warn(`x1 != xForY1`)
    }


    log()
    log( ` * test y1 on xRoot2`)
    cmd = `subst(y1, y, xRoot2)`
    var xForY1 = A.run( cmd )
    log( ` x1 for y1 = ${xForY1}` )
    if (x1 != xForY1) {
      console.warn(`x1 != xForY1`)
    }


  console.groupEnd()

  console.group( "yRoot" )

    cmd = `yRoot = roots(eq, y) \n yRoot`
    var yRoot = A.run( cmd )
    log( ` y = ${yRoot}` )
    log( `   = ${ A.run('simplify(yRoot)') }` )

  console.groupEnd()

  console.groupEnd()
}
