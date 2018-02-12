function testLine(a1,b1,c1,a2,b2,c2, type, id) {

  let sys

  type = type || "testLine"

  console.group(type)

  let S1 = new Struct(null, null, type, "S1")
  S1.eq = new Equation("0", "0", "0", a1, b1, c1)
  S1.log()

  let S2 = new Struct(null, null, type, "S2")
  S2.eq = new Equation("0", "0", "0", a2, b2, c2)
  S2.log()

  sys = new System(S1, S2, type, "S1-S2")

  console.dir(sys)

  console.group("Points: " + sys.points.length )
    sys.points.forEach( point => {point.log()})
  console.groupEnd("Points")
  console.groupEnd(type)

  return sys

}

function testHVLineSet() {
  ///////////////////////////////////////
  let sys
  sys = testLine( "1",  "0",  "0",
                  "1",  "0",  "0",
                  "same vertical line"
                )
  if(sys.points.length != 0){
    console.error("expected zero points")
  }
  log("-----------------------------")

  sys = testLine( "1",  "0",  "2",
                  "1",  "0",  "3",
                  "parallel vertical line"
                )
  if(sys.points.length != 0){
    console.error("expected zero points")
  }
  log("-----------------------------")

  sys = testLine( "0",  "1",  "0",
                  "0",  "1",  "0",
                  "same horizontal line"
                )
  if(sys.points.length != 0){
    console.error("expected zero points")
  }
  log("-----------------------------")


  sys = testLine( "0",  "1",  "2",
            "0",  "1",  "3",
            "parallel horizontal line"
          )
  if(sys.points.length != 0){
    console.error("expected zero points")
  }
  log("-----------------------------")

  sys = testLine( "1",  "0",  "0",
            "0",  "1",  "0",
            "vertical - horizontal"
          )
  if( sys.points.length != 1 ){
    console.error("expected one point")
  } else {
    let pt = sys.points[0]
    if ( pt.x != "0" || pt.y != "0" ) {
      console.error("expected [ 0, 0 ]")
    }
  }
  log("-----------------------------")

  sys = testLine( "0",  "1",  "0",
            "1",  "0",  "0",
            "horizontal - vertical"
          )
  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  } else {
    let pt = sys.points[0]
    if ( pt.x != "0" || pt.y != "0" ) {
      console.error("expected [ 0, 0 ]")
    }
  }
  log("-----------------------------")

  sys = testLine( "1",  "0",  "3",
            "0",  "1",  "2",
            "vertical - horizontal offset"
          )

  sys = testLine( "0",  "1",  "2",
            "1",  "0",  "3",
            "horizontal - vertical offset"
          )

}

function test2varLines() {
  ///////////////////////////////////////
  let sys, checkX, checkY

  sys = testLine( "1",  "4",  "2",
                  "1",  "0",  "0",
                  "1-4-2 line"
                )

  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  }
  else {
    checkX = "0"
    checkY = "1/2"
    let pt = sys.points[0]
    if ( pt.x != checkX || pt.y != checkY ) {
      console.error(`expected [ (${checkX}),  (${checkY}) ]`)
    }
  }

  log("-----------------------------")
  sys = testLine( "1",  "4",  "2",
                  "4",  "1",  "5",
                  "switch a b"
                )

  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  }
  else {
    checkX = "0"
    checkY = "1/2"
    let pt = sys.points[0]
    if ( pt.x != checkX || pt.y != checkY ) {
      console.error(`expected [ (${checkX}),  (${checkY}) ]`)
    }
  }

  log("-----------------------------")

}

function textBook() {
  ///////////////////////////////////////
  let sys, checkX, checkY

  sys = testLine( "3",  "2",  "1",
                  "5",  "-2",  "23",
                  "11.1"
                )

  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  }
  else {
    checkX = "3"
    checkY = "-4"
    let pt = sys.points[0]
    if ( pt.x != checkX || pt.y != checkY ) {
      console.error(`expected [ (${checkX}),  (${checkY}) ]`)
    }
  }

  log("-----------------------------")

  sys = testLine( "4",  "-5",  "21",
                  "3",  "7",  "-38",
                  "11.2"
                )

  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  }
  else {
    checkX = "-1"
    checkY = "-5"
    let pt = sys.points[0]
    if ( pt.x != checkX || pt.y != checkY ) {
      console.error(`expected [ (${checkX}),  (${checkY}) ]`)
    }
  }

  log("-----------------------------")

  sys = testLine( "3",  "-2",  "5",
                  "2",  "7",  "9",
                  "11.3"
                )

  if ( sys.points.length != 1 ) {
    console.error("expected one point")
  }
  else {
    checkX = "53/25"
    checkY = "17/25"
    let pt = sys.points[0]
    if ( pt.x != checkX || pt.y != checkY ) {
      console.error(`expected [ (${checkX}),  (${checkY}) ]`)
    }
  }

  log("-----------------------------")

}
