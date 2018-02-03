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


//pass in line coefficients to find endpoints at viewbox
function getViewboxIntersection(line) {
  //get bounds to margin for the line
  var box = D.viewbox();
  var bx1 = box.x;
  var by1 = box.y;
  var bx2 = box.x + box.width;
  var by2 = box.y + box.height;

  var x1, x2, y1, y2;

  //if vertical flip the calls around and override
  if (line.xRoot) {
    x1 = getNumber(line.getX(by1));
    if (!isNaN(x1)) {
      y1 = by1;
    } else {
      //vertical line
      x1 = bx1;
      y1 = getNumber(line.getY(bx1));
    }

    var x2 = getNumber(line.getX(by2));
    if (!isNaN(x2)) {
      y2 = by2;
    } else {
      //vertical line
      x2 = bx2;
      y2 = getNumber(line.getY(bx1));
    }
  } else {
    y1 = getNumber(line.getY(bx1));
    if (!isNaN(y1)) {
      x1 = bx1;
    } else {
      //vertical line
      y1 = by1;
      x1 = getNumber(line.getX(by1));
    }

    var y2 = getNumber(line.getY(bx2));
    if (!isNaN(y2)) {
      x2 = bx2;
    } else {
      //vertical line
      y2 = by2;
      x2 = getNumber(line.getX(by1));
    }
  }
  return [x1, y1, x2, y2];
}
