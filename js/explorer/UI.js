//init panels
// var pointsPanel = document.getElementById('points');
// if ( !pointsPanel ) {
//   console.log('pointsPanel not found');
// }

var pointList = document.getElementById("pointList");
var elementList = document.getElementById("elementList");


var segmentsPanel = document.getElementById('segments');
if ( !segmentsPanel ) {
  console.log('segmentsPanel not found');
}

var infoPanel = document.getElementById('info');
if ( !infoPanel ) {
  console.log('infoPanel not found');
}

var footerPanel = document.getElementById('footer');
if ( !footerPanel ) {
  console.log('footerPanel not found');
}

function log (msg) {
  // segmentsPanel.innerHTML += msg + '\n';
  console.log(msg + '\n');
}

function logPoint (point) {
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
  addCellParam(row, element.eq.d, getNumber(element.eq.d))
  addCellParam(row, element.eq.e, getNumber(element.eq.e))
  addCellParam(row, element.eq.f, getNumber(element.eq.f))
  addCellParam(row, element.eq.a, getNumber(element.eq.a))
  addCellParam(row, element.eq.b, getNumber(element.eq.b))
  addCellParam(row, element.eq.c, getNumber(element.eq.c))
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
