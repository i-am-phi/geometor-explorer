/**
* Global instance of the Explorer object
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

  // const E1 = new Element("E1", "Hydrogen")
  // if (E1 instanceof Element) {
  //   log("E1 instanceof Element")
  // } else {
  //   log("E1 NOT ELEMENT")
  // }
  // console.dir(E1)
  // console.log(E1)
  // console.log(E1.toString())
  //

  console.time("* main *");


  //initial points set by X Y
  let P0 = new Point( "-1/2", "0" )
  //sequence the animations here.
  E.addPoint(P0)
  log(P0.toString())


  let P1 = new Point( "1/2", "0" )
  E.addPoint(P1)
  log(P1.toString())


  const L1 = new Line( P0, P1 )
  if (L1 instanceof Struct) {
    log("L1 instanceof Struct")
  } else {
    log("L1 NOT Struct")
  }

  console.dir(L1)
  console.log(L1)
  console.log(L1.toString())

  //baseline
  // const BL = new Line( P0, P1 )
  // E.addElement(BL)

  // vesica pisces
  // const CUw = Circle( P0, P1 );

  // const CUe = Circle( P1, P0 );


  //
  // // //bisector
  // Line( points[4], points[5] );

  // unit 2 circles from starting points
  // Circle( P0, points[3] );
  // Circle( P1, points[2] );

  console.timeEnd("* main *");

  console.time("* play *");

  TL_DRAW.play();

  console.timeEnd("* play *");

  // checkAllSegments();

  //animateGoldenSegments();

}


$( document ).ready(function() {
    console.log( "ready!" );
    main();
});
