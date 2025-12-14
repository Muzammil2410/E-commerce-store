'use client'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Privacy Policy</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 sm:p-8 transition-colors duration-200">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              Welcome to Zizla ("we," "our," or "us"). This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our services. 
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the site.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">Personal Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-200">
              <li>Register for an account</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">Automatically Collected Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              We may automatically collect certain information about your device and usage patterns, 
              including your IP address, browser type, operating system, pages visited, and time spent on our site.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">3. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-200">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
              We do not sell, trade, or otherwise transfer your personal information to third parties except:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-200">
              <li>With your explicit consent</li>
              <li>To trusted service providers who assist us in operating our website</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">5. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              We use cookies and similar tracking technologies to enhance your browsing experience, 
              analyze site traffic, and personalize content. You can control cookie settings through 
              your browser preferences.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">7. Your Rights and Choices</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-200">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">8. Third-Party Links</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices or content of these external sites. We encourage you to review the 
              privacy policies of any third-party sites you visit.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">9. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">10. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your personal information in 
              accordance with this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              Your continued use of our services after any modifications constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">12. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 transition-colors duration-200">
              <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200"><strong>Email:</strong> privacy@zizla.com</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200"><strong>Phone:</strong> +1-212-456-7890</p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200"><strong>Address:</strong> 794 Francisco, 94102</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8 transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                This Privacy Policy is effective as of January 2025 and will remain in effect except with 
                respect to any changes in its provisions in the future, which will be in effect immediately 
                after being posted on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
