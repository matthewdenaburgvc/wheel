import Sector from './sector.js';
import Color from './color.js';
import Person from './person.js';

class Wheel {
  static #alreadyLoaded = false;
  static #peopleInput = $("#people-input");

  #radius = null;

  /** the wheel
   * @type {jQuery}
   */
  wheel = null;
  /** the current angle of the wheel after a spin.
   * @type {number}
   */
  #currentAngle = null;
  /** the slices on the wheel
   * @type {Array<Sector>}
   */
  #sectors = null;

  /** Create a new Wheel
   * @returns {Wheel} the wheel object
   */
  constructor() {
    this.#sectors = [];
    this.wheel = null;
    this.#currentAngle = 90;
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
    if (this.#sectors.length == 0) {
      this.createSlices();
    }
    this.addSlices();

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

  /** Create the slices
   * @returns {Wheel} the wheel object
   * @todo Refactor this method
   * @todo Add a border to slices
   */
  createSlices() {
    const people = Person.getPeople();
    const sectorAngle = 360 / people.length;

    people.forEach((person, index) => {
      const angle = index * sectorAngle;
      const backgroundColor = new Color(`hsl(${Math.floor(angle)}, 100%, 45%)`);
      const sector = new Sector(sectorAngle, this.#radius, backgroundColor, person.name);

      this.#sectors.push({
        angle: angle - sectorAngle / 2,
        sector: sector,
      })
    });

    return this;
  };

  addSlices() {
    this.wheel.empty();

    this.#sectors.forEach(element => {
      let { angle, sector } = element;
      this.wheel.append(
        sector.toHtml().css({
            transform: `rotate(${angle}deg)`,
          })
      );
    });

    return this;
  };

  /** Spin the wheel
   * @returns {Wheel} the wheel object\
   */
  spin() {
    const newAngle = Math.floor(Math.random() * 360) // at least one partial spin
           + Math.floor(Math.random() * 2 + 1) * 360; // plus one or two more full spins
    this.#currentAngle += newAngle;

    this.wheel.css({
      transition: 'transform 1s ease-out',
      transform: `rotate(${this.#currentAngle}deg)`,
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
