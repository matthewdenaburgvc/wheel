import Color from './color.js';
import Person from './person.js';
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
    this.radius = 2;
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
    // this.resize();
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
      if (index != 0) {
        return;
      }

      polygon.polygons[index].forEach((point, i) => {
        console.log(`${i}: ${point.x}, ${point.y}, ${point.angle}, ${point.xFunc}, ${point.yFunc}`);
      });

      const backgroundColor =new Color(`hsl(${index * angleStep}, 100%, 45%)`); // Example color

      let $slice = $('<div>')
        .addClass('slice')
        .css({
          clipPath: polygon.toPolygonClipPath(index),
          backgroundColor: backgroundColor.toString(),
        });
      // }

      // const $text = $('<span>')
      //   .addClass(backgroundColor.isDark ? 'dark' : 'light')
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
