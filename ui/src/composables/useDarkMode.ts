import { ref, watch } from 'vue'

const isDarkMode = ref(false)

const initializeDarkMode = () => {
  const stored = localStorage.getItem('darkMode')
  if (stored !== null) {
    isDarkMode.value = JSON.parse(stored)
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  updateDarkModeClass()
}

const updateDarkModeClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

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
    initializeDarkMode,
  }
}
