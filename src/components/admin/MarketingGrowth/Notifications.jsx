import React, { useState } from 'react'
import {
  Bell,
  Mail,
  Smartphone,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  Filter,
  Users,
  Star,
  Repeat,
} from 'lucide-react'
import { notificationsData } from './mockData'
import toast from 'react-hot-toast'

const Notifications = () => {
  const [filter, setFilter] = useState('all') // all, sent, scheduled
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email',
    targetAudience: 'all',
    scheduledDate: '',
  })

  const filteredNotifications = notificationsData.filter((notif) => {
    if (filter === 'all') return true
    return notif.status === filter
  })

  const getStatusBadge = (status) => {
    const statusMap = {
      sent: {
        label: 'Sent',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      scheduled: {
        label: 'Scheduled',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
    }
    const statusInfo = statusMap[status] || statusMap.sent
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

  const getTypeIcon = (type) => {
    return type === 'email' ? Mail : Smartphone
  }

  const getTargetAudienceLabel = (audience) => {
    const labels = {
      all: 'All Users',
      vip: 'VIP Customers',
      repeat: 'Repeat Buyers',
      specific: 'Specific Users',
    }
    return labels[audience] || audience
  }

  const handleCreate = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    // In real app, this would call an API
    toast.success('Notification campaign created')
    setShowCreateModal(false)
    setFormData({
      title: '',
      message: '',
      type: 'email',
      targetAudience: 'all',
      scheduledDate: '',
    })
  }

  const sentCount = notificationsData.filter((n) => n.status === 'sent').length
  const scheduledCount = notificationsData.filter((n) => n.status === 'scheduled').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {notificationsData.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
            <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{sentCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {scheduledCount}
          </p>
        </div>
      </div>

      {/* Actions & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'sent', 'scheduled'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Push & Email Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const TypeIcon = getTypeIcon(notif.type)

            return (
              <div
                key={notif.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TypeIcon className="w-5 h-5 text-gray-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {getStatusBadge(notif.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {getTargetAudienceLabel(notif.targetAudience)}
                      </span>
                      <span>•</span>
                      <span>
                        {notif.status === 'sent'
                          ? `Sent: ${new Date(notif.sentDate).toLocaleString()}`
                          : `Scheduled: ${new Date(notif.scheduledDate).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {notif.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recipients</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notif.recipients.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open Rate</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notif.openRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Click Rate</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notif.clickRate}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Notification Campaign
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="New Year Sale - 25% Off"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Start the new year with amazing savings!"
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notification Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="vip">VIP Customers</option>
                  <option value="repeat">Repeat Buyers</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Schedule Date (leave empty to send now)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({
                    title: '',
                    message: '',
                    type: 'email',
                    targetAudience: 'all',
                    scheduledDate: '',
                  })
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications

