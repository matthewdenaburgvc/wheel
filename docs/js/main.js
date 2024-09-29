import Wheel from "./wheel.js";

/**
 * Toggles between light and dark mode
 */
const darkModeToggler = function() {
  const darkThemeClass = 'dark-mode';
  const lightThemeClass = 'light-mode';

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
  else {
    // still nothing, apply dark theme
    applyDarkMode()
  }

  return toggleDarkMode;
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
};

const shareUrl = function() {
  const names = $('#people-input').val().split('\n').map(encodeURIComponent).join('&name=');
  const url = new URL(window.location);
  url.searchParams.set('name', names);

  const shareableUrl = decodeURIComponent(url.href);

  navigator.clipboard.writeText(shareableUrl).then(function() {
    alert("Sharable URL copied to clipboard!");
  }, function() {
    alert("Failed to copy URL to clipboard.");
  });
};

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

const newWheel = function() {
  var $list = $('#people ul').empty(); // Clear existing list and select the ul

  const inputNames = $('#people-input').val().split('\n').filter(Boolean);
  inputNames.forEach((name, index) => {
    var $li = $('<li/>');
    var $checkbox = $('<input/>', {
      id: 'name_' + index,
      name: name,
      value: name,
      type: 'checkbox',
      checked: true,
    });
    var $label = $('<label/>', {
      for: 'name_' + index,
      text: name
    });

    $li.append($checkbox).append($label);
    $list.append($li);
  });

  $('#configure-people').hide();
  $('#people').show();

  Wheel.self.names = shuffle(inputNames);
  Wheel.self.init();
}

$(document).ready(function() {
  const names = shuffle(loadNamesFromUrl());
  if (names.length === 0) {
    for (let i = 1; i <= 6; i++) {
      names.push(`Person ${i}`);
    }
  }

  $("#save").on("click", shareUrl);
  $('#theme-toggle').on("click", darkModeToggler());
  $('#go-button').on("click", newWheel);

  $(`#people-input`).val(names.join('\n'));

  new Wheel(names).init();
});

