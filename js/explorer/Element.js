/**
 * base class for the common properties of any entity of the {@link Model},
 * including {@link Point} and {@link Struct}

 * @author 𝚽 <phi@geometor.com>
 * @license MIT
 *
 * @class
 * @param {string} type - type of element - such as "Point" - like a class in CSS
 * @param {string} id - unique id for the element

 */
class Element {

  constructor(type, id) {

    /**
     * type for the element
     * - can be coordinated with css and for selecting groupings within the UI
     * @returns {string} default: "Element"
     */
    this.type = type || "Element"

    /**
     * id of the element - set by the context of the {@link Model}<br>
     * - usually the index in the elements array
     * - will be used to coordinate with UI elements in View
     * @returns {string}
     */
    this.id = id || ""

  }

  /**
  * grouped console output to represent the object<br>
  * perfect for logging
  * @function
  *
  * @returns {console}
  */
  log(){

    console.group( `${this.id} : ${this.type}` )
    log(this.toString());
    console.groupEnd();

  }

  /**
   * formatted string representing attribute of the object
   *
   * @function
   * @returns {string}
   */
  toString() {
    var str = `${this.id} : ${this.type}\n`
    for (var key in this){

      let label = " ".repeat(10-key.length) + key

      // list array items
      if (this[key] instanceof Array) {
        // label with count of items
        str += label + ' : ' + this[key].length + '\n'

        this[key].forEach( item => {
          label = " ".repeat(15-item.id.toString().length) + item.id
          str += `${label} : ${item.type}\n`
        })
      } else if (this[key] instanceof Equation) {

        str += label + ' : ' + this[key].toString() + '\n'
      } else {
        str += label + ' : ' + this[key] + '\n'
      }
    }

    return str;
  }



}
