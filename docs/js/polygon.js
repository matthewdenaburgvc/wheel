/**
 * @class Polygon
 * @classdesc Represents a portion of a square. Each polygon is created with `count` which represents how polygons will be created to fill the square.
 */
class Polygon {
  constructor(count, sideLength, index) {
    this.count = count * 2;

    this.baseAngle = 360 / this.count;
    this.radius = sideLength / 2;

    this.polygons = [];
  }

  draw() {
    this.polygons = [];

    const points = this.calculatePoints();

    // center of the square
    const center = { x: 50, y: 50, angle: 0 };
    for (let i = 0; i < this.count; i++) {
      let polygon = [center];

      for (let pointIndex = i; pointIndex < i + 3; pointIndex++) {
        polygon.push(points[(i + pointIndex) % this.count]);
      }

      this.polygons.push(polygon);
    }

    return this;
  };

  calculatePoints() {
    // the angle of each intersection point
    const angles = [];
    for (let i = 0; i < this.count; i++) {
      angles.push(i * this.baseAngle);
    }

    return angles.map((angle) => {
      return this.calculatePoint(angle);
    });
  }

  /**
   * Calculate the intersection point for a given angle
   * @param {number} angle the angle in degrees to calculate the point for
   * @returns {object} an object with x and y properties representing the point
   */
  calculatePoint(angle) {
    const radians = (Math.PI / 180) * angle;

    let x, y;
    let modifiers = {
      x: {
        sign: 1,
        function: Math.tan
      },
      y: {
        sign: 1,
        function: Math.tan
      },
      hypotenuse: 1
    };

    let sign = { x: 1, y: 1, hypotenuse: 1, function: Math.tan };
    // ###### handle special cases first
    if (angle === 0) {
    // right edge, hal fway down
      x = this.radius;
      y = this.radius / 2;
    }
    else if (angle === 90) {
      // top edge, halfway across
      x = this.radius / 2;
      y = 0;
    }
    else if (angle === 180) {
      // left edge, halfway down
      x = 0;
      y = this.radius / 2;
    }
    else if (angle === 270) {
      // bottom edge, halfway across
      x = this.radius / 2;
      y = this.radius;
    }
    // ###### handle the rest
    else {
      if (angle > 0 && angle < 90) {
        modifiers.y.sign = -1;
        modifiers.y.function = Math.sin;
      }
      else if (angle > 90 && angle < 180) {
        // no changes needed
        modifiers.x.sign = 0;
        modifiers.y.function = Math.sin;
      }
      else if (angle > 180 && angle < 270) {
        modifiers.x.sign = -1;
      }
      else { // angle > 270 && angle < 360
        modifiers.x.sign = 0;
        modifiers.y.sign = 0;
        // in the 4th quadrant, tan returns a negative value
        modifiers.hypotenuse = -1;
      }

      x = modifiers.x.sign * this.radius + modifiers.hypotenuse * this.radius * modifiers.x.function(radians);
      y = modifiers.y.sign * this.radius + modifiers.hypotenuse * this.radius * modifiers.y.function(radians);
    }

    // convert x and y to percentages
    x = x / this.radius * 100;
    y = y / this.radius * 100;

    // make sure it's within the square
    x = Math.min(100, Math.max(0, x));
    y = Math.min(100, Math.max(0, y));

    // remove rounding errors
    x = clearRoundingError(x);
    y = clearRoundingError(y);

    return { x, y , angle };
  }

  toPolygonString(index) {
    const pointStringArray = this.polygons[index].map((point) => {
      return `${point.x}% ${point.y}%`;
    });

    return `polygon(${pointStringArray.join(', ')})`;
  }

  toString() {
    const pointStringArray = this.polygons[0].map((point) => {
      return `${point.x}% ${point.y}%`;
    });

    return `polygon(${pointStringArray.join(', ')})`;
  }

  /**
   * Gaussian area (Shoelace formula for polygon area)
   * @param {number} index - The index of the polygon to calculate the area of
   * @returns {number} The area of the polygon
   */
  area(index) {
    const polygon = this.polygons[index];
    let sum = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
      sum +=  (polygon[  i  ].x * polygon[i + 1].y)   // x_i * y_(i+1)
            - (polygon[i + 1].x * polygon[  i  ].y);  // y_i * x_(i+1)
    }

    return Math.abs(sum / 2);
  }
};

const clearRoundingError = function(number) {
  if (Math.abs(number - Math.round(number)) < 1e-10) {
    return Math.round(number);
  }
  return number;
}

export default Polygon;
