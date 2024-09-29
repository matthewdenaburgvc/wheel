import Wheel from "./wheel.js";

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
  $themeToggle.on("click", toggleDarkMode);
};

const loadNamesFromUrl = function() {
  const getUrlParameters = function(name) {
    const params = new URLSearchParams(window.location.search);
    return params.getAll(name);
  };

  const getNames = function(urlParam) {
    return getUrlParameters(urlParam).map(decodeURIComponent);
  }

  return getNames("name");
}


$(document).ready(function() {
  const names = loadNamesFromUrl();
  if (names.length === 0) {
    for (let i = 1; i <= 6; i++) {
      names.push(`Person ${i}`);
    }
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

