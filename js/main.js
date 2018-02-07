/**
* Global instance of the Explorer object
* @global
*/
var E = new Explorer();

/**
 * main.js - script to sequence the creating and display of the geometric model

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @function
 * @example
 * //initial points set by X Y
 * const P0 = new Point( "-1/2", "0" )
 * E.addPoint(P0)
 *
 * const P1 = new Point( "1/2", "0" )
 * E.addPoint(P1)
 *
 * //baseline
 * const BL = new Line( P0, P1 )
 * E.addElement(BL)

 */
function main() {


  //initial points set by X Y
  const P0 = new Point( "-1/2", "0" )
  //sequence the animations here.
  E.addPoint(P0)


  const P1 = new Point( "1/2", "0" )
  E.addPoint(P1)

  //baseline
  const BL = new Line( P0, P1 )
  E.addElement(BL)

  // vesica pisces
  // const CUw = Circle( P0, P1 );

  // const CUe = Circle( P1, P0 );


  //
  // // //bisector
  // Line( points[4], points[5] );

  // unit 2 circles from starting points
  // Circle( P0, points[3] );
  // Circle( P1, points[2] );


  logSummary();

  DrawTL.play();

  checkAllSegments();

  //animateGoldenSegments();

}


$( document ).ready(function() {
    console.log( "ready!" );
    main();
});
