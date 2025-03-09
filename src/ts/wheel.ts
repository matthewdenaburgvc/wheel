import $ from "jquery";
import Sector from './sector';
import confetti from 'canvas-confetti';

class Wheel {
  static self: Wheel;

  /** the slices on the wheel */
  private _sectors: Array<Sector> = [];
  private _radius: number = 100;
  private _content: JQuery = $('<div>').attr('id', 'wheel');

  names: Array<string> = [];

  /** Create a new Wheel */
  constructor(names: Array<string> = []) {
    if (Wheel.self) {
      return Wheel.self;
    }

    this.names = names || [];
    this._radius = 100;

    Wheel.self = this;
  }

  /** Initialize the wheel */
  init(): this {
    $("#wheel-container").empty();

    this._sectors = [];
    this._content = $('<div>').attr('id', 'wheel');

    $("#wheel-container").append(this._content);

    this.draw();

    this._content.on("click", this.spin.bind(this));
    $("#winner-overlay").on("click", this.hideWinnerOverlay.bind(this));
    $(window).on("resize", this.draw.bind(this));

    return this;
  }

  /** Draw the wheel */
  draw(): this {
    this.resize();
    if (this._sectors.length === 0) {
      this.createSlices();
    }

    this.drawSlices();

    return this;
  }

  /** Resize the wheel */
  private resize(): this {
    let parentWidth: number = this._content.parent().width() || 100;
    let parentHeight: number = this._content.parent().height() || 100;

    this._radius = Math.min(parentWidth, parentHeight);
    this._radius = Math.round(this._radius);

    this._content.css({
      width: this._radius + 'px',
      height: this._radius + 'px'
    });

    return this;
  }

  /** Create the slices */
  private createSlices(): this {
    const sectorAngle = 360 / this.names.length;

    this.names.forEach((name: string, index: number) => {
      const angle = index * sectorAngle;
      const sector = new Sector(Math.floor(angle), name);
      this._sectors.push(sector);
    });

    return this;
  }

  private drawSlices(): this {
    this._content.empty();

    const sectorAngle = 360 / this._sectors.length;
    Sector.setCount(this._sectors.length);

    this._sectors.forEach((sector, index) => {
      let angle = index * sectorAngle - sectorAngle / 2;
      sector.finalAngle = sectorAngle;
      sector.radius = this._radius;

      // if there is only one sector, make it a full circle
      if (this._sectors.length === 1) {
        sector.finalAngle = 359.9999;
        angle = 0;
      }

      this._content.append(
        sector.toHtml().css({
          // rotate the sector to the correct angle
          transform: `rotate(${angle}deg)`,
        })
      );
    });

    return this;
  }

  /** Spin the wheel */
  private spin(): this {
    const count = this._sectors.length;
    // select random sector
    const index = Math.floor(Math.random() * count)
    // do at most 3 rotations, and stop at that sector's angle
    const angle = Math.floor(Math.random() * 2 + 1) * 360 - 360 / count * index;

    this._content.css({
      transition: 'transform 1.5s ease-out',
      transform: `rotate(${angle}deg)`,
    });

    setTimeout(() => {
      // stop rotation
      this._content.css({
        transition: 'none',
      });

      // remove selected person
      this.showWinnerOverlay(index);
    }, 1500); // Reset animation

    return this;
  }

  /** Show the winner
   * @param {number} index - the index of the winner
   */
  private showWinnerOverlay(index: number): this {
    // add the winner to the overlay
    $("#winner-name").text(this._sectors[index].text);
    // show the overlay
    $("#winner-overlay").show();

    // show confetti
    confetti({
      shapes: ['star'],
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // remove the winner from the wheel
    this._sectors.splice(index, 1);

    return this;
  }

  private hideWinnerOverlay(): this {
    // reset the wheel angle
    this._content.css({
      transition: 'transform',
      transform: 'rotate(0deg)',
    });

    // hide the overlay
    $("#winner-overlay").hide();

    // redraw the wheel
    this.drawSlices();

    return this;
  }
}

export default Wheel;
