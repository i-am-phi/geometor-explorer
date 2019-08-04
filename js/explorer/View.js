/**
 * a container for drawing and animating the SVG panel
 * and the other data panels of the UI
 * - sets up boundary lines for the drawing
 *
 * @class
 */
class View {

  constructor() {

    /** radius for point icon */
    this.PTRAD = .025
    /** for variable width stroke on segments in proportion to the line length */
    this.STROKEFACTOR = 20;

    /** SVG Drawing */
    this.D = SVG("drawing").panZoom({zoomMin: 50, zoomMax: 300, zoomFactor: 1.5});

    //////
    this.setBoundingBox()
    this.setElementGroups()
    this.configurePanels()

  }

  /** define the bounding box for lines in the drawing */
  setBoundingBox() {
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
    this.boundaryLines.push(lineW)

    let lineE = new Line(trPt, brPt)
    this.boundaryLines.push(lineE)

  }

  /** set up SVG groups for drawing */
  setElementGroups() {
    //use groups as layers to keep points on top and selectable
    this.groupPoints = this.D.group().attr({
      id: "Points"
    });
    this.groupCircles = this.D.group().attr({
      id: "Circles"
    });
    this.groupLines = this.D.group().attr({
      id: "Lines"
    });
    this.groupSegments = this.D.group().attr({
      id: "Segments"
    });

  }

  /** setup DOM elements for List Tables in Aside */
  configurePanels() {

    this.pointList = document.getElementById("pointList");
    this.structList = document.getElementById("structList");
    this.segmentList = document.getElementById("segmentList");


    this.footerPanel = document.getElementById('footer');
    if (!this.footerPanel) {
      console.log('footerPanel not found');
    }

  }

  /**
   * add a {@link Point} to the View<br>
   * SVG `circle` object representing the point location
   * radius of `circle` set by `this.PTRAD`
   * @function
   * @param {Point} newPoint
   * @returns {svgElement} `circle` object
   */
  addPoint(newPoint) {

    // DRAW ////////////////////////////////////////////////////////
    let element = this.drawPoint(newPoint)

    // ANIMATE ////////////////////////////////////////////////////////
    //add point to the animation timeline
    // setPoint("#p" + newPoint.id);

    // EVENTS ////////////////////////////////////////////////////////
    // set ui interactivity
    element.on('click', click);
    element.on('mouseover', hover);
    element.on('mouseout', hover);

    // SHOW ////////////////////////////////////////////////////////
    this.listPoint(newPoint)

    return element

  }

  /**
   * draw the {@link Point} into the Drawing using SVG.js
   * @function
   * @param {Point} newPoint
   * @returns {row} table row
   */
  drawPoint(newPoint) {

    let element = this.groupPoints.circle(this.PTRAD * 2).cx(newPoint.xVal).cy(newPoint.yVal)
      .addClass("Point")
      .attr({
        id: 'p' + newPoint.id,
        'point-id': newPoint.id,
        title: `[${newPoint.x}, ${newPoint.y}]`,
      });

    return element

  }

  /**
   * add a {@link Point} to the UI List
   * @function
   * @param {Point} newPoint
   * @returns {row} table row
   */
  listPoint(point) {

    var row = this.pointList.insertRow(-1);
    row.classList.add("Point")
    row.id = "L-" + point.id

    addCell(row, point.id)
    addCell(row, kat(point.x), point.xVal)
    addCell(row, kat(point.y), point.yVal)

    // log("Point " + point.id)

    return row

  }

  /**
   * add a {@link Struct} (Line or Circle) to the View<br>
   * SVG `circle` object representing the point location
   * radius of `circle` set by `this.PTRAD`
   * @function
   * @param {Point} newPoint
   * @returns {svgElement}
   */
  addStruct(newStruct) {

    // DRAW ////////////////////////////////////////////////////////
    let element = this.drawStruct(newStruct)

    // ANIMATE ////////////////////////////////////////////////////////
    //add point to the animation timeline
    // setPoint("#p" + newPoint.id);

    // EVENTS ////////////////////////////////////////////////////////
    // set ui interactivity
    element.on('click', click);
    element.on('mouseover', hover);
    element.on('mouseout', hover);

    // LIST ////////////////////////////////////////////////////////
    this.listStruct(newStruct)

    return element


  }

  /**
   * draw the {@link Struct} into the Drawing using SVG.js
   * @function
   * @param {Struct} newStruct
   * @returns {svgElement} table row
   */
  drawStruct(newStruct) {

    if (newStruct instanceof Line) {
      return this.drawLine(newStruct)
    }
    if (newStruct instanceof Circle) {
      return this.drawCircle(newStruct)
    }

  }

  /**
   * add a {@link Struct} to the Structures UI List
   * @function
   * @param {Struct} newPoint
   * @returns {row} table row
   */

  listStruct(newStruct) {
    // var item = line.id + `  [${line.points[0].id}, ${line.points[1].id}] ${line.eq} = 0 \n`;
    // linesPanel.innerHTML += item;
    // console.log(item);

    var row = this.structList.insertRow(-1);
    row.classList.add(newStruct.type)

    addCell(row, newStruct.id)
    if (newStruct instanceof Line) {
      addCell(row, "/", "line")
    }
    if (newStruct instanceof Circle) {
      addCell(row, "⨀", "circle")
    }

    let p = newStruct.eq.params

    addCellParam(row, p['d'], parseFloat(p['d']))
    addCellParam(row, p['e'], parseFloat(p['e']))
    addCellParam(row, p['f'], parseFloat(p['f']))
    addCellParam(row, p['a'], parseFloat(p['a']))
    addCellParam(row, p['b'], parseFloat(p['b']))
    addCellParam(row, p['c'], parseFloat(p['c']))
  }


  drawLine(newLine) {
    let svgStruct

    //////////////////////////////////////////////
    // draw line to edge of the viewbox
    var endPts = this.getLineEndPts(newLine);

    if (endPts) {
      let x0 = endPts[0].xVal
      let y0 = endPts[0].yVal
      let x1 = endPts[1].xVal
      let y1 = endPts[1].yVal

      //create SVG svgStruct
      svgStruct = this.groupLines.line(x0, y0, x1, y1)
        .addClass("Line")
        .attr({
          id: "i" + newLine.id,
          'svgStruct-id': newLine.id
        });

      // setLine("#i" + newLine.id);

      // set UI hover and click
      svgStruct.on('click', click);
      svgStruct.on('mouseover', hover);
      svgStruct.on('mouseout', hover);

    }

    return svgStruct

  }

  //pass in line coefficients to find endpoints at viewbox
  getLineEndPts(line) {

    var endPts = []

    // check where line intersects each boundary lines
    this.boundaryLines.forEach( bline => {

      let sys = new System(line, bline)

      // if intersect - ask bline if point is between defining points
      if (sys.points[0]) {

            endPts.push(sys.points[0])

      }
    })

    return endPts

  }

  drawCircle(newCircle) {

    ////////////////////////////////////////////////////////
    var cx = newCircle.center.xVal;
    var cy = newCircle.center.yVal;
    var r = parseFloat(newCircle.r);

    //TODO: why does the radius need to be multiplied by 2??
    let svgStruct = this.groupCircles.circle(r * 2)
      .center(cx, cy)
      .addClass("Circle")
      .attr({
        'id': `c${this.id}`,
        'element-id': this.id
      });

    //TODO: rotate circle to align start point with Radius

    //UI interactvity
    svgStruct.on('click', click);
    svgStruct.on('mouseover', hover);
    svgStruct.on('mouseout', hover);

    return svgStruct

  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class





function addSegmentToView(segment) {

  var p1x = segment.points[0].xVal;
  var p1y = segment.points[0].yVal;
  var p2x = segment.points[1].xVal;
  var p2y = segment.points[1].yVal;

  var strokeWidth = segment.lengthVal / STROKEFACTOR;
  var dashOffset = strokeWidth;
  var dashLength = segment.lengthVal - (dashOffset * 2);

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
      add.circle(2).center(2, 2)
    })
    .marker('end', 4, 4, function(add) {
      add.circle(2).center(2, 2)
    })

  segment.markerStart = segment.element.attr('marker-start').replace("url(", "").replace(")", "")
  segment.markerEnd = segment.element.attr('marker-end').replace("url(", "").replace(")", "")

  setSegment(segment);

  segment.element.on('click', click);
  segment.element.on('mouseover', hover);
  segment.element.on('mouseout', hover);

  return segment.element

}


function renderCircle() {
  ////////////////////////////////////////////////////////
  //TODO: whay does the radius need to be multiplied by 2??
  var cx = parseFloat(cpt.x);
  var cy = parseFloat(cpt.y);
  var r = parseFloat(this.r);

  this.element = groupCircles.circle(r * 2)
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



function log(msg) {
  // segmentsPanel.innerHTML += msg + '\n';
  console.log(msg + '\n');
}


function kat(str) {

  let latex = A.run(`printlatex(${str})`);
  return katex.renderToString(latex);

}


function logSegments(str) {
  //  var item = circle.id + `  ( ${circle.h}, ${circle.k} )\t${circle.r}\t${circle.eq} = 0 \n`;
  segmentsPanel.innerHTML += str;
  // console.log(str);
}

function footer(msg) {
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


function getViewBox() {
  //get bounds to margin for the line
  // var box = this.D.viewbox()
  // var bx1 = box.x
  // var by1 = box.y
  // var bx2 = box.x + box.width
  // var by2 = box.y + box.height

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

    var id = this.attr('point-id');
    element = M.points[id];
    latex = A.run(`printlatex([ ${element.x}, ${element.y} ])`)

  }

  if (this.hasClass("Circle")) {
    var id = this.attr('-id');
    element = M.structs[id];
    latex = A.run(`printlatex(${element.eq})`) + " = 0"
  }


  if (this.hasClass("Line")) {
    var id = this.attr('id');
    element = M.structs[id];
    latex = "0 = " + A.run(`printlatex(${element.eq})`);
  }

  if (this.hasClass("Segment")) {

    var id = this.attr('segment-id');
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
