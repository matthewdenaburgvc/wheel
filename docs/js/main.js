import Wheel from "./wheel.js";

/**
 * Randomly shuffles the elements in an array in place.
 *
 * @param {Array} objects The array to be shuffled.
 * @returns {Array} The shuffled array.
 */
const shuffle = function(objects) {
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
 * Toggles between light and dark mode
 */
const darkModeToggler = function() {
  const darkThemeClass = 'dark-mode';
  const lightThemeClass = 'light-mode';
  const $themeToggle = $('#theme-toggle');

  /**
   * Apply the dark theme class to the body
   */
  const applyDarkMode = function() {
    $('body').addClass(darkThemeClass);
    localStorage.setItem('theme', darkThemeClass);
  }

  /**
   * Remove the dark theme class from the body
   */
  const removeDarkMode = function() {
    $('body').removeClass(darkThemeClass);
    localStorage.setItem('theme', lightThemeClass);
  }

  /**
   * Function to toggle dark mode
   */
  const toggleDarkMode = function() {
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

$(document).ready(function() {
  const names = []
  for (let i = 1; i <= 7; i++) {
    names.push(`Person ${i}`);
  }
  $(`#people-input`).val(names.join('\n'));

  new Wheel().init();

  darkModeToggler();

  // $('#go-button').click(wheel.draw());
  // $(window).resize(makeWheelSquare);
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

