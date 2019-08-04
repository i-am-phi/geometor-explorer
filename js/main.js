
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


  let P0 = new Point( "-1/2", "0" )
  E.addPoint(P0)
  P0.log()

  let P1 = new Point( "1/2", "0" )
  E.addPoint(P1)
  P1.log()

  let L0 = new Line( P0, P1 )
  E.addStruct(L0)
  L0.log()

  let C0 = new Circle( P0, P1 )
  // console.dir(C0)
  E.addStruct(C0)
  C0.log()

  let C1 = new Circle( P1, P0 )
  E.addStruct(C1)
  // C0.log()



  console.timeEnd("* main *");

  // console.time("* play *");

  // TL_DRAW.play();

  // console.timeEnd("* play *");

  // checkAllSegments();

  //animateGoldenSegments();

}


$( document ).ready(function() {
    console.log( "ready!" );
    main();
});
