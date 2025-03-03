import Angle from "./angle.js";

class Sector {
  static #count = 0;

  /**
   * @type {Angle}
   */
  #rotation = new Angle(0);

  /**
   * @type {Angle}
   */
  #arcAngle = new Angle(0);

  text = null;
  #radius = 0;

  /**
   * @param {number} angle
   * @param {number} radius
   * @param {Color} color
   */
  constructor(color, text) {
    this.color = color;
    this.text = text;
  };

  /**
   * Convert the angle to a point in polar coordinates
   * @param {Angle} angle
   * @returns {Object} The point in polar coordinates.
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
  };

  toHtmlAtAngle(angleInWheel) {
    const $slice = $('<div>')
      .addClass('slice')
      .css({
        backgroundColor: this.color.toString(),
        clipPath: this.clipPath,
        transform: `rotate(${angleInWheel}deg)`,
      });

    const arcAngle = Sector.#count > 1 ? this.#arcAngle.degrees : 0;
    const $text = $('<div>')
      .addClass('name')
      .addClass(this.color.isDark ? 'dark' : 'light')
      .text(this.text)
      .css({
        top: `calc(50% - ${this.chord / 4}px + 1rem)`,
        height: `${this.chord / 2}px`,

        // counteract the rotation of the sector when it is added to the wheel
        transform: `rotate(${arcAngle / 2}deg)`,
        transformOrigin: 'left'
      });

    $slice.append($text);

    return $slice;
  };

  get clipPath() {
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

    const path = [
      `M ${center}`, // move to center
      `L ${this.#pointString(radiusPoint)}`, // line to start point
      `A ${arc}`, // arc to end point
      'Z' // close path
    ].join(' ')

    return `path("${path}")`;
  };

  /**
    * @returns {Angle}
    */
  get arcAngle() {
    return this.#arcAngle;
  };

  /**
   * @param {number} newAngle - The angle, in degrees.
   */
  set arcAngle(newAngle) {
    this.#arcAngle = new Angle(newAngle);
  };

  /**
   * A chord of a circle is a straight line segment whose endpoints both lie on a circular arc.
   * @see https://en.wikipedia.org/wiki/Chord_(geometry)
   * @returns {int}
   */
  get chord() {
    if (Sector.#count === 1) {
      return this.#radius;
    }

    return this.#radius * Math.sin(this.#arcAngle.radians / 2);
  };

  /**
   * @returns {number}
   */
  get radius() {
    return this.#radius;
  };

  /**
   * @param {number} newRadius
   */
  set radius(newRadius) {
    this.#radius = newRadius;
  };

  static updateCount(count) {
    Sector.#count = count;
  };
};

export default Sector;
