/**
 * Randomly shuffles the elements in an array in place.
 *
 * @param {Array} objects The array to be shuffled.
 * @returns {Array} The shuffled array.
 */
var shuffle = function(objects) {
  var jdx, item;

  // Loop over the array in reverse order
  for (var idx = objects.length; idx > 0; idx--) {
    // Generate a random index j
    jdx = parseInt(Math.random() * idx);

    // Swap elements at indices i-1 and j
    item = objects[idx - 1];
    objects[idx - 1] = objects[jdx];
    objects[jdx] = item;
  }

  return objects;
};

/**
 * Hash a string to a 32-bit integer
 *
 * @param {string} string the string to hash
 * @returns {number} the hash code of the string
 */
var hashCode = function (string) {
  // See http://www.cse.yorku.ca/~oz/hash.html
  var hash = 97;

  for (i = 0; i < string.length; i++) {
    var char = string.charCodeAt(i);
    hash = ((hash << 5) + hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Calculates the modulo of two numbers.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @returns {number} The modulo of `a` and `b`.
 */
var mod = function (a, b) {
  return ((a % b) + b) % b;
};

var buildPerson = function(name) {
  return {
    id: "id_" + hashCode(name),
    name: name,
    hash: hashCode(name),
  };
};

var people = (function() {
  let res = [];
  for (let i = 1; i <= 8; i++) {
    res.push(buildPerson(`Person ${i}`));
  }
  return res;
})();

var baseColors = {
  white: '#ffffff',
  gray_1: '#444444',
  gray_2: '#222222',
  black: '#000000',
};

var themeColors = {
  dark: {
    fill: baseColors.white,
    stroke: baseColors.gray_1,
    text: baseColors.white,
  },
  light: {
    fill: baseColors.gray_2,
    stroke: baseColors.gray_2,
    text: baseColors.black,
  },
}

class WheelSlice {
  static nextId = 0;
  static #svgNS = "http://www.w3.org/2000/svg";

  constructor(startAngleDegrees, endAngleDegrees, radius, text = null, fillColor = null) {
    this.radius = radius;
    this.fillColor = fillColor;
    this.text = text == null ? '' : text.trim();
    this.textColor = '#fff';

    // convert degrees to radians
    let startAngle = (startAngleDegrees * Math.PI) / 180;
    let endAngle = (endAngleDegrees * Math.PI) / 180;

    // build the start and end points, and then calculate the middle of each slice.
    this.start = {
      angle: startAngle,
      x: this.radius + this.radius * Math.cos(startAngle),
      y: this.radius + this.radius * Math.sin(startAngle),
    }
    this.end = {
      angle: endAngle,
      x: this.radius + this.radius * Math.cos(endAngle),
      y: this.radius + this.radius * Math.sin(endAngle),
    }
    this.mid = {
      angle: (startAngle + endAngle) / 2,
      x: this.radius / 2 + Math.cos((startAngle + endAngle) / 2),
      y: this.radius / 2 + Math.sin((startAngle + endAngle) / 2),
    }

    this.id = `wheel-slice-${WheelSlice.nextId++}`;
  };

  draw() {
    this.drawSlice();
    this.drawText();
    this.drawContent();

    return this.content;
  };

  drawText() {
    const calculatedFontSize = Math.max(this.radius / 10, 5);

    this.textPath = $(document.createElementNS(WheelSlice.#svgNS, 'textPath'))
      .attr('href', `#${this.id}`)
      .text(this.text);

    this.svgText = $(document.createElementNS(WheelSlice.#svgNS, 'text'))
      .attr('x', this.mid.x)
      .attr('y', this.mid.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('fill', this.textColor)
      .css('font-size', `${calculatedFontSize}px`)
      .append(this.textPath);
  };

  buildPathString() {
    // Use SVG arc to create the rounded effect
    let largeArcFlag = this.end.angle - this.start.angle <= Math.PI ? '0' : '1';

    let pathComponents = [];
    // Move to starting point without drawing anything
    pathComponents.push(`M ${this.radius},${this.radius}`);
    // Draw a line from the current position to `${startX},${startY}`
    pathComponents.push(`L ${this.start.x},${this.start.y}`);
    // Draw an arc...
    // - start at the current (startX, startY)
    // - The arc's X and Y radii are the same (`radius`)
    // - The 0 after the radii indicates the x-axis rotation, which is 0 degrees here, meaning there's no rotation.
    // - The `largeArcFlag` determines whether the arc should be greater than or less than 180 degrees (0 for < 180 degrees, 1 for > 180 degrees).
    // - The 1 after the largeArcFlag is the sweep flag, indicating counter clockwise
    // - The arc ends at `${endX},${endY}`
    pathComponents.push(`A ${this.radius},${this.radius} 0 ${largeArcFlag} 1 ${this.end.x},${this.end.y}`);
    // Close the path by drawing a line back to the starting point
    pathComponents.push(`Z`);

    return pathComponents.join(' ');
  };

  drawSlice() {
    const pathString = this.buildPathString()

    this.path = $(document.createElementNS(WheelSlice.#svgNS, 'path'))
      .attr('d', pathString)
      .attr('id', this.id)
      .attr('fill', this.fillColor);
  };

  drawContent() {
    if (this.path == null) {
      this.drawSlice();
    }
    if (this.svgText == null) {
      this.drawText();
    }

    this.content = $(document.createElementNS(WheelSlice.#svgNS, 'svg'))
      .attr('viewBox', `0 0 ${this.radius * 2} ${this.radius * 2}`)
      .addClass('wheel-slice')
      .append(this.path)
      .append(this.svgText);
  };
};

class Wheel {
  constructor(radius) {
    this.radius = radius;
    this.angle = 360;
    this.availableColors = [];
    this.people = [];
    this.slices = [];
  };

  init() {
    // reset available colors
    this.availableColors = colorSpectrum;

    this.updatePeople();
    this.updateTheme();
  };

  updatePeople() {
    // this.people = $("#people-input").val().split('\n').filter(Boolean);
    this.angle = 360 / people.length;
    this.people = shuffle(people);
  };

  updateTheme() {
    var theme = $('body').hasClass('dark-mode') ? themeColors.dark : themeColors.light;

    this.textColor = theme.text;
    this.borderColor = theme.stroke;
  };

  draw() {
    this.people.forEach((person, index) => {
      this.slices.push(this.drawSlice(person.name, index));
      console.log(index)
    });
  };

  getColor() {
    let color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];

    // remove the color from the available colors
    this.availableColors = this.availableColors.filter(c => c !== color);
    return color;
  };

  drawSlice(person, index) {
    let startAngle = this.angle * index;
    let endAngle = startAngle + this.angle;

    let slice = new WheelSlice(startAngle, endAngle, this.radius, person, this.getColor());
    slice.draw();
    return slice;
  };
};

$(document).ready(function() {
  // add all of the people to the text area
  $('#people-input').val(function () {
    var names = [];

    // Iterate over the people array to extract names
    for (var i = 0; i < people.length; i++) {
      names.push(people[i].name);
    }

    // Join the names array into a string, separated by newline characters
    return names.join('\n');
  });

  var $wheel = $('#wheel');
  var wheel = new Wheel(50);
  wheel.init();
  wheel.draw();
  console.log(wheel.slices);

  wheel.slices.forEach(slice => {
    $wheel.append(slice.content);
  });

  // Event listener for the Go button to update the wheel
  $('#go-button').click(function() {
    buildWheel();
  });

  $wheel.click(function() {
    $(this).css({
      animation: 'spin 4s linear',
    });
    setTimeout(() => {
      $(this).css({animation: ''});
    }, 4000); // Reset animation
  });

  darkModeToggler();

  /*
  // show the checkboxes
  $('#go-button').click(function() {
    var inputNames = $('#people-input').val().split('\n');
    var $list = $('#people ul').empty(); // Clear existing list and select the ul

    $.each(inputNames, function(i, name) {
      if (name.trim() !== '') { // Ignore empty lines
        var hash = hashCode(name);

        var $li = $('<li/>');
        var $checkbox = $('<input/>', {
          id: 'name_' + hash, // Ensure unique ID
          name: name,
          value: name,
          type: 'checkbox',
          checked: true,
        });
        var $label = $('<label/>', {
          for: 'name_' + hash,
          text: name
        });
        people.pop(buildName(name));

        $li.append($checkbox).append($label);
        $list.append($li);
      }
    });

    $('#configure-people').hide();
    $('#people').show();
  });

  // hide the checkboxes and show the textarea
  $('#edit-button').click(function() {
    var $list = $("#people ul li");

    people = $list
      .map(function() {
        return $(this).find('input').val();
      })
      .get();
      // .map(buildName); // TODO

    // Show the configure div and hide the people list
    $('#configure-people').show();
    $('#people').hide();
  });

  var peopleContainer = $('#people ul');
  people.forEach(function (person) {
    var name = person.name;

    peopleContainer.append(
      $('<li/>').append(
        $('<input/>').attr({
          id: 'name_' + hashCode(name),
          name: name,
          value: name,
          type: 'checkbox',
          checked: true
        }).change(function () {
          var cbox = $(this)[0];
          var segments = wheel.segments;
          var i = segments.indexOf(cbox.value);

          if (cbox.checked && i == -1) {
            segments.push(cbox.value);
          }
          else if (!cbox.checked && i != -1) {
            segments.splice(i, 1);
          }

          segments.sort();
          wheel.update();
        })
      ).append(
        $(document.createElement('label')).attr(
          {
            'for': 'name_' + hashCode(name),
          }
        ).text(name)
      )
    );
  });

  $('#people ul>li').tsort(
    'input', { attr: 'value' }
  );

  var segments = [];
  $.each($('#people input:checked'), function (key, cbox) {
    segments.push(cbox.value);
  });

  wheel.segments = segments;
  wheel.init();
  wheel.update();

  // Hide the address bar (for mobile devices)!
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
  */
});

var spectrum = ['#A2395B', '#A63552', '#AA3149', '#AE2D40', '#B22937', '#A23A53', '#924B6F', '#825C8B', '#6F6DA7', '#A63570', '#AC2F5A', '#B22944', '#B8232E', '#C11C17', '#A72A37', '#8D3857', '#734677', '#575597', '#A6358C', '#B43B6A', '#C24148', '#D04726', '#DE5003', '#B84D24', '#924A45', '#6C4766', '#434187', '#A650A0', '#B55A80', '#C46460', '#D36E40', '#E27A1D', '#B26331', '#824C45', '#523559', '#1F1D6D', '#A660AC', '#B67288', '#C68464', '#D69640', '#E6AA19', '#BC892E', '#926843', '#684758', '#3B256D', '#A670B8', '#B8878E', '#CA9E64', '#DCB53A', '#EFCE10', '#C8A628', '#A17E40', '#7A5658', '#502E72', '#80529A', '#98777A', '#B09C5A', '#C8C13A', '#E0E61A', '#C8C13A', '#B09C5A', '#98777A', '#80529A', '#502E72', '#675860', '#7E824E', '#95AC3C', '#ACD62A', '#ABBD4D', '#AAA470', '#A98B93', '#A670B8', '#3B256D', '#4C4D60', '#5D7553', '#6E9D46', '#80C837', '#89AE54', '#929471', '#9B7A8E', '#A660AC', '#1F1D6D', '#2A3F5D', '#35614D', '#40833D', '#4CA82B', '#629248', '#787C65', '#8E6682', '#A650A0', '#434187', '#3B536E', '#336555', '#2B773C', '#228B22', '#43763C', '#646156', '#854C70', '#A6358C', '#575597', '#4A678D', '#3D7983', '#308B79', '#229F6E', '#43856E', '#646B6E', '#85516E', '#A63570', '#6F6DA7', '#5C7EA7', '#498FA7', '#36A0A7', '#20B2AA', '#409497', '#607684', '#805871', '#A2395B', '#7F91C3', '#789AC4', '#71A3C5', '#6AACC6', '#60B6CA', '#7493A6', '#887082', '#9C4D5E', '#B22937', '#71A3C5', '#79A9CD', '#81AFD5', '#89B5DD', '#93BDE7', '#9E95B3', '#A96D7F', '#B4454B', '#C11C17', '#60B6CA', '#67ADC9', '#6EA4C8', '#759BC7', '#7F91C3', '#968193', '#AD7163', '#C46133', '#DE5003', '#20B2AA', '#33A1AA', '#4690AA', '#597FAA', '#6F6DA7', '#8B7085', '#A77363', '#C37641', '#E27A1D', '#229F6E', '#2F8D78', '#3C7B82', '#49698C', '#575597', '#7A6A78', '#9D7F59', '#C0943A', '#E6AA19', '#228B22', '#2A793B', '#326754', '#3A556D', '#434187', '#6E646A', '#99874D', '#C4AA30', '#EFCE10', '#4CA82B', '#41863B', '#36644B', '#2B425B', '#1F1D6D', '#4F4F58', '#808244', '#B0B42F', '#E0E61A', '#80C837', '#6FA044', '#5E7851', '#4D505E', '#3B256D', '#57515C', '#747E4C', '#90AA3B', '#ACD62A'];
var colorSpectrum = Object.freeze(spectrum);

// $(window).resize(wheel.update);

/** Toggles between light and dark mode */
var darkModeToggler = function() {
  const darkThemeClass = 'dark-mode';
  const lightThemeClass = 'light-mode';
  const $themeToggle = $('#theme-toggle');

  function applyDarkMode() {
    $('body').addClass(darkThemeClass);
    // wheel.draw();
    localStorage.setItem('theme', darkThemeClass);
  }

  function removeDarkMode() {
    $('body').removeClass(darkThemeClass);
    // wheel.draw();
    localStorage.setItem('theme', lightThemeClass);
  }

  // Function to toggle dark mode
  function toggleDarkMode() {
    if ($('body').hasClass(darkThemeClass)) {
      removeDarkMode();
    } else {
      applyDarkMode();
    }
  }

  // Check for a saved user preference, and apply it
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === darkThemeClass) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If no saved preference, apply system preference
    applyDarkMode();
  }

  // Event listener for the theme toggle button
  $themeToggle.click(toggleDarkMode);
};
