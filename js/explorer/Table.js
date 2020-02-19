import * as A from './Algebra.js'
// constructs for displaying data

export function TableProperty( caption ) {
  var domTable

  this.addRow = function(label, val) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    let row = pointList.insertRow(-1);
    row.classList.add("point")

    addCell(row, point.id)
    addCell(row, A.kat(point.x), point.xVal)
    addCell(row, A.kat(point.y), point.yVal)
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class

export function addCell(row, html, title) {
  let cell = row.insertCell(-1);
  cell.innerHTML = html
  if (title) cell.setAttribute('title', title);
}

export function addCellParam(row, html, title) {
  let cell = row.insertCell(-1);
  if (html != 0) {
    cell.innerHTML = A.kat(html)
  }
  if (title) cell.setAttribute('title', title);
}
