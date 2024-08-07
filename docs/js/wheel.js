import Person from './person.js';
import Color from './color.js';
import Polygon from './polygon.js';

class Wheel {
  static #alreadyLoaded = false;
  static #peopleInput = $("#people-input");

  constructor(radius = 50, reuseColors = false) {
    this.reuseColors = reuseColors;

    this.wheel = null;
    this.colorsInUse = [];
    this.currentAngle = 90;
    this.sliceCount = 0;

    // this.diameter = 250;
    this.radius = radius;
  };

  init() {
    if (!Wheel.#alreadyLoaded) {
      this.wheel = $('<div>').attr('id', 'wheel');
      $("#wheel-container").append(this.wheel);
    }

    this.load().then(() => {
      this.draw();
    });

    this.wheel.click(this.spin.bind(this));
    $(window).resize(this.resize.bind(this));

    Wheel.#alreadyLoaded = true;

    return this;
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

    return this;
  };

  resize() {
    var parentWidth = this.wheel.parent().width();
    var parentHeight = this.wheel.parent().height();
    this.radius = Math.min(parentWidth, parentHeight);

    this.wheel.css({
      width: this.radius + 'px',
      height: this.radius + 'px'
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

  createSlices() {
    const people = Person.getPeople();
    this.sliceCount = people.length;
    const angleStep = 360 / this.sliceCount;

    this.wheel.empty();

    const polygon = new Polygon(this.sliceCount, this.radius).draw();

    people.forEach((person, index) => {
      // const backgroundColor = this.randomColor();
      const backgroundColor = `hsl(${index * angleStep}, 100%, 45%)`; // Example color

      // const index1 = index % this.sliceCount;
      // const index2 = (index + 1) % this.sliceCount;
      // console.log(`${index}: slice ${index1} and ${index2}`);

      let $slice = $('<div>')
        .addClass('slice')
        .css({
          clipPath: polygon.toString(),
          transform: `rotate(${index * angleStep}deg)`,
        });
      // under the next slice
      let part1 = $('<div>')
        .addClass('part-1')
        .addClass(backgroundColor.isDark ? 'dark' : 'light')
        .text(person)
        .css({
          backgroundColor: backgroundColor,
          zIndex: index % this.sliceCount,
        });
      // over the previous slice
      let part2 = $('<div>')
        .addClass('part-2')
        .css({
          backgroundColor: backgroundColor,
          zIndex: (index + 1) % this.sliceCount,
        });

      // $slice.append(part2);
      $slice.append(part1);

      // const $text = $('<span>')
      //   .addClass('dark')
      //   .text(person);
      // part1.append($text);

      this.wheel.append($slice);
    });
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
