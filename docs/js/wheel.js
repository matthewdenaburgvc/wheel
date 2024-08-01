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

$(document).ready(function() {
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

  var $peopleInput = $('#people-input');

  // add all of the people to the text area
  $peopleInput.val(function () {
    var names = [];

    // Iterate over the people array to extract names
    for (var i = 0; i < people.length; i++) {
      names.push(people[i].name);
    }

    // Join the names array into a string, separated by newline characters
    return names.join('\n');
  });

  const $wheel2 = $('#wheel2');
  const usedColors = [];
  let wheelAngle = 0;

  const randomColor = function() {
    const color = colorSpectrum[Math.floor(Math.random() * colorSpectrum.length)];

    if (usedColors.includes(color)) {
      return randomColor();
    }

    usedColors.push(color);
    return color;
  }

  const createWheelSlices = function() {
    const names = $peopleInput.val().split('\n').filter(Boolean);
    const numSlices = names.length;
    const angle = 360 / numSlices;
    $wheel2.empty();

    names.forEach((name, index) => {
      const $slice = $("<div>")
        .addClass("slice")
        .css({
          backgroundColor: randomColor(),
          transform: `rotate(${index * angle}deg)`,
          zIndex: numSlices - index,
        });
        const $text = $("<span>").text(name);
      $slice.append($text);
      $wheel2.append($slice);
    });
  }

  const makeWheelSquare = function() {
    var parentWidth = $wheel2.parent().width();
    var parentHeight = $wheel2.parent().height();
    var size = Math.min(parentWidth, parentHeight);
    $wheel2.css({
      width: size + 'px',
      height: size + 'px'
    });
  }

  const spinWheel = function() {
    wheelAngle += Math.floor(Math.random() * 360) + Math.floor(Math.random() * 2 + 1) * 360;
    $wheel2.css({
      transition: 'transform 1s ease-out',
      transform: `rotate(${wheelAngle}deg)`,
    });
    setTimeout(() => {
      $wheel2.css({transition: ''});
    }, 4000); // Reset animation
  }

  createWheelSlices();
  makeWheelSquare();
  darkModeToggler();

  $wheel2.click(spinWheel);
  // Event listener for the Go button to update the wheel
  $('#go-button').click(createWheelSlices);
  $(window).resize(makeWheelSquare);
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
  */
});

var spectrum = ['#A2395B', '#A63552', '#AA3149', '#AE2D40', '#B22937', '#A23A53', '#924B6F', '#825C8B', '#6F6DA7', '#A63570', '#AC2F5A', '#B22944', '#B8232E', '#C11C17', '#A72A37', '#8D3857', '#734677', '#575597', '#A6358C', '#B43B6A', '#C24148', '#D04726', '#DE5003', '#B84D24', '#924A45', '#6C4766', '#434187', '#A650A0', '#B55A80', '#C46460', '#D36E40', '#E27A1D', '#B26331', '#824C45', '#523559', '#1F1D6D', '#A660AC', '#B67288', '#C68464', '#D69640', '#E6AA19', '#BC892E', '#926843', '#684758', '#3B256D', '#A670B8', '#B8878E', '#CA9E64', '#DCB53A', '#EFCE10', '#C8A628', '#A17E40', '#7A5658', '#502E72', '#80529A', '#98777A', '#B09C5A', '#C8C13A', '#E0E61A', '#C8C13A', '#B09C5A', '#98777A', '#80529A', '#502E72', '#675860', '#7E824E', '#95AC3C', '#ACD62A', '#ABBD4D', '#AAA470', '#A98B93', '#A670B8', '#3B256D', '#4C4D60', '#5D7553', '#6E9D46', '#80C837', '#89AE54', '#929471', '#9B7A8E', '#A660AC', '#1F1D6D', '#2A3F5D', '#35614D', '#40833D', '#4CA82B', '#629248', '#787C65', '#8E6682', '#A650A0', '#434187', '#3B536E', '#336555', '#2B773C', '#228B22', '#43763C', '#646156', '#854C70', '#A6358C', '#575597', '#4A678D', '#3D7983', '#308B79', '#229F6E', '#43856E', '#646B6E', '#85516E', '#A63570', '#6F6DA7', '#5C7EA7', '#498FA7', '#36A0A7', '#20B2AA', '#409497', '#607684', '#805871', '#A2395B', '#7F91C3', '#789AC4', '#71A3C5', '#6AACC6', '#60B6CA', '#7493A6', '#887082', '#9C4D5E', '#B22937', '#71A3C5', '#79A9CD', '#81AFD5', '#89B5DD', '#93BDE7', '#9E95B3', '#A96D7F', '#B4454B', '#C11C17', '#60B6CA', '#67ADC9', '#6EA4C8', '#759BC7', '#7F91C3', '#968193', '#AD7163', '#C46133', '#DE5003', '#20B2AA', '#33A1AA', '#4690AA', '#597FAA', '#6F6DA7', '#8B7085', '#A77363', '#C37641', '#E27A1D', '#229F6E', '#2F8D78', '#3C7B82', '#49698C', '#575597', '#7A6A78', '#9D7F59', '#C0943A', '#E6AA19', '#228B22', '#2A793B', '#326754', '#3A556D', '#434187', '#6E646A', '#99874D', '#C4AA30', '#EFCE10', '#4CA82B', '#41863B', '#36644B', '#2B425B', '#1F1D6D', '#4F4F58', '#808244', '#B0B42F', '#E0E61A', '#80C837', '#6FA044', '#5E7851', '#4D505E', '#3B256D', '#57515C', '#747E4C', '#90AA3B', '#ACD62A'];
const colorSpectrum = Object.freeze(spectrum);
