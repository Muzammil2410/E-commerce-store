import React, { useState } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'
import { sellerVerificationData } from './mockData'
import toast from 'react-hot-toast'

const SellerVerification = () => {
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [sellerToReject, setSellerToReject] = useState(null)

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
      },
      missing: {
        label: 'Missing',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: AlertCircle,
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

  const getDocumentLabel = (docType) => {
    const labels = {
      cnic: 'CNIC / ID Card',
      businessLicense: 'Business License',
      taxCertificate: 'Tax Certificate',
      bankStatement: 'Bank Statement',
    }
    return labels[docType] || docType
  }

  const handleApprove = (seller) => {
    // In real app, this would call an API
    toast.success(`${seller.businessName} has been approved!`)
    // Update local state (in real app, this would come from API response)
  }

  const handleReject = (seller) => {
    setSellerToReject(seller)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    // In real app, this would call an API
    toast.success(`${sellerToReject.businessName} has been rejected`)
    setShowRejectModal(false)
    setRejectionReason('')
    setSellerToReject(null)
  }

  const pendingSellers = sellerVerificationData.filter((s) => s.verificationStatus === 'pending')
  const approvedSellers = sellerVerificationData.filter((s) => s.verificationStatus === 'approved')
  const rejectedSellers = sellerVerificationData.filter((s) => s.verificationStatus === 'rejected')

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</p>
            <ShieldCheck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sellerVerificationData.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSellers.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {approvedSellers.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rejectedSellers.length}
          </p>
        </div>
      </div>

      {/* Verification List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seller Verification Status
          </h3>
        </div>

        <div className="space-y-4">
          {sellerVerificationData.map((seller) => (
            <div
              key={seller.sellerId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Seller Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {seller.businessName}
                    </h4>
                    {getStatusBadge(seller.verificationStatus)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{seller.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Submitted: {new Date(seller.submittedDate).toLocaleDateString()}</span>
                    {seller.reviewedDate && (
                      <span>Reviewed: {new Date(seller.reviewedDate).toLocaleDateString()}</span>
                    )}
                    {seller.reviewedBy && <span>By: {seller.reviewedBy}</span>}
                  </div>
                </div>

                {seller.verificationStatus === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(seller)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(seller)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(seller.documents).map(([docType, doc]) => (
                    <div
                      key={docType}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {getDocumentLabel(docType)}
                        </span>
                        {getStatusBadge(doc.status)}
                      </div>
                      {doc.fileName ? (
                        <div className="flex items-center gap-2 mt-2">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {doc.fileName}
                          </span>
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">Not uploaded</p>
                      )}
                      {doc.rejectionReason && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {seller.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">{seller.rejectionReason}</p>
                </div>
              )}

              {/* Expandable Details */}
              <button
                onClick={() =>
                  setSelectedSeller(selectedSeller === seller.sellerId ? null : seller.sellerId)
                }
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {selectedSeller === seller.sellerId ? 'Hide Details' : 'Show Details'}
              </button>

              {selectedSeller === seller.sellerId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Submitted Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(seller.submittedDate).toLocaleString()}
                      </p>
                    </div>
                    {seller.reviewedDate && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Reviewed Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(seller.reviewedDate).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {seller.reviewedBy && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Reviewed By</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {seller.reviewedBy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Seller Verification
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting {sellerToReject?.businessName}'s verification:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setSellerToReject(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerVerification

