import Explorer from './explorer/Explorer.js'

// import * as Animate from './explorer/Animate.js'
// import * as Diagnostics from './explorer/Diagnostics.js'
// import * as Test from './explorer/Test.js'

/**
* Global instance of the {@link Explorer} object
* @const
*/
const E = new Explorer();

/**
 * main.js - script to sequence the creating and display of the geometric model

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @function
 */
function main() {

  console.time("* main *");

  // let v = new Value("3^(1/2)")
  // v.log()
  // log(v.float)

  // let v2 = new Value("1/2")
  // let v3 = new Value("3^(1/2)")

  let P0 =  E.addPointByValue( "-1/2", "0" )
  // P0.log()

  let P1 =  E.addPointByValue( "1/2", "0" )
  // P1.log()

  E.addLine(0, 1)
  E.addCircle(0, 1)
  E.addCircle(1, 0)
  E.addLine(4, 5)
  E.addCircle(4, 0)
  E.addCircle(5, 0)
  // E.addLine(4, 0)
  // E.addLine(4, 1)
  // E.addLine(5, 0)
  // E.addLine(5, 1)
  E.addCircle(2, 1)
  E.addCircle(1, 2)
  E.addCircle(3, 0)
  E.addCircle(0, 3)

  console.timeEnd("* main *");

  // console.time("* play *");

  // TL_DRAW.play();

  // console.timeEnd("* play *");

  // checkAllSegments();

  //animateGoldenSegments();
}

main();
