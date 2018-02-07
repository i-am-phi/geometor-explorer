/**
 * System - collection of equations - starting with two elements
 * provides a roots solution set - an array of objects with x, y values
 * should show all the work
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 * @param {Element} element1 - first element
 * @param {Element} element2 - second element
 */
function System(element1, element2) {

  let eq1 = element1.eq
  let eq2 = element2.eq

  this.roots = [];

  console.group("* System *")

  // put the eqs in the array
  // this.id = systems.length

  this.eqs = [];

  // put the higher order equation in first
  if (eq1.dim >= eq2.dim) {
    this.eqs.push(eq1)
    this.eqs.push(eq2)
  } else {
    this.eqs.push(eq2)
    this.eqs.push(eq1)
  }

  // start to solve
  log("|\td\te\tf\ta\tb\t|\tc\t|")
  this.eqs.forEach( eq => {
    log(eq.getRow())
  })

  // analyze each equation
  this.eqs.forEach( (eq, index) => {

    console.group(`[${index}] ${eq}`)


    if (eq.canSolve()) {

      let eqId = index == 0 ? 1 : 0;

      if ( eq.hasXonly() ) {

        eq.xRoots.forEach( xRoot => {

          x = xRoot

          //sub into other equation to get values for a new equation
          y = this.eqs[eqId].YforX( x )
          log(`y = ${ y }`)

          newPoint = new Point(x, y, element1, element2)
          addPoint(newPoint);

          //add point to each parent point list
          element1.addPoint(newPoint);
          element2.addPoint(newPoint);
        })

      } else if ( eq.hasYonly() ) {

        eq.yRoots.forEach( yRoot => {

          y = yRoot
          log(`y = ${ y }`)

          //sub into other equation
          x = this.eqs[eqId].XforY( y )
          log(`x = ${ x }`)

          newPoint = new Point(x, y, element1, element2)
          addPoint(newPoint);

          //add point to each parent point list
          element1.addPoint(newPoint);
          element2.addPoint(newPoint);

        })

      } else {

        //try elimination
        log(`cannot be solved for one variable`)
        log(`clone and eliminate a variable`)
        log(`[${index}] nonZero count: ${eq.nonZeroCoeffients()}`)

      }

    } else {
      console.error(`this system is not solvable`)
    }

    console.groupEnd();
  }) //eqs.forEach


  // let clone = this.eqs[1].clone()
  // clone.multiply("(3)^(1/2)")
  // clone.listParams()
  // clone.add(this.eqs[0])
  // clone.listParams()
  // log(clone.getRow())



  console.groupEnd()

}
