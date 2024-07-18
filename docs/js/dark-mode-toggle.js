$(document).ready(function() {
    const darkThemeClass = 'dark'; // The class Tailwind uses for dark mode when 'selector' is set
    const lightThemeClass = 'light';
    const themeToggleButton = $('#theme-toggle'); // Assuming you have a button with this ID for toggling theme
  
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
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If no saved preference, apply system preference
      applyDarkMode();
    }
  
    // Event listener for the theme toggle button
    themeToggleButton.click(toggleDarkMode);
  });