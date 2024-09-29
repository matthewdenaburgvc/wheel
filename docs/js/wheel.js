import Sector from './sector.js';
import Color from './color.js';
import Person from './person.js';

class Wheel {
  static #alreadyLoaded = false;
  static #peopleInput = $("#people-input");

  #radius = null;

  /** Indicates if randomly generated colors be reused
   * @type {boolean}
   */
  reuseColors = null;
  /** the wheel
   * @type {jQuery}
   */
  wheel = null;
  /** the colors in use
   * @type {Array<Color>}
   */
  colorsInUse = [];
  /** the current angle of the wheel after a spin.
   * @type {number}
   */
  currentAngle = null;
  /** the number of slices on the wheel
   * @type {number}
   */
  sliceCount = null;

  /** Create a new Wheel
   * @param {boolean} reuseColors - Indicates if randomly generated colors be reused
   * @returns {Wheel} the wheel object
   */
  constructor(reuseColors = false) {
    this.reuseColors = reuseColors;

    this.wheel = null;
    this.colorsInUse = [];
    this.currentAngle = 90;
    this.sliceCount = 0;
    this.#radius = 100
  };

  /** Initialize the wheel
   * @returns {Wheel} the wheel object
   */
  init() {
    if (!Wheel.#alreadyLoaded) {
      this.wheel = $('<div>').attr('id', 'wheel');
      $("#wheel-container").append(this.wheel);
    }

    this.load().then(() => {
      this.draw();
    });

    this.wheel.click(this.spin.bind(this));
    $(window).resize(this.draw.bind(this));

    Wheel.#alreadyLoaded = true;

    return this;
  };

  /** Load the names from the input
   * @async
   */
  async load() {
    // load the names
    const names = await Wheel.loadNamesFromInput();
    names.forEach(name => {
      new Person(name);
    });
  };

  /** Draw the wheel
   * @returns {Wheel} the wheel object
   */
  draw() {
    this.resize();
    this.createSlices();

    return this;
  };

  /** Resize the wheel
   * @returns {Wheel} the wheel object
   */
  resize() {
    var parentWidth = this.wheel.parent().width();
    var parentHeight = this.wheel.parent().height();
    this.#radius = Math.min(parentWidth, parentHeight);
    this.#radius = Math.round(this.#radius);

    this.wheel.css({
      width: this.#radius + 'px',
      height: this.#radius + 'px'
    });

    return this;
  };

  randomColor() {
    const color = Color.random()

    // If we're reusing colors
    if (!this.reuseColors) {
      if (this.colorsInUse.includes(color)) {
        return randomColor();
      }

      // Add the color to the list of colors in use
      this.colorsInUse.push(color);
    }

    return color;
  };

  /** Create the slices
   * @returns {Wheel} the wheel object
   * @todo Refactor this method
   * @todo Add a border to slices
   */
  createSlices() {
    const people = Person.getPeople();
    this.sliceCount = people.length;
    const angleStep = 360 / this.sliceCount;

    this.wheel.empty();
    const sector = new Sector(0, angleStep, this.#radius);

    people.forEach((person, index) => {
      const angle = index * angleStep;
      const backgroundColor = new Color(`hsl(${Math.floor(angle)}, 100%, 45%)`);

      const $slice = $('<div>')
        .addClass('slice')
        .css({
          backgroundColor: backgroundColor.toString(),
          clipPath: sector.clipPath,
          transform: `rotate(${angle - angleStep / 2}deg)`,
        });

      const textPosition = {
        x: -this.#radius / 4 - angleStep,
        y: -this.#radius / 4 + angleStep,
      }
      const $text = $('<span>')
        .addClass(backgroundColor.isDark ? 'dark' : 'light')
        .css({
          transform: `translate(${textPosition.x}px, ${textPosition.y}px) rotate(${angleStep / 2}deg) translateY(0.5em)`,
          lineHeight: 0,
        })
        .text(person);
      $slice.append($text);

      this.wheel.append($slice);
    });
  };

  /** Spin the wheel
   * @returns {Wheel} the wheel object\
   */
  spin() {
    const newAngle = Math.floor(Math.random() * 360) // at least one partial spin
           + Math.floor(Math.random() * 2 + 1) * 360; // plus one or two more full spins
    this.currentAngle += newAngle;

    this.wheel.css({
      transition: 'transform 1s ease-out',
      transform: `rotate(${this.currentAngle}deg)`,
    });

    setTimeout(() => {
      this.wheel.css({
        transition: 'none',
      });
    }, 1000); // Reset animation
  };

  /** Load the names from the input
   * @async
   * @returns {Array<string>} the names from the input
   */
  static async loadNamesFromInput() {
    return Wheel.#peopleInput.val()
      .split('\n')
      .filter(Boolean);
  };

  /** Save the names to the input
   * @async
   * @param {Array<string>} names - the names
   * @returns {void}
   */
  static async saveNamesToInput(names) {
    Wheel.#peopleInput.val(names.join('\n'));
  };
};

export default Wheel;
