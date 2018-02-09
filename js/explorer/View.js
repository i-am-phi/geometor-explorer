/**
 * a container for drawing and animating the SVG panel
 * and the other data panels of the UI
 * - sets up boundary lines for the drawing
 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @constructor
 */
function View() {

  /** radius for point icon */
  this.PTRAD = .025
  /** for variable width stroke on segments in proportion to the line length */
  this.STROKEFACTOR = 20;
  /** SVG Drawing */
  const D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

  /**
   * Array of `Line` objects defining the boundary of the Drawing<br>
   * - using these in `View.addLine` to determine the end points of {@link Line} in the {@link model}
   * - these lines are not added to the `Model.elements` array
   */
  this.boundaryLines = []

  // TODO; set these values in main

  // top left
  let tlPt = new Point("-4", "-4")
  // bottom right
  let brPt = new Point("4", "4")

  // top right
  let trPt = new Point(brPt.x, tlPt.y)
  // bottom left
  let blPt = new Point(tlPt.x, brPt.y)

  let lineN = new Line(tlPt, trPt)
  this.boundaryLines.push(lineN)

  let lineS = new Line(blPt, brPt)
  this.boundaryLines.push(lineS)

  let lineW = new Line(tlPt, blPt)
  this.boundaryLines.push(lineN)

  let lineE = new Line(trPt, brPt)
  this.boundaryLines.push(lineN)


  //////

  this.configurePanels = configurePanels
  this.configurePanels()

  //use groups as layers to keep points on top and selectable
  this.groupPoints   = D.group().attr({ id: "Points"  });
  this.groupCircles  = D.group().attr({ id: "Circles" });
  this.groupLines    = D.group().attr({ id: "Lines" });
  this.groupSegments = D.group().attr({ id: "Segments" });

  /**
  * add a {@link Point} to the View<br>
  * SVG `circle` object representing the point location
  * radius of `circle` set by `this.PTRAD`
  * @function
  * @param {Point} newPoint
  * @returns {svgElement} `circle` object
  */
  this.addPoint = addPointToView
  this.addPoint = addPointToView

}

function configurePanels() {

  this.pointList = document.getElementById("pointList");
  this.elementList = document.getElementById("elementList");
  this.segmentList = document.getElementById("segmentList");

  this.infoPanel = document.getElementById('info');
  if ( !this.infoPanel ) {
    console.log('infoPanel not found');
  }

  this.footerPanel = document.getElementById('footer');
  if ( !this.footerPanel ) {
    console.log('footerPanel not found');
  }

  /**  create an entry in the table for a point */
  this.addPointToPanel = addPointToPanel

}

function configureBoundaryLines(tlPt, brPt) {


}

function addPointToView(newPoint) {

  //draw into SVG panel
  let element = this.groupPoints.circle(this.PTRAD * 2).cx(newPoint.xVal).cy(newPoint.yVal)
    .addClass("Point")
    .attr({
      id: 'p' + newPoint.id,
      'point-id': newPoint.id,
      title: `[${newPoint.x}, ${newPoint.y}]`,
    });

  //add point to the animation timeline
  // setPoint("#p" + newPoint.id);

  // set ui interactivity
  element.on('click', click);
  element.on('mouseover', hover);
  element.on('mouseout', hover);

  // this.addPointToPanel(newPoint)

  return element

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
    let x0 = parseFloat( endPts[0].x )
    let y0 = parseFloat( endPts[0].y )
    let x1 = parseFloat( endPts[1].x )
    let y1 = parseFloat( endPts[1].y )

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
  var cx = parseFloat( cpt.x );
  var cy = parseFloat( cpt.y );
  var r = parseFloat( this.r );

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
  let latex =  A.run(`printlatex(${str})`);
  return katex.renderToString(latex);
}


function addElementToPanel (element) {
  // var item = line.id + `  [${line.points[0].id}, ${line.points[1].id}] ${line.eq} = 0 \n`;
  // linesPanel.innerHTML += item;
  // console.log(item);

  var row = elementList.insertRow(-1);
  row.classList.add(element.type)

  addCell(row, element.id)
  if (element.type == "line") {addCell(row, "/", "line")}
  if (element.type == "circle") {addCell(row, "⨀", "circle")}

  let p = element.eq.params

  addCellParam(row, p['d'], parseFloat(p['d']))
  addCellParam(row, p['e'], parseFloat(p['e']))
  addCellParam(row, p['f'], parseFloat(p['f']))
  addCellParam(row, p['a'], parseFloat(p['a']))
  addCellParam(row, p['b'], parseFloat(p['b']))
  addCellParam(row, p['c'], parseFloat(p['c']))
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
    element = M.points[id];
    latex = A.run(`printlatex([ ${element.x}, ${element.y} ])`)

  }

  if (this.hasClass("Circle")) {
    var id = this.attr( 'element-id' );
    element = M.elements[id];
    latex = A.run(`printlatex(${element.eq})`) + " = 0"
  }


  if (this.hasClass("Line")) {
    var id = this.attr( 'element-id');
    element = M.elements[id];
    latex = "0 = " + A.run(`printlatex(${element.eq})`);
  }

  if (this.hasClass("Segment")) {


    var id = this.attr( 'segment-id' );
    element = M.segments[id];

    $(element.markerStart).toggleClass('hover');
    $(element.markerEnd).toggleClass('hover');

    latex = A.run(`printlatex([ ${element.length} ])`)
  }

  // log(info);
  // infoPanel.innerHTML = element;
  V.footerPanel.innerHTML = element.type + " " + element.id + ":  " + katex.renderToString(latex);

  // log(info);

  // log("hover: " + this.hasClass('hover'));
}
