import React, { useState } from 'react'
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Minus,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  FileEdit,
  CheckSquare,
} from 'lucide-react'
import { rolesData, usersWithRoles } from './mockData'
import toast from 'react-hot-toast'

const RoleBasedAccess = () => {
  const [editingRole, setEditingRole] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserRoleModal, setShowUserRoleModal] = useState(false)

  const permissionModules = [
    { key: 'orders', label: 'Orders' },
    { key: 'sellers', label: 'Sellers' },
    { key: 'customers', label: 'Customers' },
    { key: 'products', label: 'Products' },
    { key: 'settings', label: 'Settings' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'security', label: 'Security' },
  ]

  const permissionTypes = [
    { key: 'read', label: 'Read', icon: Eye },
    { key: 'write', label: 'Write', icon: FileEdit },
    { key: 'approve', label: 'Approve', icon: CheckSquare },
  ]

  const getPermissionIcon = (hasPermission) => {
    if (hasPermission) {
      return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
    }
    return <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
  }

  const handleEditRole = (role) => {
    setEditingRole({ ...role })
  }

  const handleSaveRole = () => {
    // In real app, this would call an API
    toast.success('Role permissions updated')
    setEditingRole(null)
  }

  const handleAssignRole = (user) => {
    setSelectedUser(user)
    setShowUserRoleModal(true)
  }

  const handleSaveUserRole = (newRoleId) => {
    // In real app, this would call an API
    const newRole = rolesData.find((r) => r.id === newRoleId)
    toast.success(`Role changed to ${newRole.name}`)
    setShowUserRoleModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Roles</p>
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{rolesData.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {usersWithRoles.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {usersWithRoles.filter((u) => u.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Roles & Permissions Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Role-Based Access Control
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          {rolesData.map((role) => {
            const isEditing = editingRole?.id === role.id
            const rolePermissions = isEditing ? editingRole.permissions : role.permissions

            return (
              <div
                key={role.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5"
              >
                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {role.name}
                      </h4>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                        {role.userCount} users
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => handleEditRole(role)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Permissions
                    </button>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveRole}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRole(null)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Permissions Matrix */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                          Module
                        </th>
                        {permissionTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <th
                              key={type.key}
                              className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <Icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {permissionModules.map((module) => (
                        <tr
                          key={module.key}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {module.label}
                          </td>
                          {permissionTypes.map((type) => {
                            const hasPermission = rolePermissions[module.key]?.[type.key] || false
                            return (
                              <td key={type.key} className="px-4 py-3 text-center">
                                {isEditing ? (
                                  <button
                                    onClick={() => {
                                      setEditingRole({
                                        ...editingRole,
                                        permissions: {
                                          ...editingRole.permissions,
                                          [module.key]: {
                                            ...editingRole.permissions[module.key],
                                            [type.key]: !hasPermission,
                                          },
                                        },
                                      })
                                    }}
                                    className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                                      hasPermission
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                    }`}
                                  >
                                    {hasPermission ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <XCircle className="w-4 h-4" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="flex justify-center">
                                    {getPermissionIcon(hasPermission)}
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* User Role Assignments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Role Assignments</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usersWithRoles.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                      {user.roleName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.lastLogin).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleAssignRole(user)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Role Modal */}
      {showUserRoleModal && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => {
              setShowUserRoleModal(false)
              setSelectedUser(null)
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Change User Role
                </h3>
                <button
                  onClick={() => {
                    setShowUserRoleModal(false)
                    setSelectedUser(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Assign a new role to <strong>{selectedUser.name}</strong>
                </p>
                <div className="space-y-2 mb-4">
                  {rolesData.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleSaveUserRole(role.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedUser.roleId === role.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{role.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{role.description}</p>
                        </div>
                        {selectedUser.roleId === role.id && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowUserRoleModal(false)
                    setSelectedUser(null)
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Security Notice
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Role changes are logged in the audit system. Only admins can modify role permissions.
              Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleBasedAccess

