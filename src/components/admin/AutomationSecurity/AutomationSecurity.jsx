import React, { useState } from 'react'
import {
  Shield,
  FileText,
  Settings,
  Bell,
  Loader2,
} from 'lucide-react'
import RoleBasedAccess from './RoleBasedAccess'
import AuditLogs from './AuditLogs'
import InvoiceSettings from './InvoiceSettings'
import SystemAlerts from './SystemAlerts'

const AutomationSecurity = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'rbac', label: 'Role-Based Access', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'invoices', label: 'Invoice Settings', icon: Settings },
    { id: 'alerts', label: 'System Alerts', icon: Bell },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading automation & security data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automation & Security
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Security controls, access management, audit trails, and system automation
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Overview - Show all sections */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <SystemAlerts />
            <RoleBasedAccess />
            <AuditLogs />
            <InvoiceSettings formatCurrency={formatCurrency} />
          </div>
        )}

        {/* Individual Sections */}
        {activeSection === 'rbac' && <RoleBasedAccess />}
        {activeSection === 'audit' && <AuditLogs />}
        {activeSection === 'invoices' && <InvoiceSettings formatCurrency={formatCurrency} />}
        {activeSection === 'alerts' && <SystemAlerts />}
      </div>
    </div>
  )
}

export default AutomationSecurity

