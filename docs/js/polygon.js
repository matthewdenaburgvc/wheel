/**
 * @class Polygon
 * @classdesc Represents a portion of a square. Each polygon is created with `count` which represents how polygons will be created to fill the square.
 */
class Polygon {
  constructor(count, sideLength, index) {
    this.count = count;

    this.index = index % this.count;
    this.baseAngle = 360 / this.count;
    this.radius = sideLength / 2;

    this.polygons = [];
  }

  draw() {
    this.polygons = [];

    const points = this.calculatePoints();

    // center of the square
    const center = { x: 50, y: 50, angle: 0 };
    const corner = { x: 100, y: 100, angle: 0 };
    for (let i = 0; i < 4; i++) {
      let nextIndex = (i + 1) % 4;
      this.polygons.push([center, points[(Math.abs(i-1))%4], center, corner, points[nextIndex]]);
    }

    // console.log(`Polygon 0`);
    // this.polygons[0].forEach((point, i) => {
    //   this.#logPoint(point, i);
    // });

    return this;
  };

  #logPoint(point, i) {
    console.log(`${i} x: ${point.x}, y: ${point.y}, angle: ${point.angle}`);
  }

  calculatePoints() {
    // the angle of each point
    const angles = [];
    for (let i = 0; i < 4; i++) {
      angles.push(i * this.baseAngle);
    }

    return angles.map((angle, i) => {
      return this.calculatePoint(angle, i);
    });
  }

  calculatePoint(angle) {
    const radians = (Math.PI / 180) * angle;

    let x, y;
    if (angle == 0 && angle < 90) {
      x = this.radius;
      y = this.radius / 2 - this.radius * 2 * Math.tan(radians);
    }
    else if (angle >= 90 && angle < 180) {
      x = this.radius / 2 + this.radius * 2 / Math.tan(radians);
      y = this.radius;
    }
    else if (angle >= 180 && angle < 270) {
      x = this.radius;
      y = this.radius / 2 + this.radius * 2 * Math.tan(radians);
    }
    else {
      x = this.radius / 2 - this.radius * 2 / Math.tan(radians);
      y = this.radius;
    }

    // convert x and y to percentages
    x = x / this.radius * 100;
    y = y / this.radius * 100;

    return { x, y, angle };
  }

  toString() {
    const pointStringArray = this.polygons[0].map((point) => {
      return `${point.x}% ${point.y}%`;
    });

    return `polygon(${pointStringArray.join(', ')})`;
  }
};

export default Polygon;
