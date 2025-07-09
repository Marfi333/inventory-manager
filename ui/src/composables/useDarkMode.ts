import { ref, watch } from 'vue'

const isDarkMode = ref(false)

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = () => {
  const stored = localStorage.getItem('darkMode')
  if (stored !== null) {
    isDarkMode.value = JSON.parse(stored)
  } else {
    // Fallback to system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Apply the class to document
  updateDarkModeClass()
}

// Update the dark class on document element
const updateDarkModeClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Watch for changes and persist to localStorage
watch(isDarkMode, (newValue) => {
  localStorage.setItem('darkMode', JSON.stringify(newValue))
  updateDarkModeClass()
})

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode,
    toggleDarkMode,
    initializeDarkMode
  }
} 