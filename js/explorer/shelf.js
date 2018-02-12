// //check number of variables in eq0
// this.history.push("eq0 has var count:" + eq0.vars.length)
// if (eq0.vars.length == 1) {
//
// if (eq1.vars.length == 2) {
//
//
//
//   }
//
//   if (eq0.vars[0] == 'x') {
//     // eq0 xRoots are the values for x
//     eq0.xRoots.forEach( x => {
//
//       if (eq1.hasY) {
//
//       }
//
//     })
//   }
//
//
// } else if (eq0.vars.length == 2) {
//
// } else {
//   //unable to process eq0
// }
//
// return points
//
//
//
//
//
//
//
//
//
//
// if (eq0.dim == 2) {
//   this.history.push("eq0 has dimension: " + eq0.dim)
//
//   if (eq1.dim == 2) {
//     this.history.push("eq1 has dimension: " + eq1.dim)
//     //a circular proportion - or conic
//
//     this.history.push("clone eq0 to form eq3")
//     let eq3 = eq0.clone()
//     this.history.push(eq3.general)
//
//     //  subtract to eliminate the squared terms
//     this.history.push("multiply eq3 by -1")
//     eq3.multiply("-1")
//     this.history.push(eq3.general)
//
//     this.history.push("add eq1 to eq3")
//     eq3.add(e2)
//     this.history.push(eq3.general)
//
//     this.history.push("eq3 has dimension:" + eq3.dim)
//
//     if (eq3.dim == 1 ) {
//
//       if (eq3.hasX) {
//
//         // substitue eq3 xroot into eq0
//         this.history.push("eq3 has x:" + eq3.xRoot)
//
//         this.history.push("get eq3 xRoots")
//
//         eq3.xRoots.forEach( root => {
//
//           this.history.push("get eq0 y for eq3 xRoot: " + root)
//
//           eq0.getYRootsforX(root).forEach( y => {
//
//             this.history.push("y = " + y)
//
//             eq0.getXRootsforY(y).forEach( x => {
//
//               this.history.push("x = " + x)
//               this.roots.push( new Point(x, y, struct1, struct2) )
//               this.history.push("new point set in this.roots")
//
//             })
//           })
//         })
//
//       } else if (eq3.hasY) {
//
//         this.history.push("eq3 has y:" + eq3.yRoot)
//         this.history.push("get eq0 x for each eq3 yRoots")
//
//         eq3.yRoots.forEach( root => {
//
//           this.history.push("get eq0 x for y of eq3: " + root)
//
//           eq0.getXRootsforY(root).forEach( x => {
//
//             this.history.push("x = " + x)
//
//             eq0.getYRootsforX(x).forEach( y => {
//
//               this.history.push("y = " + y)
//               this.roots.push( new Point(x, y, struct1, struct2) )
//               this.history.push("new point set in this.roots")
//
//             })
//           })
//         })
//       } else {
//         this.history.push("eq3 has no x or y")
//
//       }
//
//     } else {
//       // something wrong
//       this.history.push("*** something is horribly wrong")
//
//     }
//
//   } else if (eq1.dim == 1) {
//
//     if (eq1.hasX) {
//       this.history.push("eq1 has 2 dimensions")
//       let eq3 = eq0.clone()
//       eq0.getYforX(eq1.xRoot)
//
//     }
//
//
//   }
// } else if (eq0.dim == 1) {
//   this.history.push("eq0 has dimension: " + eq0.dim)
//
//   if (eq0.hasX) {
//     //not a horizontal line
//     this.history.push("eq0 has x")
//
//     //subsitute
//     eq0.xRoots.forEach( eq0xRoot => {
//
//       this.history.push("xRoot of eq0: " + eq0xRoot)
//
//       if (eq1.hasX) {
//         this.history.push("eq1 has x")
//
//         if (eq1.hasY) {
//           this.history.push("eq1 has y")
//
//           eq1.getYRootsforX( eq0xRoot ).forEach( y => {
//             this.history.push("substitute eq0xRoot into eq1 x to get y")
//
//             this.history.push("y = " + y)
//
//             eq1.getXRootsforY( y ).forEach( x => {
//               this.history.push("substitute eq1 y into eq1 to get x")
//
//               this.history.push("x = " + x)
//               this.roots.push( new Point(x, y, struct1, struct2) )
//               this.history.push(`new point set [ ${x}, ${y} ]`)
//
//             })
//           })
//         } else {
//           this.history.push("eq1 has NO y")
//
//           this.history.push("using eq0xRoot for x")
//           let x = eq0xRoot
//           this.history.push("x = " + x)
//           this.roots.push( new Point(x, y, struct1, struct2) )
//           this.history.push(`new point set [ ${x}, ${y} ]`)
//         }
//       } else {
//         this.history.push("eq1 has NO x")
//
//         //y root is the solution
//         this.history.push("use yRoot of eq1 for value of y")
//
//         eq1.yRoots.forEach( y => {
//
//           this.history.push("y = " + y)
//
//           if (eq0.hasY) {
//             eq0.getXRootsforY(y).forEach( x => {
//               this.history.push("substitute eq1 y into eq0 y to get x")
//
//               this.history.push("x = " + x)
//               this.roots.push( new Point(x, y, struct1, struct2) )
//               this.history.push(`new point set [ ${x}, ${y} ]`)
//
//             })
//           } else {
//               this.history.push("using eq0xRoot for x")
//               let x = eq0xRoot
//               this.history.push("x = " + x)
//               this.roots.push( new Point(x, y, struct1, struct2) )
//               this.history.push(`new point set [ ${x}, ${y} ]`)
//
//           }
//         }) //eq1.yRoots.forEach
//       }
//     }) //eq0.xRoots.forEach
//
//   } else if (eq0.hasY) {
//     // not a vertical line
//     this.history.push("eq0 has y")
//
//     //subsitute
//     eq0.yRoots.forEach( root => {
//
//       this.history.push("get eq1 x for y of eq0: " + root)
//
//       eq1.getXRootsforY(root).forEach( x => {
//
//         this.history.push("x = " + x)
//
//         eq1.getYRootsforX(x).forEach( y => {
//
//           this.history.push("y = " + y)
//           this.roots.push( new Point(x, y, struct1, struct2) )
//           this.history.push(`new point set [ ${x}, ${y} ]`)
//
//         })
//       })
//     })
//
//
//   } else {
//     this.history.push("*** eq0 has no x or y")
//
//   }
//
// }
