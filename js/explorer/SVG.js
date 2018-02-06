// connect to SVG element
var D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

// radius for point icon
const PTRAD = .025;
// for variable width stroke on segments in proportion to the line length
const STROKEFACTOR = 20;


//use groups as layers to keep points on top and selectable
var groupCircles = D.group().attr({ id: "Circles" });
var groupLines = D.group().attr({ id: "Lines" });
var groupSegments = D.group().attr({ id: "Segments" });
var groupPoints = D.group().attr({ id: "Points"  });

let boundaryLines = []

function configureBoundaryLines(tlPt, brPt) {

  let trPt = new Point(brPt.x, tlPt.y)
  let blPt = new Point(tlPt.x, brPt.y)

  let lineN = new Line(tlPt, trPt)
  boundaryLines.push(lineN)

  let lineS = new Line(blPt, brPt)
  boundaryLines.push(lineS)

  let lineW = new Line(tlPt, blPt)
  boundaryLines.push(lineN)

  let lineE = new Line(trPt, brPt)
  boundaryLines.push(lineN)


}


//pass in line coefficients to find endpoints at viewbox
function getLineEndPts(line) {
  //get bounds to margin for the line
  // var box = D.viewbox()
  // var bx1 = box.x
  // var by1 = box.y
  // var bx2 = box.x + box.width
  // var by2 = box.y + box.height

  var endPts = []

  // check where line intersects they boundary lines
  boundaryLines.forEach( bline => {

    let sys = new System(line, bline)

    // if intersect - ask bline if point is between defining points
    if (sys.roots) {
      sys.roots.forEach(point => {
        var bl01 = bline.point[0].distanceTo(bline.point[1])
        var bl0p = bline.point[0].distanceTo(point)
        var bl1p = bline.point[1].distanceTo(point)

        let result = alglog(`(bl01) = (bl0p) + (bl1p)`)
        if (result == "1") {
          endPts.push(point)
        }
      })
    }
  })

  return endPts


}
