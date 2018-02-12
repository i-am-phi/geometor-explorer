/**
 * represents a value within the {@link Model} - relative to the unit measure establish by the starting points <br>
 * - see {@link Point}

 * **TODO:** validation!!!!!! simplify?? make immutable!!!
 *
 * @class
 * @param {algValue} algValue - the algebraic expression of the value -s hould NOT contain variables
 * @param {string} id - unique id for the element
 */

class Value {
  constructor(algValue) {

    /** internal constant
    */
    this.alg = algValue
    /** the floating point expression of the value of the value
    * - shold contain variables
    */
    this.isValid = false

    let f = A.parseFloat(algValue)
    if (!isNaN(f)) {
      /** returns float if valid number */
      this.float = f
      this.isValid = true

    }

    if (this.isValid){
      /** latex string from Algebrite print latex when valid */
      this.latex = A.run( `printlatex(${this.alg})` )
      /** katex.renderToString(this.latex) */
      this.katex = katex.renderToString(this.latex)
    }


  }

  /** override toString() */
  toString() {
    return this.alg
  }

  /** override valueOf() */
  valueOf() {
    return this.float
  }

  log(){
    console.group("value: " + this.toString())

    let str = ""
    for (let key in this) {

      // pad the key as the label for right justify
      let label = " ".repeat(10 - key.length) + key

      if (this[key] instanceof Array) {
        // list array items
        // label with count of items
        str += label + ' : ' + this[key].length + '\n'

        this[key].forEach(item => {
          label = " ".repeat(15 - item.id.toString().length) + item.id
          str += `${label} : ${item.type}\n`
        })
      } else if (this[key] instanceof Equation) {
        // TODO: does this need to be here
        str += label + ' : ' + this[key].simple + '\n'
      } else {
        //default output
        str += label + ' : ' + this[key] + '\n'
      }
    }

    log(str)

    console.groupEnd()
  }

  /** @author 𝚽 <phi@geometor.com>
  * @license MIT
  */
} //class
