//init panels
var pointsPanel = document.getElementById('points');
if ( !pointsPanel ) {
  console.log('pointsPanel not found');
}

var linesPanel = document.getElementById('lines');
if ( !linesPanel ) {
  console.log('linesPanel not found');
}

var circlesPanel = document.getElementById('circles');
if ( !circlesPanel ) {
  console.log('circlesPanel not found');
}

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
  var item = point.id + `  ( ${point.x},\t${point.y} ) \n`;
  pointsPanel.innerHTML += item;
  // ÷=console.log(item);
}

function logLine (line) {
  var item = line.id + `  [${line.points[0].id}, ${line.points[1].id}] ${line.eq} = 0 \n`;
  linesPanel.innerHTML += item;
  // console.log(item);
}

function logCircle (circle) {
  var item = circle.id + `  ( ${circle.h}, ${circle.k} )\t${circle.r}\t${circle.eq} = 0 \n`;
  circlesPanel.innerHTML += item;
  // console.log(item);
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
