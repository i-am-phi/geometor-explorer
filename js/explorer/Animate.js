/**
 * animation timeline for the primary Drawing of the Model
 * @global
 */
var TL_DRAW = new TimelineLite({paused: true});
/**
 * animation timeline for the sequential display of golden sections in the Model
 * @global
 */
var TL_GOLDEN = new TimelineLite({paused: true});
/**
 * value for opacity when muting elements in drawing
 * @global
 */
const MUTEOPACITY = .3;


export function animateGoldenSegments(){
  var allSegments = '.Segment';
  TL_GOLDEN.to(allSegments, 2, {strokeOpacity:0})

  var allMarkers = 'marker';
  TL_GOLDEN.to(allMarkers, 2, {strokeOpacity:0})

  var allElements = ('.Line, .Circle');
  TL_GOLDEN.to(allElements, 2, {strokeOpacity: MUTEOPACITY}, "-=2")

  var allPoints = '.Point';
  TL_GOLDEN.to(allPoints, 2, {fillOpacity: MUTEOPACITY}, "-=4")

  var j=0;

  golden.forEach( function(segPair) {
    console.group("golden pair", j++)
    // pause before starting
    // TL_GOLDEN.to(allElements, 1, {strokeOpacity:MUTEOPACITY}, "-=1")
    var ancestors = [];
    var segPoints = [];

    segPair.forEach( function(segment) {
      segPoints[segment.points[0].id] = segment.points[0];
      segPoints[segment.points[1].id] = segment.points[1];
    })

    console.dir(segPair);
    console.dir(segPoints);

    // segPoints.forEach( function(point)  {
    //   getPointAncestors(point, this);
    // }, ancestors)

    for ( point in segPoints ) {
      getPointAncestors(segPoints[point], ancestors);
    }

    console.group("ancestors");
    console.dir(ancestors);

    ancestors.forEach( function(element) {
      var id;
      if ( element.type === "line" ) {
        id = "#i" + element.id
      }
      if ( element.type === "circle" ) {
        id = "#c" + element.id
      }
      if (id) {
        console.log(id + "\n")
        TL_GOLDEN.to(id, .5, {strokeOpacity:1, fillOpacity: .05}, "-=.4")
      }
    })

    segPoints.forEach( function(point) {
      TL_GOLDEN.to("#p" + point.id, .5, {fillOpacity: 1}, "-=.25")
    })

    TL_GOLDEN.to(segPair[0].markerStart, .5, {strokeOpacity:1}, "+=0")
      .to(segPair[0].markerEnd, .5, {strokeOpacity:1}, "-=.25")
      .to(segPair[1].markerStart, .5, {strokeOpacity:1}, "+=0")
      .to(segPair[1].markerEnd, .5, {strokeOpacity:1}, "-=.25")

    TL_GOLDEN.to("#s" + segPair[0].id, .5, {strokeOpacity:1}, "+=0")
      .to("#s" + segPair[1].id, .5, {strokeOpacity:1}, "-=.25")
    // pause on completed image
    TL_GOLDEN.to("#s" + segPair[0].id, .5, {strokeOpacity:0}, "+=3.0")
      .to("#s" + segPair[1].id, .5, {strokeOpacity:0}, "-=.25")

    TL_GOLDEN.to(segPair[1].markerStart, .5, {strokeOpacity:0}, "-=.5")
      .to(segPair[1].markerEnd, .5, {strokeOpacity:0}, "-=.25")
      .to(segPair[0].markerStart, .5, {strokeOpacity:0}, "+=0")
      .to(segPair[0].markerEnd, .5, {strokeOpacity:0}, "-=.25")

    segPoints.forEach( function(point) {
      TL_GOLDEN.to("#p" + point.id, .5, {fillOpacity: MUTEOPACITY}, "-=.25")
    })

    // unwind the ancestors
    console.log("reverse");

    ancestors.reverse().forEach( function(element) {
      var id;
      if ( element.type === "line" ) {
        id = "#i" + element.id
      }
      if ( element.type === "circle" ) {
        id = "#c" + element.id
      }
      if (id) {
        console.log(id + "\n")
        TL_GOLDEN.to(id, .5, {strokeOpacity:MUTEOPACITY, fillOpacity: 0}, "-=.4")
      }
    })
    console.groupEnd();

    // pause between
    TL_GOLDEN.to(allElements, 1, {strokeOpacity:MUTEOPACITY}, "+=0")
    console.groupEnd();
  });
  TL_GOLDEN.to(allElements, 2, {strokeOpacity:1})
  TL_GOLDEN.to(allPoints, 2, {fillOpacity:1}, "-=2")

  TL_GOLDEN.to(allSegments, 2, {strokeOpacity:.3}, "-=2")
  TL_GOLDEN.to(allMarkers, 0, {strokeOpacity:.3})

  TL_GOLDEN.play();
}


export function setPoint(id, position) {
  TL_DRAW.fromTo(
    id,
    .5, {
      autoAlpha: 0,
      scale: 10,
      transformOrigin: "50% 50%",
    }, {
      autoAlpha: 1,
      scale: 1,
    },
    position
  );
}

export function setLine(id) {
  TL_DRAW.fromTo(
    id,
    .5,
    {
      autoAlpha: 1,
      scale: 0,
      transformOrigin: "50% 50%",
    },
    {
      autoAlpha: 1,
      scale: 1,
      transformOrigin: "50% 50%",
    }
  );
}

export function setSegment(segment) {
  //TODO:
  var query = "#s" + segment.id;
  query += ", " + segment.markerStart;
  query += ", " + segment.markerEnd;


  TL_DRAW.fromTo(
    query,
    .5,
    {
      autoAlpha: 1,
      scale: 0,
      strokeOpacity: 1,
      transformOrigin: "50% 50%",
    },
    {
      autoAlpha: 1,
      scale: 1,
      strokeOpacity: 1,
      transformOrigin: "50% 50%",
    }
  )
    .to(
      query,
      .5,
      {
        strokeOpacity: MUTEOPACITY,
      }
    )
}



// functions from earlier prototype

export function strokeLine(id) {
  var element = document.querySelector(id);
  var len = Math.floor( element.getTotalLength() );

  TL_DRAW.fromTo(
    element,
    .5, {
      scale: 1,
      autoAlpha: 0,
      strokeDasharray: len + " " + len,
      strokeDashoffset: len + 1,
      transformOrigin: "50% 50%",
    }, {
      scale: 1,
      autoAlpha: 1,
      strokeDasharray: len + " " + len,
      strokeDashoffset: 0,
      transformOrigin: "50% 50%",
    }
  );
}

export function unStrokeLine(id) {
  var element = document.querySelector(id);
  var len = Math.floor( element.getTotalLength() );

  TL_DRAW.fromTo(
    id,
    1, {
      scale: 1,
      autoAlpha: 1,
      strokeDasharray: len + " " + len,
      strokeDashoffset: 0,
      transformOrigin: "50% 50%",
    }, {
      scale: 1,
      autoAlpha: 0,
      strokeDasharray: len + " " + len,
      strokeDashoffset: len + 1,
      transformOrigin: "50% 50%",
    }
  );
}

export function strokeLineReverse(id) {
  var element = document.querySelector(id);
  var len = Math.floor( element.getTotalLength() );

  TL_DRAW.fromTo(
    id,
    .5, {
      scale: 1,
      autoAlpha: 1,
      strokeDasharray: len + " " + len,
      strokeDashoffset: -len + 1,
      transformOrigin: "50% 50%",
    }, {
      scale: 1,
      autoAlpha: 1,
      strokeDasharray: len + " " + len,
      strokeDashoffset: 0,
      transformOrigin: "50% 50%",
    }
  );
}

export function strokeLineCenter(id) {
  var element = document.querySelector(id);
  var len = Math.floor( element.getTotalLength() );

  TL_DRAW.fromTo(
    id,
    .5, {
      autoAlpha: 1,
      strokeDasharray: 1,
      strokeDashoffset: len / 2,
      transformOrigin: "50% 50%",
    }, {
      autoAlpha: 1,
      strokeDasharray: len,
      strokeDashoffset: 0,
      transformOrigin: "50% 50%",
    }
  );
}

export function setLines(id) {
  TL_DRAW.staggerFrom(
    id,
    .5, {
      scale: 0,
      transformOrigin: "50% 50%",
    }, .2
  );
}

export function setCircle(id) {
  TL_DRAW.fromTo(
    id,
    .5, {
      autoAlpha: 1,
      scale: 0,
      // fillOpacity: 1,
      transformOrigin: "50% 50%",
    }, {
      autoAlpha: 1,
      scale: 1,
      // fillOpacity: .1,
      transformOrigin: "50% 50%",
    }
  );
}

export function sweepRadius(circleId, radiusId) {
  var circle = document.querySelector(circleId);
  var len = Math.floor( circle.getTotalLength() );

  var cx = parseInt(circle.getBBox().x) + parseInt(circle.getBBox().width / 2);
  var cy = parseInt(circle.getBBox().y) + parseInt(circle.getBBox().height / 2);
  var center = cx + ' ' + cy;

  var timeOffset;

  // console.log(center);

  if (radiusId) {
    strokeLine(radiusId);
    TL_DRAW.to(radiusId, 1, {
      rotation: 360,
      svgOrigin: center
    });
    timeOffset = "-=1";
  }

  TL_DRAW.fromTo(
    circleId,
    1, {
      autoAlpha: 1,
      fillOpacity: 0,
      scale: 1,
      strokeDasharray: len + " " + len,
      strokeDashoffset: len
    }, {
      autoAlpha: 1,
      fillOpacity: .1,
      scale: 1,
      strokeWidth: 2,
      strokeDasharray: len + " " + len,
      strokeDashoffset: 0
    }, timeOffset
  );

  if (radiusId) {
    hideElements(radiusId);
    // unStrokeLine(radiusId);
  }
  TL_DRAW.to(circleId, .5, {
    strokeWidth: .5
  }, "-=1")
}

export function hideElements(id) {
  TL_DRAW.staggerTo(
    id,
    1, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: "50% 50%",
    }, .1
  );
}

//can take multiple items
export function zoomToElement(id, margin, scale) {
  var elements = document.querySelectorAll(id);
  var topX, topY, bottomX, bottomY;
  var start = true;
  //margin = 0;
  // console.log(elements);

  if (elements) {
    for (i = 0; i < elements.length; ++i) {
      // for (i in elements) {
      console.log("for: " + i + " : " + elements[i]);
      if (start) {
        start = false;

        // topX = parseInt(i.getBBox().x);
        topX = parseInt(elements[i].getBBox().x);
        topY = parseInt(elements[i].getBBox().y);
        bottomX = parseInt(elements[i].getBBox().width);
        bottomY = parseInt(elements[i].getBBox().height);
      } else {
        if (elements[i]) {
          var x = parseInt(elements[i].getBBox().x);
          var y = parseInt(elements[i].getBBox().y);
          var wd = parseInt(elements[i].getBBox().width);
          var ht = parseInt(elements[i].getBBox().height);

          console.log("element: " + i + " x: " + x + " y: " + y + " w: " + wd + " h: " + ht);
          if (x < topX) {
            topX = x;
          }
          if (y < topY) {
            topY = y;
          }
          if (x + wd > bottomX) {
            bottomX = x + wd;
          }
          if (y + ht > bottomY) {
            bottomY = y + ht;
          }
        }
      }
      console.log("bounds: " + i + " : " + topX + " " + topY + " " + bottomX + " " + bottomY);
    }
  }

  console.log(topX);
  console.log(topY);
  console.log(bottomX);
  console.log(bottomY);

  var viewBox = (topX - margin) + ' ' + (topY- margin) + ' ' + (bottomX-topX+(2*margin)) + ' ' + (bottomY- topY+(2*margin));
  console.log(viewBox);

  //scale lines and points with viewbox
  TL_DRAW.to("#drawing", 1, {
    attr: {
      viewBox: viewBox
    }
  })
    .to(".Segment", 1, {
      strokeWidth: 2
    }, "-=1")
    .to(".Point", 1, {
      attr: {
        r: 3
      }
    }, "-=1")
    .to(".Point.g", 1, {
      attr: {
        r: 3
      }
    }, "-=1");
}

export function dumpComputedStyles(id) {
  var styleList = [
    "visibility",
    "opacity",
    "stroke",
    "strokeWidth",
    "fill",
    "fillOpacity"
  ]

  var element = document.querySelector(id);

  var out = "";
  var elementStyle = element.style;
  var computedStyle = window.getComputedStyle(element, null);

  for (prop in styleList) {
    var propValue = computedStyle.getPropertyValue(styleList[prop]);
    // out += "  " + styleList[prop] + " = '" + propValue + "'\n";
    out += "  " + styleList[prop] + " = '" + getStyle(element, styleList[prop]) + "'\n";
  }

  // console.log("fill: " + document.defaultView.getComputedStyle(element, null).getPropertyValue("fill"));


  console.log(id + ": " + out)

  console.log("stroke: " + element.style.stroke)

  var len = 0; //cs.length;


  // console.log(style+" : "+ cs.getPropertyValue(style));
  //
  // for (var i=0;i<len;i++) {
  //
  //   var style = cs[i];
  //   console.log(style+" : "+cs.getPropertyValue(style));
  // }
  //
}

export function getStyle(oElm, strCssRule) {
  var strValue = "";
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
  } else if (oElm.currentStyle) {
    strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
      return p1.toUpperCase();
    });
    strValue = oElm.currentStyle[strCssRule];
  }
  return strValue;
}

export function animateLogo() {
  strokeLine(".logo.G");
  strokeLine(".logo.E");
  strokeLine(".logo.O");
  strokeLine(".logo.M");
  strokeLine(".logo.E2");
  strokeLine(".logo.T");
  strokeLine(".logo.O2");
  strokeLine(".logo.R");
}

// old function
export function hideAllElements() {
  // hide all elements
  TweenLite.set('.Point', {
    autoAlpha: 0,
  });
  TweenLite.set('.Line', {
    autoAlpha: 0,
  });
  TweenLite.set('.Circle', {
    autoAlpha: 0,
  });
  TweenLite.set('.Sector', {
    autoAlpha: 0,
  });
  TweenLite.set('.Segment', {
    autoAlpha: 0,
  });
  TweenLite.set('.y', {
    autoAlpha: 0,
  });
  TweenLite.set('.logo', {
    autoAlpha: 0,
  });
}
