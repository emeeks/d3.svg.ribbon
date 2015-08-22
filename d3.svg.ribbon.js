d3.svg.ribbon = function() {
	var _lineConstructor = d3.svg.line();
	var _xAccessor = function (d) {return d.x}
	var _yAccessor = function (d) {return d.y}
	var _rAccessor = function (d) {return d.r}
	var _interpolator = "linear-closed";

	function _ribbon(pathData) {

		var bothPoints = buildRibbon(pathData);

		return _lineConstructor.x(_xAccessor).y(_yAccessor).interpolate(_interpolator)(bothPoints);
	}

	_ribbon.x = function (_value) {
		if (!arguments.length) return _xAccessor;

		_xAccessor = _value;
		return _ribbon;
	}

	_ribbon.y = function (_value) {
		if (!arguments.length) return _yAccessor;

		_yAccessor = _value;
		return _ribbon;
	}

	_ribbon.r = function (_value) {
		if (!arguments.length) return _rAccessor;

		_rAccessor = _value;
		return _ribbon;
	}

	_ribbon.interpolate = function(_value) {
		if (!arguments.length) return _interpolator;

		_interpolator = _value;
		return _ribbon;
	}

return _ribbon;

function offsetEdge(d) {
  var diffX = _yAccessor(d.target) - _yAccessor(d.source);
  var diffY = _xAccessor(d.target) - _xAccessor(d.source);

  var angle0 = ( Math.atan2( diffY, diffX ) + ( Math.PI / 2 ) );
  var angle1 = angle0 + ( Math.PI * 0.5 );
  var angle2 = angle0 + ( Math.PI * 0.5 );

  var x1 = _xAccessor(d.source) + (_rAccessor(d.source) * Math.cos(angle1));
  var y1 = _yAccessor(d.source) - (_rAccessor(d.source) * Math.sin(angle1));
  var x2 = _xAccessor(d.target) + (_rAccessor(d.target) * Math.cos(angle2));
  var y2 = _yAccessor(d.target) - (_rAccessor(d.target) * Math.sin(angle2));

  return {x1: x1, y1: y1, x2: x2, y2: y2}
}

function buildRibbon(points) {
  var bothCode = [];
  var x = 0;
  var transformedPoints = {};

  while (x < points.length) {
    if (x !== points.length - 1) {
      transformedPoints = offsetEdge({source: points[x], target: points[x + 1]});
      var p1 = {x: transformedPoints.x1, y: transformedPoints.y1};
      var p2 = {x: transformedPoints.x2, y: transformedPoints.y2};
      bothCode.push(p1,p2);
      if (bothCode.length > 3) {
        var l = bothCode.length - 1;
        var lineA = {a: bothCode[l - 3], b: bothCode[l - 2]};
        var lineB = {a: bothCode[l - 1], b: bothCode[l]};
        var intersect = findIntersect(lineA.a.x, lineA.a.y, lineA.b.x, lineA.b.y, lineB.a.x, lineB.a.y, lineB.b.x, lineB.b.y);
        if (intersect.found == true) {
          lineA.b.x = intersect.x;
          lineA.b.y = intersect.y;
          lineB.a.x = intersect.x;
          lineB.a.y = intersect.y;
        }
      }
    }

    x++;
  }
  x--;
  //Back
  while (x >= 0) {
    if (x !== 0) {
      transformedPoints = offsetEdge({source: points[x], target: points[x - 1]});
      var p1 = {x: transformedPoints.x1, y: transformedPoints.y1};
      var p2 = {x: transformedPoints.x2, y: transformedPoints.y2};
      bothCode.push(p1,p2);
      if (bothCode.length > 3) {
        var l = bothCode.length - 1;
        var lineA = {a: bothCode[l - 3], b: bothCode[l - 2]};
        var lineB = {a: bothCode[l - 1], b: bothCode[l]};
        var intersect = findIntersect(lineA.a.x, lineA.a.y, lineA.b.x, lineA.b.y, lineB.a.x, lineB.a.y, lineB.b.x, lineB.b.y);
        if (intersect.found == true) {
          lineA.b.x = intersect.x;
          lineA.b.y = intersect.y;
          lineB.a.x = intersect.x;
          lineB.a.y = intersect.y;
        }
      }
    }

    x--;
  }

  return bothCode;
}

function findIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) {
    var d, a, b, n1, n2, result = {
        x: null,
        y: null,
        found: false
    };
    d = ((l2y2 - l2y1) * (l1x2 - l1x1)) - ((l2x2 - l2x1) * (l1y2 - l1y1));
    if (d == 0) {
        return result;
    }
    a = l1y1 - l2y1;
    b = l1x1 - l2x1;
    n1 = ((l2x2 - l2x1) * a) - ((l2y2 - l2y1) * b);
    n2 = ((l1x2 - l1x1) * a) - ((l1y2 - l1y1) * b);
    a = n1 / d;
    b = n2 / d;

    result.x = l1x1 + (a * (l1x2 - l1x1));
    result.y = l1y1 + (a * (l1y2 - l1y1));

    if ((a > 0 && a < 1) && (b > 0 && b < 1)) {
        result.found = true;
    }

    return result;
};

}