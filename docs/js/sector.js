import Angle from "./angle.js";
class Sector {
    constructor(color, text) {
        this._initialAngle = new Angle(0);
        this._finalAngle = new Angle(0);
        this._backgroundColor = null;
        this._radius = 0;
        this._text = null;
        this._backgroundColor = color;
        this._text = text;
    }
    toPolarPoint(angle) {
        let x = this._radius + this._radius * Math.cos(angle.radians);
        let y = this._radius + this._radius * Math.sin(angle.radians);
        // divide by 2 since we're starting from the center
        x /= 2;
        y /= 2;
        // to 3 decimal places
        x = Math.round(x * 1000) / 1000;
        y = Math.round(y * 1000) / 1000;
        return this.convertPointToString({ x, y });
    }
    convertPointToString(point) {
        return `${point.x} ${point.y}`;
    }
    get clipPath() {
        // center of the circle
        const center = this.convertPointToString({ x: this._radius / 2, y: this._radius / 2 });
        // start point of the arc
        const radiusPoint = this.toPolarPoint(this._initialAngle);
        // end point of the arc
        const arcPoint = this.toPolarPoint(this._finalAngle);
        const arc = [
            center,
            this._initialAngle.degrees,
            this._finalAngle.degrees > 180 ? 1 : 0, // large-arc flag
            1,
            arcPoint
        ].join(' ');
        const path = [
            `M ${center}`, // move to center
            `L ${radiusPoint}`, // line to start point
            `A ${arc}`, // arc to end point
            'Z' // close path
        ].join(' ');
        return `path("${path}")`;
    }
    toHtml() {
        const $slice = $('<div>')
            .addClass('slice')
            .css({
            backgroundColor: this._backgroundColor.toString(),
            clipPath: this.clipPath,
        });
        const finalAngle = Sector.count > 1 ? this._finalAngle.degrees : 0;
        const $text = $('<div>')
            .addClass('name')
            .addClass(this._backgroundColor.isDark ? 'dark' : 'light')
            .text(this._text)
            .css({
            top: `calc(50% - ${this.chord / 4}px + 1rem)`,
            height: `${this.chord / 2}px`,
            // counteract the rotation of the sector when it's added to the wheel
            transform: `rotate(${finalAngle / 2}deg)`,
            transformOrigin: 'left'
        });
        $slice.append($text);
        return $slice;
    }
    get text() {
        return this._text;
    }
    get finalAngle() {
        return this._finalAngle;
    }
    /**
     * A chord of a circle is a straight line segment whose endpoints both lie on a circular arc.
     * @see https://en.wikipedia.org/wiki/Chord_(geometry)
     */
    get chord() {
        if (Sector.count <= 1) {
            return this._radius;
        }
        return this._radius * Math.sin(this._finalAngle.radians / 2);
    }
    set finalAngle(newAngle) {
        this._finalAngle = new Angle(newAngle);
    }
    get radius() {
        return this._radius;
    }
    set radius(newRadius) {
        this._radius = newRadius;
    }
    static updateCount(count) {
        Sector.count = count;
    }
}
Sector.count = 0;
export default Sector;
