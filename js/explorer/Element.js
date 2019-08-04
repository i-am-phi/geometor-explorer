/**
 * represents the common properties and methods of any entity of the {@link Model}<br>
 * in homage to Euclid
 * - see subclass {@link Point}
 * - see subclass {@link Struct}
 *
 * @class
 * @param {string} type - optional: type of element - such as "Point" - like a class in CSS
 * @param {string} id - optional: unique id for the element
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

    /** will generally be set by extending class to create a unique identifier based on parameters */
    this.tag = ""

    /** a place to log the work
    @type {Array}*/
    this.history = []

  } //constructor

  /**
   * grouped console output to represent the object<br>
   * @function
   */
  log() {

    console.groupCollapsed(`${this.id} : ${this.type}`)
    console.dir(this)
    console.groupEnd()

  }

  /** log string to history */
  hlog(str) {
    this.history.push(str)
  }

  /**
   * formatted string representing properties of the object<br>
   * will list the items in member arrays like points or parents
   * TODO: resolve circular reference
   * @function
   * @returns {string}
   */
  toString() {

    let str = `${this.id} : ${this.type}\n`

    //iterate the properties of this object
    for (let key in this) {

      // pad the key as the label for right justify
      let label = " ".repeat(10 - key.length) + key

      /**
      // if (this[key] instanceof Array) {
      //   // list array items
      //   // label with count of items
      //   str += label + ' : ' + this[key].length + '\n'
      //
      //   this[key].forEach( item => {
      //     // label = " ".repeat(15 - item.id.toString().length) + item.id
      //     // str += `${label} : ${item.type}\n`
      //     str += `${item}\n`
      //   })
      // } else if (this[key] instanceof Equation) {
      //   // TODO: does this need to be here
      //   str += label + ' : ' + this[key].simple + '\n'
      // } else {
      //   //default output
      //   str += label + ' : ' + this[key] + '\n'
      // }
    }

    return str;
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
