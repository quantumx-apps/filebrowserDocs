const localMode = localStorage.getItem('theme');

// Default to dark mode if no preference is saved
if (localMode === null) {
  localStorage.setItem('theme', 'dark');
  document.documentElement.setAttribute('data-dark-mode', '');
}

// Apply saved preference
if (localMode === 'dark') {
  document.documentElement.setAttribute('data-dark-mode', '');
}

