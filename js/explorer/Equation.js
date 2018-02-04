/////////////////////////////////
function Equation() {

  this.d = 0
  this.e = 0
  this.f = 0
  this.a = 0
  this.b = 0
  this.c = 0

  this.general = function () {
    return `(${d})x^2 + (${e})xy + (${f})y^2 + (${a})x + (${b})y + (${c})`
  }

  this.simple = function () {
    let str
    if (this.d != 0) str +=    `(${d})x^2`
    if (this.e != 0) str += ` + (${e})xy`
    if (this.f != 0) str += ` + (${f})y^2`
    if (this.a != 0) str += ` + (${a})x`
    if (this.b != 0) str += ` + (${b})y`
    if (this.c != 0) str += ` + (${c})`
    return str
  }

  this.render = function () {
    return katex.renderToString( this.simple() );
  }

  this.renderAlg = function () {
    let latex = alg(`printlatex([ ${ this.simple() } ])`)
    return katex.renderToString(latex);
  }

}

//////////////////////////////////////////////
function System(eq1, eq2) {

}
