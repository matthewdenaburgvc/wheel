/**
 * Represents an angle
 */
class Angle {
  /** The angle, in degrees. */
  private angle: number;

  /**
   * @param angle The angle, in degrees.
   */
  constructor(angle: number) {
    this.angle = Math.abs(angle) % 360;
  }

  get degrees(): number {
    return this.angle;
  }

  /**
   * @returns The angle, in radians.
   */
  get radians(): number {
    return this.angle * Math.PI / 180;
  }

  compare(angle: Angle): number {
    return this.degrees - angle.degrees;
  }
}

export default Angle;
