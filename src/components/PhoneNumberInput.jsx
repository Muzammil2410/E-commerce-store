'use client'
import { useState, useEffect, useMemo } from 'react'
import { parsePhoneNumber, isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { ChevronDown, Check, X } from 'lucide-react'

const PhoneNumberInput = ({ value, onChange, onValidationChange, placeholder = "Enter phone number" }) => {
  const [selectedCountry, setSelectedCountry] = useState('PK') // Default to Pakistan
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [e164Format, setE164Format] = useState('')
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholder)

  // Build full country list dynamically from libphonenumber-js
  const countries = useMemo(() => {
    const getFlagEmoji = (countryCode) => {
      if (!countryCode) return '🏳️'
      // Convert country code letters to regional indicator symbols
      return String.fromCodePoint(
        ...countryCode
          .toUpperCase()
          .split('')
          .map((char) => 127397 + char.charCodeAt(0))
      )
    }

    let regionNames
    try {
      // Use browser locale for country display names when available
      // Fallback to 'en' if navigator.language is not available
      const locale = (typeof navigator !== 'undefined' && navigator.language) ? [navigator.language] : ['en']
      // Some environments might not support Intl.DisplayNames
      // eslint-disable-next-line no-undef
      regionNames = typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
        ? new Intl.DisplayNames(locale, { type: 'region' })
        : null
    } catch (e) {
      regionNames = null
    }

    const countryCodes = (typeof getCountries === 'function') ? getCountries() : []

    const list = countryCodes.map((code) => {
      let callingCode = ''
      try {
        callingCode = `+${getCountryCallingCode(code)}`
      } catch (e) {
        callingCode = ''
      }

      const name = (() => {
        try {
          return regionNames ? regionNames.of(code) : code
        } catch (e) {
          return code
        }
      })()

      return {
        code,
        name,
        flag: getFlagEmoji(code),
        callingCode
      }
    })
      // Filter out entries without a calling code
      .filter((c) => !!c.callingCode)
      // Sort alphabetically by localized name
      .sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [])

  // Example national number formats per country (not including calling code)
  const EXAMPLE_NUMBERS = useMemo(() => ({
    'PK': '0300 1234567',
    'US': '(201) 555-0123',
    'GB': '07123 456789',
    'IN': '98765 43210',
    'AE': '050 123 4567',
    'CA': '(204) 234-5678',
    'AU': '0412 345 678',
    'DE': '01512 3456789',
    'FR': '06 12 34 56 78',
    'IT': '312 345 6789',
    'ES': '612 345 678',
    'BR': '11 91234-5678',
    'CN': '131 2345 6789',
    'JP': '090-1234-5678',
    'KR': '010-1234-5678',
    'SA': '050 123 4567',
    'EG': '0100 123 4567',
    'TR': '0501 234 5678',
    'RU': '912 345-67-89',
    'MX': '55 1234 5678'
  }), [])

  // Initialize phone number from props
  useEffect(() => {
    if (value) {
      try {
        const parsed = parsePhoneNumber(value)
        if (parsed) {
          setSelectedCountry(parsed.country)
          setPhoneNumber(parsed.nationalNumber)
          setE164Format(parsed.format('E.164'))
        }
      } catch (error) {
        // If parsing fails, use the value as is
        setPhoneNumber(value)
      }
    }
  }, [value])

  // Validate phone number when country or number changes
  useEffect(() => {
    validatePhoneNumber()
  }, [selectedCountry, phoneNumber])

  // Update placeholder when country changes
  useEffect(() => {
    const example = EXAMPLE_NUMBERS[selectedCountry]
    const country = countries.find(c => c.code === selectedCountry)
    if (example) {
      setDynamicPlaceholder(`e.g., ${example}`)
    } else if (country?.callingCode) {
      setDynamicPlaceholder(`e.g., ${country.callingCode} 123 456 789`)
    } else {
      setDynamicPlaceholder('e.g., 123 456 789')
    }
  }, [selectedCountry, countries, EXAMPLE_NUMBERS])

  const validatePhoneNumber = () => {
    if (!phoneNumber.trim()) {
      setIsValid(false)
      setValidationMessage('')
      setE164Format('')
      onValidationChange?.(false, '')
      return
    }

    try {
      // Create full phone number with country code
      const fullNumber = `+${getCountryCallingCode(selectedCountry)}${phoneNumber.replace(/^0+/, '')}`
      
      // Validate the phone number
      const isValidNumber = isValidPhoneNumber(fullNumber, selectedCountry)
      
      if (isValidNumber) {
        const parsed = parsePhoneNumber(fullNumber)
        setIsValid(true)
        setE164Format(parsed.format('E.164'))
        
        // Country-specific validation messages
        const messages = {
          'PK': 'Valid Pakistan phone number (11 digits)',
          'US': 'Valid US phone number (10 digits)',
          'GB': 'Valid UK phone number',
          'IN': 'Valid India phone number (10 digits)',
          'AE': 'Valid UAE phone number',
          'CA': 'Valid Canada phone number (10 digits)',
          'AU': 'Valid Australia phone number',
          'DE': 'Valid Germany phone number',
          'FR': 'Valid France phone number',
          'IT': 'Valid Italy phone number',
          'ES': 'Valid Spain phone number',
          'BR': 'Valid Brazil phone number',
          'CN': 'Valid China phone number',
          'JP': 'Valid Japan phone number',
          'KR': 'Valid South Korea phone number',
          'SA': 'Valid Saudi Arabia phone number',
          'EG': 'Valid Egypt phone number',
          'TR': 'Valid Turkey phone number',
          'RU': 'Valid Russia phone number',
          'MX': 'Valid Mexico phone number'
        }
        
        setValidationMessage(messages[selectedCountry] || 'Valid phone number')
        onValidationChange?.(true, parsed.format('E.164'))
      } else {
        setIsValid(false)
        setE164Format('')
        
        // Country-specific error messages
        const errorMessages = {
          'PK': 'Invalid Pakistan phone number. Must be 11 digits (e.g., 03001234567 or +923001234567)',
          'US': 'Invalid US phone number. Must be 10 digits (e.g., 5551234567)',
          'GB': 'Invalid UK phone number. Check the format',
          'IN': 'Invalid India phone number. Must be 10 digits (e.g., 9876543210)',
          'AE': 'Invalid UAE phone number. Check the format',
          'CA': 'Invalid Canada phone number. Must be 10 digits',
          'AU': 'Invalid Australia phone number. Check the format',
          'DE': 'Invalid Germany phone number. Check the format',
          'FR': 'Invalid France phone number. Check the format',
          'IT': 'Invalid Italy phone number. Check the format',
          'ES': 'Invalid Spain phone number. Check the format',
          'BR': 'Invalid Brazil phone number. Check the format',
          'CN': 'Invalid China phone number. Check the format',
          'JP': 'Invalid Japan phone number. Check the format',
          'KR': 'Invalid South Korea phone number. Check the format',
          'SA': 'Invalid Saudi Arabia phone number. Check the format',
          'EG': 'Invalid Egypt phone number. Check the format',
          'TR': 'Invalid Turkey phone number. Check the format',
          'RU': 'Invalid Russia phone number. Check the format',
          'MX': 'Invalid Mexico phone number. Check the format'
        }
        
        setValidationMessage(errorMessages[selectedCountry] || 'Invalid phone number format')
        onValidationChange?.(false, '')
      }
    } catch (error) {
      setIsValid(false)
      setValidationMessage('Invalid phone number format')
      setE164Format('')
      onValidationChange?.(false, '')
    }
  }

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value
    // Remove any non-digit characters except + at the beginning
    const cleanValue = inputValue.replace(/[^\d]/g, '')
    setPhoneNumber(cleanValue)
    
    // Call parent onChange with the clean value
    onChange?.(cleanValue)
  }

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode)
    setIsDropdownOpen(false)
  }

  const getSelectedCountry = () => {
    return countries.find(country => country.code === selectedCountry)
  }

  const formatPhoneNumber = (number) => {
    if (!number) return ''
    
    // For Pakistan, format as 0300-123-4567
    if (selectedCountry === 'PK' && number.length >= 4) {
      return number.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    
    // For US/Canada, format as (555) 123-4567
    if ((selectedCountry === 'US' || selectedCountry === 'CA') && number.length >= 6) {
      return number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    }
    
    // For other countries, just return the number
    return number
  }

  return (
    <div className="space-y-2">
      <div className="flex">
        {/* Country Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
          >
            <span className="text-lg">{getSelectedCountry()?.flag}</span>
            <span className="text-sm font-medium">{getSelectedCountry()?.callingCode}</span>
            <ChevronDown size={16} className="text-gray-400 dark:text-gray-400 transition-colors duration-300" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 max-h-60 overflow-y-auto transition-colors duration-300">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryChange(country.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ${
                    selectedCountry === country.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{country.callingCode}</span>
                  {selectedCountry === country.code && <Check size={16} className="text-blue-600 dark:text-blue-400 transition-colors duration-300" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={formatPhoneNumber(phoneNumber)}
          onChange={handlePhoneChange}
          placeholder={dynamicPlaceholder}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
        />
      </div>

      {/* Example format helper */}
      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
        Example: {getSelectedCountry()?.callingCode} {EXAMPLE_NUMBERS[selectedCountry] || '123 456 7890'}
      </p>

      {/* Validation Message */}
      {validationMessage && (
        <div className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
          isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isValid ? (
            <Check size={16} className="text-green-600 dark:text-green-400 transition-colors duration-300" />
          ) : (
            <X size={16} className="text-red-600 dark:text-red-400 transition-colors duration-300" />
          )}
          <span>{validationMessage}</span>
        </div>
      )}

    </div>
  )
}

export default PhoneNumberInput
