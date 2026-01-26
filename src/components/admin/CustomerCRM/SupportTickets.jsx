import React, { useState, useMemo } from 'react'
import {
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Edit,
  Plus,
  Send,
} from 'lucide-react'
import { supportTicketsData } from './mockData'
import toast from 'react-hot-toast'

const SupportTickets = () => {
  const [filter, setFilter] = useState('all') // all, open, in-progress, resolved
  const [priorityFilter, setPriorityFilter] = useState('all') // all, high, medium, low
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [newNote, setNewNote] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)

  const filteredTickets = useMemo(() => {
    return supportTicketsData.filter((ticket) => {
      const matchesStatus = filter === 'all' || ticket.status === filter
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
      return matchesStatus && matchesPriority
    })
  }, [filter, priorityFilter])

  const getStatusBadge = (status) => {
    const statusMap = {
      open: {
        label: 'Open',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
      'in-progress': {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Edit,
      },
      resolved: {
        label: 'Resolved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
    }
    const statusInfo = statusMap[status] || statusMap.open
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

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      high: {
        label: 'High',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      },
      medium: {
        label: 'Medium',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      },
      low: {
        label: 'Low',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      },
    }
    const priorityInfo = priorityMap[priority] || priorityMap.medium

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}
      >
        <AlertCircle className="w-3 h-3" />
        {priorityInfo.label}
      </span>
    )
  }

  const handleStatusChange = (ticketId, newStatus) => {
    // In real app, this would call an API
    toast.success(`Ticket status updated to ${newStatus}`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    // In real app, this would call an API
    toast.success('Message sent')
    setNewMessage('')
  }

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note')
      return
    }
    // In real app, this would call an API
    toast.success('Internal note added')
    setNewNote('')
    setShowNoteModal(false)
  }

  const openCount = supportTicketsData.filter((t) => t.status === 'open').length
  const inProgressCount = supportTicketsData.filter((t) => t.status === 'in-progress').length
  const resolvedCount = supportTicketsData.filter((t) => t.status === 'resolved').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {supportTicketsData.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{openCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'open', 'in-progress', 'resolved'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {filterOption === 'in-progress' ? 'In Progress' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'high', 'medium', 'low'].map((priorityOption) => (
                <button
                  key={priorityOption}
                  onClick={() => setPriorityFilter(priorityOption)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    priorityFilter === priorityOption
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tickets</h3>
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                selectedTicket?.id === ticket.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {ticket.subject}
                </h4>
                {getPriorityBadge(ticket.priority)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {ticket.customerName} • {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2">
                {getStatusBadge(ticket.status)}
                {ticket.assignedTo && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {ticket.assignedTo}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              {/* Ticket Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedTicket.subject}
                    </h3>
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Customer: {selectedTicket.customerName}</span>
                    <span>•</span>
                    <span>{selectedTicket.customerEmail}</span>
                    {selectedTicket.orderId && (
                      <>
                        <span>•</span>
                        <span>Order: {selectedTicket.orderId}</span>
                      </>
                    )}
                  </div>
                </div>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Messages Thread */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Conversation
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-blue-50 dark:bg-blue-900/10 ml-8'
                          : 'bg-gray-50 dark:bg-gray-700/30 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Message */}
              <div className="mb-6">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>

              {/* Internal Notes */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Internal Notes
                  </h4>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>
                {selectedTicket.internalNotes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTicket.internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {note.author}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No internal notes</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Internal Note
            </h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter internal note..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNoteModal(false)
                  setNewNote('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportTickets

