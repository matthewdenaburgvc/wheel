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
  /** the slices on the wheel
   * @type {Array<Sector>}
   */
  #sectors = null;

  /** Create a new Wheel
   * @returns {Wheel} the wheel object
   */
  constructor() {
    this.wheel = null;
    this.#sectors = [];
    this.#radius = 100;
  };

  /** Initialize the wheel
   * @returns {Wheel} the wheel object
   */
  init() {
    if (!Wheel.#alreadyLoaded) {
      this.wheel = $('<div>').attr('id', 'wheel');
      $("#wheel-container").append(this.wheel);
    }

    this.#load().then(() => {
      this.draw();
    });

    this.wheel.click(this.#spin.bind(this));
    $("#winner-overlay").on("click", this.#hideWinnerOverlay.bind(this));
    $(window).on("resize", this.draw.bind(this));

    Wheel.#alreadyLoaded = true;

    return this;
  };

  /** Load the names from the input
   * @async
   */
  async #load() {
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
    this.#resize();
    if (this.#sectors.length == 0) {
      this.#createSlices();
    }
    this.#drawSlices();

    return this;
  };

  /** Resize the wheel
   * @returns {Wheel} the wheel object
   */
  #resize() {
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
  #createSlices() {
    const people = Person.getPeople();
    const sectorAngle = 360 / people.length;

    people.forEach((person, index) => {
      const angle = index * sectorAngle;
      const backgroundColor = new Color(`hsl(${Math.floor(angle)}, 100%, 45%)`);
      const sector = new Sector(backgroundColor, person.name);
      this.#sectors.push(sector);
    });

    return this;
  };

  #drawSlices() {
    this.wheel.empty();
    const sectorAngle = 360 / this.#sectors.length

    this.#sectors.forEach((sector, index) => {
      const angle = index * sectorAngle - sectorAngle / 2;
      sector.arcAngle = sectorAngle;
      sector.radius = this.#radius;

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
  #spin() {
    const count = this.#sectors.length;
    // select random sector
    const index = Math.floor(Math.random() * count)
    // do at most 3 rotations, and stop at that sector's angle
    const angle = Math.floor(Math.random() * 2 + 1) * 360 - 360 / count * index;

    this.wheel.css({
      transition: 'transform 1.5s ease-out',
      transform: `rotate(${angle}deg)`,
    });

    setTimeout(() => {
      // stop rotation
      this.wheel.css({
        transition: 'none',
      });

      // remove selected person
      this.#showWinnerOverlay(index);
    }, 1500); // Reset animation

    return this;
  };

  /** Show the winner
   * @param {number} index - the index of the winner
   */
  #showWinnerOverlay(index) {
    // add the winner to the overlay
    $("#winner-name").text(this.#sectors[index].text);
    // show the overlay
    $("#winner-overlay").show();
    // remove the winner from the wheel
    this.#sectors.splice(index, 1);

    return this;
  };

  #hideWinnerOverlay() {
    // reset the wheel angle
    this.wheel.css({
      transition: 'transform',
      transform: 'rotate(0deg)',
    });
    // hide the overlay
    $("#winner-overlay").hide();
    // redraw the wheel
    this.#drawSlices();

    return this;
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
