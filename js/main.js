//

function main() {
  log('---------------------')

  let tlPt, brPt
  tlPt = new Point("-4", "-4")
  brPt = new Point("4", "4")
  configureBoundaryLines(tlPt, brPt)


  //initial points set by X Y
  const P0 = new Point( "-1/2", "0" )
  //sequence the animations here.
  P0.render()
  points.push( P0 )

  const P1 = new Point( "1/2", "0" )
  P1.render()
  points.push( P1 )

  //baseline
  const BL = new Line( P0, P1 )
  BL.render()
  elements.push( BL )

  // vesica pisces
  // const Uw = Circle( P0, P1 );


  // const Uw = Circle( P1, P0 );


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
