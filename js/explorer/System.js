/**
 * System - collection of equations - starting with two structures
 * provides a roots solution set - an array of objects with x, y values
 * should show all the work
 *
 * @class
 * @param {Struct} struct1 - first struct
 * @param {Struct} struct2 - second struct
 * @param {string} type - optional: type of element - such as "Point" - like a class in CSS
 * @param {string} id - optional: unique id for the element
 */
class System extends Element {

  constructor(struct1, struct2, type, id) {

    type = type || "System"

    super(type, id)

    /** Array fo the {@link Struct} objects of the System */
    this.structs = []
    this.structs.push( struct1 )
    this.structs.push( struct2 )

    /** Array of Equation objects from the Structs
    * - new equations may be added to show the work of solution */
    this.eqs = []
    this.eqs.push( struct1.eq )
    this.eqs.push( struct2.eq )

    /** a place to log the work */
    this.history = []

    this.sortEquations()

    /** Array of {@link Point} objects representing roots of the System */
    this.points = []

    this.getPoints()


  } //constructor

  getPoints() {
    // begin the interrogation
    let x, y

    //equations should be sorted
    let eq0 = this.eqs[0]
    let eq1 = this.eqs[1]

    // solve from the bottom up
    this.hlog("solve from bottom up")

    this.hlog("eq0 vars: " + eq0.vars)
    this.hlog("eq1 vars: " + eq1.vars)

    // start interrogation
    this.hlog("eq1 has var count: " + eq1.vars.length)

    // how many variables in eq1?
    switch(eq1.vars.length){

      // eq1 has 1 variable
      case 1:

        // eq1 has x only
        if (eq1.hasXonly) {
          this.hlog("eq1 has x only")

          // eq1.xRoots will be scalar
          this.hlog( "eq1.xRoots.forEach: " + eq1.xRoots)
          eq1.xRoots.forEach( x => {

            // if eq0 has x only
            if(eq0.hasXonly) {
              this.hlog("eq0 has x only")
              this.hlog("eq0 and eq1 have same variable")
              this.hlog("*** no solution")
            }
            // if eq0 has y only
            else if(eq0.hasYonly) {
              this.hlog("eq0 has y only")

              // perpendicular - we are done
              // yRoots will have scalar values
              eq0.yRoots.forEach( y => {

                this.addPoint(x, y)

              })
            }
            // eq0 has two variables
            else {

              //substitute x into eq0
              eq0.getYRootsforX(x).forEach( y => {

                this.addPoint(x, y)

              })

            }
          }) //eq1.xRoot.forEach

        }
        // eq1 has y only
        else if (eq1.hasYonly) {

          // eq1.yRoots will be scalar
          eq1.yRoots.forEach( y => {

            if(eq0.hasYonly) {
              this.hlog("eq0 and eq1 have same variable")
              this.hlog("*** no solution")
            }
            else if(eq0.hasXonly) {
              // perpendicular - we are done
              // xRoots will have scalar values
              eq0.xRoots.forEach( x => {

                this.addPoint(x, y)

              })
            }
            else {
              //eq0 has two variables

              //substitute x into eq0
              eq0.getXRootsforY(y).forEach( x => {

                this.addPoint(x, y)

              })

            }
          }) //eq1.yRoot.forEach

        }

        break

      //eq1 has 2 variables
      case 2:

        // what is eq1.dim?
        switch(eq1.dim){

          // eq1 has 2 dimensions
          // - eq0 will be dim 2 as well
          // - in the current model, that would be two circles
          case 2:

            this.hlog("multiply eq0 by -1 to create eq2")

            let eq2 = eq0.multiply("-1")
            this.eqs.push(eq2)
            this.hlog(`eq2: ${eq2.getRow()}`)


            this.hlog("add eq2 to eq1")

            let eq3 = eq1.add(eq2)
            this.eqs.push(eq3)
            this.hlog(`eq3: ${eq3.getRow()}`)

            if (eq3.hasX) {
              // get xRoots of eq3 then substitute in eq0

              this.hlog( "eq3.xRoots.forEach: " + eq3.xRoots)
              eq3.xRoots.forEach( xRoot => { // xRoot will be an expression with y

                if (eq3.hasXonly) {
                  x = xRoot
                  // yRoots are scalar
                  this.hlog( `eq0.getYRootsforX(${x}): ` + eq0.getYRootsforX(x))
                  eq0.getYRootsforX(x).forEach( y => {

                      this.addPoint(x, y)

                  })
                }
                else {
                  // eq3 has (x && y)
                  this.hlog( `eq0.getYRootsforX(${xRoot}): ` + eq0.getYRootsforX(xRoot))
                  eq0.getYRootsforX(xRoot).forEach( y => {

                    this.hlog( `eq0.getXRootsforY(${y}): ` + eq0.getXRootsforY(y))
                    eq0.getXRootsforY(y).forEach( x => {

                      this.addPoint(x, y)

                    })
                  })

                }
              })

            }
            else if (eq3.hasY) {
              // get xRoots of eq3 then substitute in eq0

              this.hlog( "eq3.yRoots.forEach: " + eq3.yRoots)
              eq3.yRoots.forEach( yRoot => { // yRoot will be an expression with y


                this.hlog( `eq0.getYRootsforX(${yRoot}): ` + eq0.getYRootsforX(yRoot))
                eq0.getXRootsforY(yRoot).forEach( x => {

                  this.hlog( `eq0.getXRootsforY(${y}): ` + eq0.getXRootsforY(y))
                  eq0.getYRootsforX(x).forEach( y => {

                    this.addPoint(x, y)

                  })
                })
              })

            }


            // TODO: subtract the circles to get a third equation
            // for now - brute force subsitution


            break

          // eq1 has 1 dimensions -
          // - in the current model, would be a line
          // - both equations will have two vars
          case 1:

            this.hlog( "eq1.xRoots.forEach: " + eq1.xRoots)
            eq1.xRoots.forEach( xRoot => { // xRoot will be an expression with y


              this.hlog( `eq0.getYRootsforX(${xRoot}): ` + eq0.getYRootsforX(xRoot))
              eq0.getYRootsforX(xRoot).forEach( y => {

                this.hlog( `eq0.getXRootsforY(${y}): ` + eq0.getXRootsforY(y))
                eq0.getXRootsforY(y).forEach( x => {

                  this.addPoint(x, y)

                })
              })
            })


            break



        }
        break

      // should not get here
      default :

    }


  } // getPoints()

  sortEquations(){

    this.hlog("---")
    this.hlog("order equations")
    this.eqs.sort( this.equationRank )
    this.eqs.forEach( (eq, index) => {
      this.hlog(`eq${index}: ${eq.general}`)
    })
    this.eqs.forEach( (eq, index) => {
      this.hlog(`eq${index}: ${eq.simple}`)
    })
    this.eqs.forEach( (eq, index) => {
      this.hlog(`parsed eq${index}: ${eq.simple0Parsed}`)
    })
    this.eqs.forEach( (eq, index) => {
      this.hlog(`eq${index}: ${eq.getRow()}`)
    })
    this.hlog("---")

  }

  /** used for sorting equations by number of vars and number of dimensions

  * sort by number vars then number of dimensions - descending order
  @param {Equation} eq0
  @param {Equation} eq1
  * */
  equationRank(eq0, eq1) {

    if (eq0.vars.length > eq1.vars.length) {
      return -1 //leave
    }
    else if (eq0.vars.length < eq1.vars.length) {
      return 1 //switch
    }
    else {
      //equal so check dimension
      if (eq0.dim > eq1.dim) {
        return -1 //leave
      }
      else if (eq0.dim < eq1.dim) {
        return 1 //switch
      }
      else {
        // same
        return 0
      }
    }
  }

  addPoint(x, y){

    this.hlog("x = " + x)
    this.hlog("y = " + y)

    this.points.push( new Point(x, y, this.structs[0], this.structs[1]) )
    this.hlog(`*** new point set [ ${x}, ${y} ]`)

  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
