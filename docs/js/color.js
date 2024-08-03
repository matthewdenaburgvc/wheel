/**
 * @file Represents a color.
 *
 */


/**
 * Represents a color.
 */
class Color {
  /**
   * Create a new color.
   * @param {string} hex the hex code of the color
   */
  constructor(color) {
    this.hex = this.#toHex(color);
    this.isDark = this.isDark();
    this.cssClasses = [];

    this.init();
  };

  init() {
    this.cssClasses.push(this.isDark ? 'dark' : 'light');
  };

  /**
   * Convert RGB color to HEX.
   * @param {string} color - The RGB color string.
   * @returns {string} The HEX color string.
   */
  #toHex() {
    if (this.color.match(/^rgb/)) {
      // If RGB --> store the red, green, blue values in separate variables
      const rgb = this.color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      const r = parseInt(rgb[1]);
      const g = parseInt(rgb[2]);
      const b = parseInt(rgb[3]);

      return `#${((r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    return color;
  };

  toString() {
    return this.hex;
  };

  /**
   * Determine if this color could be considered "dark".
   * @returns {boolean} True if the color is dark, false otherwise.
   * @see https://alienryderflex.com/hsp.html
   * @see https://awik.io/determine-color-bright-dark-using-javascript/
   */
  isDark() {
    const rgb = parseInt(this.hex.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    return hsp <= 127.5;
  };
};
