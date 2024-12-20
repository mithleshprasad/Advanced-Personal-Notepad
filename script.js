// Select DOM elements
const textarea = document.getElementById('notepad');
const wordCountElement = document.getElementById('wordCount');
const charCountElement = document.getElementById('charCount');
const clearButton = document.getElementById('clear');
const darkModeToggle = document.getElementById('darkModeToggle');
const downloadButton = document.getElementById('download');
const colorPicker = document.getElementById('colorPicker');
const autosaveNotification = document.getElementById('autosaveNotification');

// Functions

// Load initial settings
function loadSettings() {
  const savedNote = localStorage.getItem('notepadContent');
  const savedColor = localStorage.getItem('notepadColor');
  if (savedNote) textarea.value = savedNote;
  if (savedColor) {
    textarea.style.color = savedColor;
    colorPicker.value = savedColor;
  }
  updateStats();
}

// Update word and character counts
function updateStats() {
  const text = textarea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const characters = text.length;
  wordCountElement.textContent = `Words: ${words}`;
  charCountElement.textContent = `Characters: ${characters}`;
}

// Show autosave notification
function showAutosaveNotification() {
  autosaveNotification.style.display = 'block';
  setTimeout(() => (autosaveNotification.style.display = 'none'), 1000);
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notepadContent', textarea.value);
  showAutosaveNotification();
}

// Clear notes
function clearNotes() {
  textarea.value = '';
  localStorage.removeItem('notepadContent');
  updateStats();
  alert('Notes cleared!');
}

// Toggle dark mode
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode';
}

// Download notes as a text file
function downloadNotes() {
  const blob = new Blob([textarea.value], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'notes.txt';
  anchor.click();
}

// Change text color
function changeTextColor(event) {
  const selectedColor = event.target.value;
  textarea.style.color = selectedColor;
  localStorage.setItem('notepadColor', selectedColor);
}

// Event Listeners
textarea.addEventListener('input', saveNotes);
textarea.addEventListener('input', updateStats);
clearButton.addEventListener('click', clearNotes);
darkModeToggle.addEventListener('click', toggleDarkMode);
downloadButton.addEventListener('click', downloadNotes);
colorPicker.addEventListener('change', changeTextColor);

// Initialize app
loadSettings();
