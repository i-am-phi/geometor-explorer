/**
* Global instance of the {@link Model} object
* @const
*/
// const M = new Model()

/** SVG Drawing */
// const D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

/**
* Global instance of the {@link View} object
* @const
*/
// const V = new View()

/**
* Global instance of the {@link Explorer} object
* @const
*/
// const E = new Explorer();



/**
 * main.js - script to sequence the creating and display of the geometric model

 * primary interface for {@link main}
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @function
 */
function main() {


  console.time("* system test *");

  // let v = new Value("3^(1/2)")
  // v.log()
  // log(v.float)

  // let v2 = new Value("1/2")
  // let v3 = new Value("3^(1/2)")

  let sys
  let points = []
  let structs = []
  let systems = []
  //
  points.push( new Point("1/2", "0") )
  points.push( new Point("-1/2", "0") )
  //
  // //line with last two points
  // i = points.length-1
  // structs.push( new Line( points[i-1], points[i] ) )
  //
  // points.push( new Point("1", "2") )
  // points.push( new Point("-2", "-1") )
  //
  // //line with last two points
  // i = points.length-1
  // structs.push( new Line( points[i-1], points[i] ) )
  //
  //
  // i = structs.length-1
  //
  // sys = new System( structs[i-1], structs[i] )
  // console.dir(sys)

  log("----------- Circles")
  let C0 = new Circle( points[0], points[1] )
  console.dir(C0)

  let C1 = new Circle( points[1], points[0] )
  console.dir(C1)


  sys = new System( C0, C1 )
  console.dir(sys)

  let L0 = new Line( points[0], points[1] )
  console.dir(L0)

  sys = new System( L0, C1 )
  console.dir(sys)


  // testHVLineSet()

  // test2varLines()
  // textBook()




  console.timeEnd("* system test *");


  console.time("* main *");



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
