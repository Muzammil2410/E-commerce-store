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
    { id: 'overview', label: 'Overview', icon: Shield, color: 'from-slate-500 to-gray-600' },
    { id: 'rbac', label: 'Role-Based Access', icon: Shield, color: 'from-indigo-500 to-blue-600' },
    { id: 'audit', label: 'Audit Logs', icon: FileText, color: 'from-teal-500 to-cyan-600' },
    { id: 'invoices', label: 'Invoice Settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
    { id: 'alerts', label: 'System Alerts', icon: Bell, color: 'from-red-500 to-rose-600' },
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
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900/20 dark:to-gray-900/20 rounded-2xl p-8 border border-slate-100 dark:border-slate-800/30 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 dark:from-slate-400 dark:to-gray-400 bg-clip-text text-transparent">
              Automation & Security
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 ml-14">
            Security controls, access management, audit trails, and system automation
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-slate-500/30 scale-105`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{section.label}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-white/20 blur-sm"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Overview - Show all sections */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <SystemAlerts />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <RoleBasedAccess />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <AuditLogs />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <InvoiceSettings formatCurrency={formatCurrency} />
            </div>
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

