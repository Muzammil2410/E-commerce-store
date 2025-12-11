/**
 * DARK MODE USAGE EXAMPLES
 * 
 * This file demonstrates how to use the ThemeContext in your components.
 * Copy and adapt these patterns to your components.
 */

import { useTheme } from '@/contexts/ThemeContext'

// ============================================
// Example 1: Basic Component with Dark Mode
// ============================================
export function ExampleCard() {
  const { isDarkMode, theme } = useTheme()

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-2 transition-colors duration-300">
        Example Card
      </h2>
      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Current theme: {theme}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors duration-300">
        Dark mode is {isDarkMode ? 'enabled' : 'disabled'}
      </p>
    </div>
  )
}

// ============================================
// Example 2: Button Component
// ============================================
export function ExampleButton() {
  const { isDarkMode } = useTheme()

  return (
    <button className="bg-blue-600 dark:bg-blue-500 text-white dark:text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 shadow-md dark:shadow-gray-900/50">
      Click Me
    </button>
  )
}

// ============================================
// Example 3: Product Card with Dark Mode
// ============================================
export function ExampleProductCard({ product }) {
  const { theme } = useTheme()

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 transition-all duration-300">
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300">
        <span className="text-gray-400 dark:text-gray-500">Image</span>
      </div>
      <h3 className="text-gray-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 transition-colors duration-300">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg transition-colors duration-300">
          ${product.price}
        </span>
        <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// ============================================
// Example 4: Navbar with Theme Toggle
// ============================================
export function ExampleNavbar() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          My App
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

// ============================================
// Example 5: Using CSS Variables
// ============================================
export function ExampleWithCSSVariables() {
  return (
    <div 
      className="p-6 rounded-lg transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-border-primary)'
      }}
    >
      <h2 style={{ color: 'var(--color-text-primary)' }}>
        Using CSS Variables
      </h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        This component uses CSS custom properties that automatically switch with the theme.
      </p>
    </div>
  )
}

// ============================================
// COMMON DARK MODE CLASSES REFERENCE
// ============================================
/*
Backgrounds:
- bg-white dark:bg-gray-900
- bg-gray-50 dark:bg-gray-800
- bg-gray-100 dark:bg-gray-700

Text:
- text-gray-900 dark:text-white
- text-gray-700 dark:text-gray-300
- text-gray-600 dark:text-gray-400
- text-gray-500 dark:text-gray-500

Borders:
- border-gray-200 dark:border-gray-700
- border-gray-300 dark:border-gray-600

Buttons:
- bg-blue-600 dark:bg-blue-500
- hover:bg-blue-700 dark:hover:bg-blue-600

Shadows:
- shadow-md dark:shadow-gray-900/50

Transitions:
- transition-colors duration-300
- transition-all duration-300
*/

