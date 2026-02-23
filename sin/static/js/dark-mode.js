// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = darkModeToggle.querySelector('.dark-mode-icon');
  
  // Initialize localStorage if not set (default to light mode)
  if (localStorage.getItem('darkMode') === null) {
    localStorage.setItem('darkMode', 'false');
  }
  
  // Check if dark mode preference is saved
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Apply saved preference on page load
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  // Handle toggle button click
  darkModeToggle.addEventListener('click', function() {
    if (document.documentElement.classList.contains('dark-mode')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
  
  function enableDarkMode() {
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    darkModeIcon.textContent = '☀️';
  }
  
  function disableDarkMode() {
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    darkModeIcon.textContent = '🌙';
  }
});
