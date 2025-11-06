'use client'
import { useState } from 'react'
import PhoneNumberInput from './PhoneNumberInput'

const PhoneValidationDemo = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [validationResult, setValidationResult] = useState({ isValid: false, e164Format: '' })

  const handlePhoneChange = (value) => {
    setPhoneNumber(value)
  }

  const handleValidationChange = (isValid, e164Format) => {
    setValidationResult({ isValid, e164Format })
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Phone Number Validation Demo
      </h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Country-Specific Phone Validation
          </h2>
          <p className="text-gray-600 mb-6">
            Select a country and enter a phone number. The validation will automatically adjust 
            based on the selected country's phone number format.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <PhoneNumberInput
            value={phoneNumber}
            onChange={handlePhoneChange}
            onValidationChange={handleValidationChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Validation Results</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                validationResult.isValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {validationResult.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            
            {validationResult.e164Format && (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">E.164 Format:</span>
                <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {validationResult.e164Format}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Country Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🇵🇰 Pakistan</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• 03001234567</li>
                <li>• +923001234567</li>
                <li>• 11 digits total</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🇺🇸 United States</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• 5551234567</li>
                <li>• +15551234567</li>
                <li>• 10 digits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🇬🇧 United Kingdom</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• 7700123456</li>
                <li>• +447700123456</li>
                <li>• Various formats</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🇮🇳 India</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• 9876543210</li>
                <li>• +919876543210</li>
                <li>• 10 digits</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Features</h3>
          <ul className="text-yellow-700 space-y-2">
            <li>✅ Country-specific validation rules</li>
            <li>✅ Real-time validation feedback</li>
            <li>✅ E.164 format conversion</li>
            <li>✅ Visual validation indicators</li>
            <li>✅ Country flag and calling code display</li>
            <li>✅ Automatic formatting</li>
            <li>✅ 20+ countries supported</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PhoneValidationDemo
