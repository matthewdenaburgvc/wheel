/**
 * Represents a color.
 */
class Color {
  /**
   * Create a new color.
   * @param {string} color the color - hex or rgb.
   */
  constructor(color) {
    this.hex = this.toHex(color);
    this.isDark = this.isDark();
  };

  fromRGB(color) {
    const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    let r, g, b;
    r = parseInt(rgb[1]);
    g = parseInt(rgb[2]);
    b = parseInt(rgb[3]);

    return Color.fromRGBHelper(r, g, b);
  }

  /**
   * Convert HSL color to RGB.
   * @param {string} color - The HSL color string.
   * @returns {string} The RGB color string.
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
   */
  fromHSL(color) {
    const hsl = color.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%/);
    const h = parseInt(hsl[1]);
    const s = parseInt(hsl[2]) / 100;
    const l = parseInt(hsl[3]) / 100;

    // chroma
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    // intermediate value
    const x = c * (1 - Math.abs(hPrime % 2 - 1));
    // match lightness
    const m = l - c / 2;

    let r, g, b;
    if (hPrime <= 1) {
      r = c;
      g = x;
      b = 0;
    }
    else if (hPrime <= 2) {
      r = x;
      g = c;
      b = 0;
    }
    else if (hPrime <= 3) {
      r = 0;
      g = c;
      b = x;
    }
    else if (hPrime <= 4) {
      r = 0;
      g = x;
      b = c;
    }
    else if (hPrime <= 5) {
      r = x;
      g = 0;
      b = c;
    }
    else if (hPrime <= 6) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return Color.fromRGBHelper(r, g, b);
  }

  /**
   * Convert the value to a hex color.
   * @param {string} color - the color string (RGB, HSL, or hex).
   * @returns {string} The hex color string.
   */
  toHex(color) {
    // RGB
    if (color.match(/^rgb/i)) {
      return this.fromRGB(color);
    }
    // HSL
    if (color.match(/^hsl/i)) {
      return this.fromHSL(color);
    }
    // Hex
    if (color.match(/^#/)) {
      return color;
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

  static random() {
    return new Color(colorSpectrum[Math.floor(Math.random() * colorSpectrum.length)]);
  }

  static fromRGBHelper(red, green, blue) {
    const colorString = [red, green, blue].map((color) => {
      return color.toString(16).padStart(2, '0');
    }).join('').toUpperCase();

    return `#${colorString}`;
  }
};

const spectrum = ['#A2395B', '#A63552', '#AA3149', '#AE2D40', '#B22937', '#A23A53', '#924B6F', '#825C8B', '#6F6DA7', '#A63570', '#AC2F5A', '#B22944', '#B8232E', '#C11C17', '#A72A37', '#8D3857', '#734677', '#575597', '#A6358C', '#B43B6A', '#C24148', '#D04726', '#DE5003', '#B84D24', '#924A45', '#6C4766', '#434187', '#A650A0', '#B55A80', '#C46460', '#D36E40', '#E27A1D', '#B26331', '#824C45', '#523559', '#1F1D6D', '#A660AC', '#B67288', '#C68464', '#D69640', '#E6AA19', '#BC892E', '#926843', '#684758', '#3B256D', '#A670B8', '#B8878E', '#CA9E64', '#DCB53A', '#EFCE10', '#C8A628', '#A17E40', '#7A5658', '#502E72', '#80529A', '#98777A', '#B09C5A', '#C8C13A', '#E0E61A', '#C8C13A', '#B09C5A', '#98777A', '#80529A', '#502E72', '#675860', '#7E824E', '#95AC3C', '#ACD62A', '#ABBD4D', '#AAA470', '#A98B93', '#A670B8', '#3B256D', '#4C4D60', '#5D7553', '#6E9D46', '#80C837', '#89AE54', '#929471', '#9B7A8E', '#A660AC', '#1F1D6D', '#2A3F5D', '#35614D', '#40833D', '#4CA82B', '#629248', '#787C65', '#8E6682', '#A650A0', '#434187', '#3B536E', '#336555', '#2B773C', '#228B22', '#43763C', '#646156', '#854C70', '#A6358C', '#575597', '#4A678D', '#3D7983', '#308B79', '#229F6E', '#43856E', '#646B6E', '#85516E', '#A63570', '#6F6DA7', '#5C7EA7', '#498FA7', '#36A0A7', '#20B2AA', '#409497', '#607684', '#805871', '#A2395B', '#7F91C3', '#789AC4', '#71A3C5', '#6AACC6', '#60B6CA', '#7493A6', '#887082', '#9C4D5E', '#B22937', '#71A3C5', '#79A9CD', '#81AFD5', '#89B5DD', '#93BDE7', '#9E95B3', '#A96D7F', '#B4454B', '#C11C17', '#60B6CA', '#67ADC9', '#6EA4C8', '#759BC7', '#7F91C3', '#968193', '#AD7163', '#C46133', '#DE5003', '#20B2AA', '#33A1AA', '#4690AA', '#597FAA', '#6F6DA7', '#8B7085', '#A77363', '#C37641', '#E27A1D', '#229F6E', '#2F8D78', '#3C7B82', '#49698C', '#575597', '#7A6A78', '#9D7F59', '#C0943A', '#E6AA19', '#228B22', '#2A793B', '#326754', '#3A556D', '#434187', '#6E646A', '#99874D', '#C4AA30', '#EFCE10', '#4CA82B', '#41863B', '#36644B', '#2B425B', '#1F1D6D', '#4F4F58', '#808244', '#B0B42F', '#E0E61A', '#80C837', '#6FA044', '#5E7851', '#4D505E', '#3B256D', '#57515C', '#747E4C', '#90AA3B', '#ACD62A'];
const colorSpectrum = Object.freeze(spectrum);

export default Color;
