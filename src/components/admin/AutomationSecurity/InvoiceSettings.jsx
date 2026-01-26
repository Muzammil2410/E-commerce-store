import React, { useState } from 'react'
import {
  FileText,
  Settings,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { invoiceSettingsData, invoiceStatusData } from './mockData'
import toast from 'react-hot-toast'

const InvoiceSettings = ({ formatCurrency }) => {
  const [settings, setSettings] = useState(invoiceSettingsData)
  const [showPreview, setShowPreview] = useState(false)

  const handleToggleAutoGenerate = () => {
    setSettings({ ...settings, autoGenerate: !settings.autoGenerate })
    toast.success(
      `Auto-invoice generation ${!settings.autoGenerate ? 'enabled' : 'disabled'}`
    )
  }

  const handleSaveSettings = () => {
    // In real app, this would call an API
    toast.success('Invoice settings saved')
  }

  const handleGenerateInvoice = (orderId) => {
    // In real app, this would call an API
    toast.success(`Invoice generation triggered for ${orderId}`)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      generated: {
        label: 'Generated',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
      failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
      },
    }
    const statusInfo = statusMap[status] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    )
  }

  const generatedCount = invoiceStatusData.filter((i) => i.status === 'generated').length
  const pendingCount = invoiceStatusData.filter((i) => i.status === 'pending').length
  const failedCount = invoiceStatusData.filter((i) => i.status === 'failed').length

  // Generate preview invoice number
  const previewInvoiceNumber = settings.invoiceNumberFormat
    .replace('{YYYY}', new Date().getFullYear().toString())
    .replace('{MM}', String(new Date().getMonth() + 1).padStart(2, '0'))
    .replace('{####}', String(settings.nextInvoiceNumber).padStart(4, '0'))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Generated</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {generatedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedCount}</p>
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Auto Invoice Generation Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Auto Generate Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto-Generate Invoices</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically generate invoices when orders are completed
              </p>
            </div>
            <button
              onClick={handleToggleAutoGenerate}
              className="relative"
            >
              {settings.autoGenerate ? (
                <ToggleRight className="w-12 h-12 text-green-600 dark:text-green-400" />
              ) : (
                <ToggleLeft className="w-12 h-12 text-gray-400" />
              )}
            </button>
          </div>

          {/* Invoice Number Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invoice Number Format
            </label>
            <input
              type="text"
              value={settings.invoiceNumberFormat}
              onChange={(e) => setSettings({ ...settings, invoiceNumberFormat: e.target.value })}
              placeholder="INV-{YYYY}-{MM}-{####}"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use {'{YYYY}'} for year, {'{MM}'} for month, {'{####}'} for sequential number
            </p>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
              <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                {previewInvoiceNumber}
              </p>
            </div>
          </div>

          {/* Next Invoice Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next Invoice Number
            </label>
            <input
              type="number"
              value={settings.nextInvoiceNumber}
              onChange={(e) =>
                setSettings({ ...settings, nextInvoiceNumber: parseInt(e.target.value) })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Invoice Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeTax}
                onChange={(e) => setSettings({ ...settings, includeTax: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include Tax Information</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeShipping}
                onChange={(e) =>
                  setSettings({ ...settings, includeShipping: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include Shipping Details</span>
            </label>
          </div>

          {/* Company Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Information
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={settings.companyInfo.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, name: e.target.value },
                  })
                }
                placeholder="Company Name"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                value={settings.companyInfo.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, address: e.target.value },
                  })
                }
                placeholder="Company Address"
                rows={2}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Template Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Template Preview
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
            {showPreview && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {settings.companyInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {settings.companyInfo.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        INVOICE
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{previewInvoiceNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Bill To:</p>
                      <p className="text-gray-900 dark:text-white">Customer Name</p>
                      <p className="text-gray-600 dark:text-gray-400">Customer Address</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Date:</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-b border-gray-200 dark:border-gray-600 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Items will appear here</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total:</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Invoice Status per Order */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invoice Status by Order
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Generated At
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invoiceStatusData.map((invoice) => (
                <tr
                  key={invoice.orderId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {invoice.orderId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.invoiceNumber ? (
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.generatedAt ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(invoice.generatedAt).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === 'generated' && invoice.downloadUrl && (
                        <button
                          onClick={() => toast.success('Invoice downloaded')}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {invoice.status !== 'generated' && (
                        <button
                          onClick={() => handleGenerateInvoice(invoice.orderId)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Generate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InvoiceSettings

