/**
 * @class Angle - represents an angle.
 */
class Angle {
  /**
   * @private
   * @type {int} - The angle, in degrees.
   */
  #angle;

  /**
   * @param {number} angle - The angle, in degrees.
   */
  constructor(angle) {
    this.#angle = Math.abs(angle) % 360;
  };

  /**
   * @returns {number} - The angle, in degrees.
   */
  get degrees() {
    return this.#angle;
  };

  /**
   * @returns {number} - The angle, in radians.
   */
  get radians() {
    return this.#angle * Math.PI / 180;
  };

  compare(angle) {
    return this.degrees - angle.degrees;
  };
}

export default Angle;
