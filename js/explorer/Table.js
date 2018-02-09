// constructs for displaying data

function TableProperty( caption ) {
  var domTable

  this.addRow = function(label, val) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = pointList.insertRow(-1);
    row.classList.add("point")


    addCell(row, point.id)
    addCell(row, kat(point.x), point.xVal)
    addCell(row, kat(point.y), point.yVal)

  }
}

function addCell(row, html, title) {
  let cell = row.insertCell(-1);
  cell.innerHTML = html
  if (title) cell.setAttribute('title', title);
}

function addCellParam(row, html, title) {
  cell = row.insertCell(-1);
  if (html != 0) {
    cell.innerHTML = kat(html)
  }
  if (title) cell.setAttribute('title', title);

}
