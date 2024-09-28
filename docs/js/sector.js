import Angle from "./angle.js"

class Sector {
  /**
   * @type {Angle}
   */
  #rotation;

  /**
   * @type {Angle}
   */
  #arcAngle;

  #radius = 0;

  /**
   * @type {number} - The angle of the sector, in degrees.
   */
  constructor(rotation, angle, radius) {
    this.#rotation = new Angle(rotation);
    this.#arcAngle = new Angle(rotation - angle);
    this.#radius = radius;

    this.clipPath = `path("${this.#draw()}")`;
  };

  /**
   *
   * @param {Angle} angle
   * @returns
   */
  #polarPoint(angle) {
    let x = this.#radius + this.#radius * Math.cos(angle.radians);
    let y = this.#radius + this.#radius * Math.sin(angle.radians);

    // divide by 2 since we're starting from the center
    x /= 2;
    y /= 2;

    // to 3 decimal places
    x = Math.round(x * 1000) / 1000;
    y = Math.round(y * 1000) / 1000;

    let r = { x, y };
    return r;
  };

  #pointString(point) {
    return `${point.x} ${point.y}`;
  }

  #draw() {
    // center of the circle
    const center = this.#pointString({ x: this.#radius / 2, y: this.#radius / 2} );
    // start point of the arc
    const radiusPoint = this.#polarPoint(this.#rotation);
    // end point of the arc
    const arcPoint = this.#polarPoint(this.#arcAngle);

    const arc = [
      center,
      this.#rotation.degrees,
      this.#arcAngle.degrees > 180 ? 1 : 0, // large-arc flag
      1,
      this.#pointString(arcPoint)
    ].join(' ');

    const clipPath = [
      `M ${center}`, // move to center
      `L ${this.#pointString(radiusPoint)}`, // line to start point
      `A ${arc}`, // arc to end point
      'Z' // close path
    ].join(' ')

    return clipPath;
  };
};

export default Sector;
