/**
 * @class Polygon
 * @classdesc Represents a portion of a square. Each polygon is created with `count` which represents how polygons will be created to fill the square.
 * @todo rename class to `Quadrilateral`
 */
class Polygon {
  // TODO: remove this
  static names = 4;

  /** the number of polygons to create */
  count = null;
  /** the angle each sector makes on a unit circle */
  angle = null;

  /** the number of points needed to make each polygon */
  #pointCount = null;
  /** the angle of each point */
  #pointAngle = null;

  /**
   * Create a new Polygon
   * @param {int} count how many polygons will make up the square
   * @param {number} sideLength the length of a side
   */
  constructor(count, sideLength) {
    this.count = count;
    this.angle = 360 / this.count;

    // cut each polygon in half
    this.#pointCount = count * 2;
    this.#pointAngle = 360 / this.#pointCount;

    // the angle of each point
    this.radius = sideLength / 2;

    this.polygons = [];
  }

  /**
   * create the polygons
   * @returns {Polygon} the polygon object
   */
  draw() {
    this.polygons = [];

    const points = this.calculatePoints();

    // center of the square
    const center = { x: 50, y: 50, angle: 0 };
    for (let i = 0; i < this.#pointCount; i++) {
      // start creating a quadrilateral, starting at the center of the drawing
      let polygon = [center];

      for (let pointIndex = i; pointIndex < i + 3; pointIndex++) {
        polygon.push(points[(i + pointIndex) % this.#pointCount]);
      }

      this.polygons.push(polygon);
    }

    return this;
  };

  /**
   * Calculate the points that make up the polygon
   * @returns {array} an array of objects representing the intersection points
   */
  calculatePoints() {
     return Array.from({ length: this.#pointCount }, (_, index) => {
      return this.calculatePoint(index * this.#pointAngle);
    });
  }

  /**
   * Calculate the x,y coordinates of a point on the square, given an angle
   * @param {number} angle the angle in degrees to calculate the point for
   * @returns {object} an object with x and y properties representing the point
   */
  calculatePoint(angle) {
    const radians = (Math.PI / 180) * angle;

    // if the angle is halfway between a multiple of this.angle, print the angle
    const isHalfAngle = angle % this.angle !== 0;

    let x, y;
    let modifiers = {
      x: {
        sign: 1,
        hypotenuse: 1,
        function: Math.tan,
      },
      y: {
        sign: 1,
        hypotenuse: 1,
        function: Math.tan,
      }
    };

    if ([0, 90, 180, 270].indexOf(angle) > -1) {
      modifiers.x.hypotenuse = 0;
      modifiers.y.hypotenuse = 0;
    }

    // right edge, halfway down
    if (angle === 0) {
      modifiers.x.sign = 1;
      modifiers.y.sign = 1 / 2;
    }
    // top edge, halfway across
    else if (angle === 90) {
      modifiers.x.sign = 1 / 2;
      modifiers.y.sign = 0;
    }
    // left edge, halfway down
    else if (angle === 180) {
      modifiers.x.sign = 0;
      modifiers.y.sign = 1 / 2;
    }
    // bottom edge, halfway across
    else if (angle === 270) {
      modifiers.x.sign = 1 / 2;
      modifiers.y.sign = 1;
    }
    // 1st quadrant
    else if (angle > 0 && angle < 90) {
      modifiers.x.sign = 2;
      modifiers.y.sign = -1;

      modifiers.x.function = isHalfAngle ? Math.cos : Math.tan;
      modifiers.y.function = isHalfAngle ? Math.sin : Math.tan;

      // modifiers.x.hypotenuse = 1;
      modifiers.y.hypotenuse = -2;
    }
    // 2nd quadrant
    else if (angle > 90 && angle < 180) {
      modifiers.x.sign = 0;
      modifiers.y.sign = 1;
    }
    // 3rd quadrant
    else if (angle > 180 && angle < 270) {
      modifiers.x.sign = -2;
    }
    // 4th quadrant
    else { // angle > 270 && angle < 360
      modifiers.x.sign = 2;
      modifiers.y.sign = 2;
      modifiers.x.function = isHalfAngle ? Math.cos : Math.tan;
      modifiers.y.function = isHalfAngle ? Math.sin : Math.tan;

      // In the 4th quadrant, tan returns a negative value. Adjust the sign.
      modifiers.x.hypotenuse = -1;
      modifiers.y.hypotenuse = -1;
    }

    x = modifiers.x.sign * this.radius + clearRoundingError(modifiers.x.hypotenuse * this.radius * modifiers.x.function(radians));
    y = modifiers.y.sign * this.radius + clearRoundingError(modifiers.y.hypotenuse * this.radius * modifiers.y.function(radians));

    if (isHalfAngle && angle == 36 || angle == 72) {
      console.log(`angle: ${angle}`);
      let str = '';

      str += `x = ${modifiers.x.sign} * ${this.radius} + ${modifiers.x.hypotenuse} * ${this.radius} * ${modifiers.x.function.name}(${angle})\n`;
      str += `  = ${modifiers.x.sign * this.radius} + ${clearRoundingError(modifiers.x.hypotenuse * this.radius * modifiers.x.function(radians))}\n`;
      str += `  = ${clearRoundingError(x)}\n`;

      str += `y = ${modifiers.y.sign} * ${this.radius} + ${modifiers.y.hypotenuse} * ${this.radius} * ${modifiers.y.function.name}(${angle})\n`;
      str += `  = ${modifiers.y.sign * this.radius} + ${clearRoundingError(modifiers.y.hypotenuse * this.radius * modifiers.y.function(radians))}\n`;
      str += `  = ${clearRoundingError(y)}\n`;

      console.log(str);
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

    return { x, y , angle , xFunc: modifiers.x.function.name, yFunc: modifiers.y.function.name };
  }

  /**
   * Generate a CSS clip-path for the specified portion of the polygon
   * @param {int} index which polygon to generate a CSS clip-path for
   * @returns {string} a string representing the polygon in CSS clip-path format
   */
  toPolygonClipPath(index) {
    const pointStringArray = this.polygons[index].map((point) => {
      return `${point.x}% ${point.y}%`;
    });

    return `polygon(${pointStringArray.join(', ')})`;
  }

  /**
   * Gaussian area (Shoelace formula for polygon area)
   * @param {number} index - The index of the polygon to calculate the area of
   * @returns {number} The area of the polygon
   * @see https://en.wikipedia.org/wiki/Shoelace_formula
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
