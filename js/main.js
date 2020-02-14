//

function main() {
  log('---------------------')

  //initial points set by X Y
  Point( "-1/2", "0" );
  Point( "1/2", "0" );

  //baseline
  Line( points[0], points[1] );

  // vesica pisces
  Circle( points[0], points[1] );
  Circle( points[1], points[0] );

  // //bisector
  Line( points[4], points[5] );

  // unit 2 circles from starting points
  // Circle( points[0], points[3] );
  // Circle( points[1], points[2] );


  logSummary();

  DrawTL.play();

  checkAllSegments();

  //animateGoldenSegments();

}


$( document ).ready(function() {
    console.log( "ready!" );
    main();
});
