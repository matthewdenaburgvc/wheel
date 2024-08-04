import Person from './person.js';
import Color from './color.js';
import Polygon from './polygon.js';

class Wheel {
  static #alreadyLoaded = false;
  static #peopleInput = $("#people-input");

  constructor(reuseColors = false) {
    this.reuseColors = reuseColors;

    this.wheel = null;
    this.colorsInUse = [];
    this.currentAngle = 90;
    this.sliceCount = 0;

    this.diameter = 250;
  };

  init() {
    if (!Wheel.#alreadyLoaded) {
      this.wheel = $('<div>').attr('id', 'wheel');
      this.wheel.appendTo("#wheel-container");
    }

    this.load().then(() => {
      this.draw();
    });

    this.wheel.click(this.spin.bind(this));
    $(window).resize(this.resize.bind(this));

    Wheel.#alreadyLoaded = true;
  };

  async load() {
    // load the names
    const names = await Wheel.loadNamesFromInput();
    names.forEach(name => {
      new Person(name);
    });
  };

  draw() {
    this.resize();
    this.createSlices();
  };

  resize() {
    var parentWidth = this.wheel.parent().width();
    var parentHeight = this.wheel.parent().height();
    this.diameter = Math.min(parentWidth, parentHeight);

    this.wheel.css({
      width: this.diameter + 'px',
      height: this.diameter + 'px'
    });
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

  createSlices() {
    const people = Person.getPeople();
    this.sliceCount = people.length;

    const angle = 360 / this.sliceCount;
    this.wheel.empty();

    people.forEach((person, index) => {
      [1].forEach(sliceHalf => {
        const backgroundColor = this.randomColor();
        const $slice = $('<div>')
          .addClass('slice')
          .css({
            backgroundColor: backgroundColor,
            // transform: `rotate(${angle * index}deg)`,
            zIndex: sliceHalf === 1 ? 1 : 0,
            clipPath: this.calculateClipPath(sliceHalf),
          });


        if (sliceHalf === 1) {
          const $text = $('<span>')
            .addClass(backgroundColor.isDark ? 'dark' : 'light')
            .text(person);
          $slice.append($text);
        }
        this.wheel.append($slice);
      });

      /*
      const $slice = $('<div>')
        .addClass('slice')
        .css({
          backgroundColor: backgroundColor,
          transform: `rotate(${angle * index}deg)`,
          zIndex: 1,
          clipPath: this.calculateClipPath(),

        });
      const $text = $('<span>')
        .addClass(backgroundColor.isDark ? 'dark' : 'light')
        .text(person);

      $slice.append($text);
      this.wheel.append($slice);
      */
    });
  };

  calculateClipPath(sliceHalf) {
    const radius = this.diameter / 2;
    const angle = 360 / this.sliceCount;
    // const cornerLoc = 100 / this.sliceCount;
    const radiusPercent = radius / this.diameter * 100;

    // Convert angle to radians for Math.tan
    const y = radius * Math.tan((angle / 2) * (Math.PI / 180));
    const yPercent = y / this.diameter * 100;

    // const percentString =
    const coordinates = [
      // start at the center of the circle
      {x: `${radiusPercent}%`, y: `${radiusPercent}%`},
      // go straight up to the edge of the circle
      {x: `${radiusPercent}%`, y: '0%'},
      {x: 0, y: 0},
      {x: 0, y: `${yPercent}%`},
    ];

    return `polygon(
      ${coordinates[0].x} ${coordinates[0].y},
      ${coordinates[1].x} ${coordinates[1].y},
      ${coordinates[2].x} ${coordinates[2].y},
      ${coordinates[3].x} ${coordinates[3].y}
    )`;
  };

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

  static async loadNamesFromInput() {
    return Wheel.#peopleInput.val()
      .split('\n')
      .filter(Boolean);
  };

  static async saveNamesToInput(names) {
    Wheel.#peopleInput.val(names.join('\n'));
  };
};

export default Wheel;
