/**
 * View - a container for drawing and animating the SVG panel
 * and the other data panels of the UI
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 */
function View() {

  // connect to SVG element
  var D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

  this.boundaryLines = []

  // TODO; set these values in main
  let tlPt, brPt
  tlPt = new Point("-4", "-4")
  brPt = new Point("4", "4")

  this.configureBoundaryLines = configureBoundaryLines
  this.configureBoundaryLines(tlPt, brPt)





  // radius for point icon
  const PTRAD = .025;
  // for variable width stroke on segments in proportion to the line length
  const STROKEFACTOR = 20;


  //use groups as layers to keep points on top and selectable
  this.groupPoints = D.group().attr({ id: "Points"  });
  this.groupCircles = D.group().attr({ id: "Circles" });
  this.groupLines = D.group().attr({ id: "Lines" });
  this.groupSegments = D.group().attr({ id: "Segments" });

  /**
  * add a {@link Point} to the View<br>
  * @function
  * @param {Point} newPoint
  * @returns {svgElement}
  */
  this.addPoint = addPointToView

}

function configurePanels() {
  this.pointList = document.getElementById("pointList");
  this.elementList = document.getElementById("elementList");
  this.segmentList = document.getElementById("segmentList");


  this.infoPanel = document.getElementById('info');
  if ( !infoPanel ) {
    console.log('infoPanel not found');
  }

  this.footerPanel = document.getElementById('footer');
  if ( !footerPanel ) {
    console.log('footerPanel not found');
  }


}

function configureBoundaryLines(tlPt, brPt) {

  let trPt = new Point(brPt.x, tlPt.y)
  let blPt = new Point(tlPt.x, brPt.y)

  let lineN = new Line(tlPt, trPt)
  this.boundaryLines.push(lineN)

  let lineS = new Line(blPt, brPt)
  this.boundaryLines.push(lineS)

  let lineW = new Line(tlPt, blPt)
  this.boundaryLines.push(lineN)

  let lineE = new Line(trPt, brPt)
  this.boundaryLines.push(lineN)


}

function addPointToView(newPoint) {

  //draw into SVG panel
  newPoint.element = this.groupPoints.circle(this.PTRAD * 2).cx(newPoint.xVal).cy(newPoint.yVal)
    .addClass("Point")
    .attr({
      id: 'p' + newPoint.id,
      'point-id': newPoint.id,
      title: `[${newPoint.x}, ${newPoint.y}]`,
    });

  //add point to the animation timeline
  setPoint("#p" + newPoint.id);

  // set ui interactivity
  newPoint.element.on('click', click);
  newPoint.element.on('mouseover', hover);
  newPoint.element.on('mouseout', hover);

  return newPoint.element

}

function addSegmentToView(segment) {

  var p1x = segment.points[0].xVal;
  var p1y = segment.points[0].yVal;
  var p2x = segment.points[1].xVal;
  var p2y = segment.points[1].yVal;

  var strokeWidth = segment.lengthVal / STROKEFACTOR;
  var dashOffset = strokeWidth;
  var dashLength =  segment.lengthVal - (dashOffset * 2);

  segment.element = this.groupSegments.line(p1x, p1y, p2x, p2y)
    .addClass("Segment")
    .attr({
      id: "s" + segment.id,
      'segment-id': segment.id,
      'stroke-width': strokeWidth,
      'stroke-dashoffset': -dashOffset,
      'stroke-dasharray': dashLength + " " + dashOffset,

    })
    .marker('start', 4, 4, function(add) {
      add.circle(2).center(2,2)
    })
    .marker('end', 4, 4, function(add) {
      add.circle(2).center(2,2)
    })

  segment.markerStart = segment.element.attr('marker-start').replace("url(", "").replace(")", "")
  segment.markerEnd = segment.element.attr('marker-end').replace("url(", "").replace(")", "")

  setSegment(segment);

  segment.element.on('click', click);
  segment.element.on('mouseover', hover);
  segment.element.on('mouseout', hover);

  return segment.element

}


function renderLine() {

  //////////////////////////////////////////////
  // draw line to edge of the viewbox
  var endPts = getLineEndPts(this);

  if (endPts) {
    let x0 = getNumber( endPts[0].x )
    let y0 = getNumber( endPts[0].y )
    let x1 = getNumber( endPts[1].x )
    let y1 = getNumber( endPts[1].y )

    //create SVG element
    this.element = groupLines.line( x0, y0, x1, y1 )
      .addClass("Line")
      .attr({
        id: "i" + this.id,
        'element-id': this.id
      })
      ;

    setLine("#i" + this.id);

    // set UI hover and click
    this.element.on('click', click);
    this.element.on('mouseover', hover);
    this.element.on('mouseout', hover);
  }

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

function getViewBox() {
  //get bounds to margin for the line
  // var box = D.viewbox()
  // var bx1 = box.x
  // var by1 = box.y
  // var bx2 = box.x + box.width
  // var by2 = box.y + box.height

}


function renderCircle() {
  ////////////////////////////////////////////////////////
  //TODO: whay does the radius need to be multiplied by 2??
  var cx = getNumber( cpt.x );
  var cy = getNumber( cpt.y );
  var r = getNumber( this.r );

  this.element = groupCircles.circle( r * 2 )
    .cx(cx)
    .cy(cy)
    .addClass("Circle")
    .attr({
      'id': `c${this.id}`,
      'element-id': this.id
      });

  setCircle("#c" + this.id);

  //TODO: rotate circle to align start point with Radius

  //UI interactvity
  this.element.on('click', click);
  this.element.on('mouseover', hover);
  this.element.on('mouseout', hover);


}



function log (msg) {
  // segmentsPanel.innerHTML += msg + '\n';
  console.log(msg + '\n');
}

function addPointToPanel (point) {
  // Create an empty <tr> element and add it to the 1st position of the table:
  var row = pointList.insertRow(-1);
  row.classList.add("point")


  addCell(row, point.id)
  addCell(row, kat(point.x), point.xVal)
  addCell(row, kat(point.y), point.yVal)

}

function kat(str) {
  let latex =  alg(`printlatex(${str})`);
  return katex.renderToString(latex);
}

function addCell(row, html, title) {
  let cell = row.insertCell(-1);
  cell.innerHTML = html
  if (title) cell.setAttribute('title', title);
}

function logElement (element) {
  // var item = line.id + `  [${line.points[0].id}, ${line.points[1].id}] ${line.eq} = 0 \n`;
  // linesPanel.innerHTML += item;
  // console.log(item);

  var row = elementList.insertRow(-1);
  row.classList.add(element.type)

  addCell(row, element.id)
  if (element.type == "line") {addCell(row, "/", "line")}
  if (element.type == "circle") {addCell(row, "⨀", "circle")}

  let p = element.eq.params

  addCellParam(row, p['d'], getNumber(p['d']))
  addCellParam(row, p['e'], getNumber(p['e']))
  addCellParam(row, p['f'], getNumber(p['f']))
  addCellParam(row, p['a'], getNumber(p['a']))
  addCellParam(row, p['b'], getNumber(p['b']))
  addCellParam(row, p['c'], getNumber(p['c']))
}

function addCellParam(row, html, title) {
  cell = row.insertCell(-1);
  if (html != 0) {
    cell.innerHTML = kat(html)
  }
  if (title) cell.setAttribute('title', title);

}

function logSegments (str) {
  //  var item = circle.id + `  ( ${circle.h}, ${circle.k} )\t${circle.r}\t${circle.eq} = 0 \n`;
  segmentsPanel.innerHTML += str;
  // console.log(str);
}

function footer (msg) {
  footerPanel.innerHTML += msg + '\n';
  console.log(msg + '\n');
}

function logSummary() {
  log("--------------------------");
  log("summary");
  log("");
  log("points: " + points.length);
  log("elements: " + elements.length);

}




///////////////////////////////////////
// Event Handlers

var click = function() {
  this.toggleClass('click');
  log("click");
}

//us hover event
var hover = function() {

  this.toggleClass('hover');

  var element;
  var latex;

  if (this.hasClass("Point")) {
    var id = this.attr( 'point-id' );
    element = points[id];
    latex = alg(`printlatex([ ${element.x}, ${element.y} ])`)
  }

  if (this.hasClass("Circle")) {
    var id = this.attr( 'element-id' );
    element = elements[id];
    latex = alg(`printlatex(${element.eq})`) + " = 0"
  }


  if (this.hasClass("Line")) {
    var id = this.attr( 'element-id');
    element = elements[id];
    latex = "0 = " + alg(`printlatex(${element.eq})`);
  }

  if (this.hasClass("Segment")) {


    var id = this.attr( 'segment-id' );
    element = segments[id];

    $(element.markerStart).toggleClass('hover');
    $(element.markerEnd).toggleClass('hover');

    latex = alg(`printlatex([ ${element.length} ])`)
  }

  // log(info);
  infoPanel.innerHTML = element;
  footerPanel.innerHTML = element.type + " " + element.id + ":  " + katex.renderToString(latex);

  // log(info);

  // log("hover: " + this.hasClass('hover'));
}
