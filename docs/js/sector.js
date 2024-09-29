import Angle from "./angle.js";

class Sector {
  /**
   * @type {Angle}
   */
  #rotation = new Angle(0);

  /**
   * @type {Angle}
   */
  #arcAngle = new Angle(0);

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

  toHtml() {
    const arcAngle = this.#arcAngle.degrees;

    const textPosition = {
      x: -this.#radius / 4 - arcAngle,
      y: -this.#radius / 4 + arcAngle
    }

    const $slice = $('<div>')
      .addClass('slice')
      .css({
        backgroundColor: this.color.toString(),
        clipPath: this.clipPath,
      });

    const $text = $('<span>')
      .addClass(this.color.isDark ? 'dark' : 'light')
      .css({
        transform: `translate(${textPosition.x}px, ${textPosition.y}px) rotate(${arcAngle / 2}deg) translateY(0.5em)`,
        lineHeight: 0,
      })
      .text(this.text);

    $slice.append($text);

    return $slice;
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
};

export default Sector;
