var darkModeToggler = function() {
  const darkThemeClass = 'dark-mode';
  const lightThemeClass = 'light-mode';
  const $themeToggle = $('#theme-toggle');

  // Function to apply the dark mode class
  function applyDarkMode() {
    $('body').addClass(darkThemeClass);
    localStorage.setItem('theme', darkThemeClass);
  }

  // Function to remove the dark mode class
  function removeDarkMode() {
    $('body').removeClass(darkThemeClass);
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

$(document).ready(function() {
  darkModeToggler();
});
