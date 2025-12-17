'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to light mode
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') {
        return saved === 'dark'
      }
      // Fallback to old localStorage key for backward compatibility
      const oldSaved = localStorage.getItem('darkMode')
      if (oldSaved === 'true' || oldSaved === 'false') {
        return oldSaved === 'true'
      }
    }
    return false // Default to light mode
  })

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement
    
    if (isDarkMode) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
      // Also save old key for backward compatibility
      localStorage.setItem('darkMode', isDarkMode.toString())
    }
  }, [isDarkMode])

  // Apply initial theme on mount to prevent flash
  useEffect(() => {
    const root = document.documentElement
    
    // Get initial state
    const saved = localStorage.getItem('theme') || localStorage.getItem('darkMode')
    const initialDarkMode = saved === 'dark' || saved === 'true'
    
    // Apply immediately before React renders
    if (initialDarkMode) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev
      const root = document.documentElement
      
      // Immediately apply to DOM for instant visual feedback
      if (newValue) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
      
      // Save immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newValue ? 'dark' : 'light')
        localStorage.setItem('darkMode', newValue.toString())
      }
      
      return newValue
    })
  }

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Export for backward compatibility
export const useDarkMode = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  return { isDarkMode, toggleDarkMode: toggleTheme }
}

