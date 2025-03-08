/**
 * Represents an angle
 */
class Angle {
    /**
     * @param angle The angle, in degrees.
     */
    constructor(angle) {
        this.angle = Math.abs(angle) % 360;
    }
    get degrees() {
        return this.angle;
    }
    /**
     * @returns The angle, in radians.
     */
    get radians() {
        return this.angle * Math.PI / 180;
    }
    compare(angle) {
        return this.degrees - angle.degrees;
    }
}
export default Angle;
