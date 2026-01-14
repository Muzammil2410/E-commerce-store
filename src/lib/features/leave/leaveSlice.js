import { createSlice } from '@reduxjs/toolkit'

// Load leave requests from localStorage if available
const loadLeaveRequestsFromStorage = () => {
    try {
        const stored = localStorage.getItem('leaveRequests')
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Error loading leave requests from localStorage:', error)
    }
    return null
}

// Load balances from localStorage if available
const loadBalancesFromStorage = () => {
    try {
        const stored = localStorage.getItem('leaveBalances')
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Error loading leave balances from localStorage:', error)
    }
    return null
}

// Initialize with sample leave requests and balances
const storedRequests = loadLeaveRequestsFromStorage()
const storedBalances = loadBalancesFromStorage()

const initialState = {
    requests: storedRequests || [
        {
            id: 'leave_1',
            employeeId: 'emp_1',
            employeeName: 'John Doe',
            type: 'sick', // sick, vacation, personal, emergency
            startDate: '2025-01-22',
            endDate: '2025-01-24',
            days: 3,
            reason: 'Medical appointment and recovery',
            status: 'pending', // pending, approved, rejected
            submittedAt: '2025-01-15T10:00:00Z',
            reviewedBy: null,
            reviewedAt: null,
            comments: ''
        },
        {
            id: 'leave_2',
            employeeId: 'emp_2',
            employeeName: 'Jane Smith',
            type: 'vacation',
            startDate: '2025-02-01',
            endDate: '2025-02-05',
            days: 5,
            reason: 'Family vacation',
            status: 'approved',
            submittedAt: '2025-01-10T09:00:00Z',
            reviewedBy: 'admin_1',
            reviewedAt: '2025-01-11T14:00:00Z',
            comments: 'Approved. Enjoy your vacation!'
        }
    ],
    balances: storedBalances || {
        'emp_1': {
            total: 20,
            used: 5,
            remaining: 15,
            sick: { total: 10, used: 2, remaining: 8 },
            vacation: { total: 15, used: 3, remaining: 12 },
            personal: { total: 5, used: 0, remaining: 5 }
        },
        'emp_2': {
            total: 20,
            used: 8,
            remaining: 12,
            sick: { total: 10, used: 1, remaining: 9 },
            vacation: { total: 15, used: 5, remaining: 10 },
            personal: { total: 5, used: 2, remaining: 3 }
        }
    },
    policies: {
        sick: { maxDays: 10, requiresDocumentation: true },
        vacation: { maxDays: 15, requiresDocumentation: false },
        personal: { maxDays: 5, requiresDocumentation: false },
        emergency: { maxDays: 3, requiresDocumentation: false }
    }
}

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        submitLeaveRequest: (state, action) => {
            const { employeeId, employeeName, type, startDate, endDate, reason } = action.payload
            
            // Calculate days
            const start = new Date(startDate)
            const end = new Date(endDate)
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
            
            const newRequest = {
                id: `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                employeeId,
                employeeName,
                type,
                startDate,
                endDate,
                days,
                reason,
                status: 'pending',
                submittedAt: new Date().toISOString(),
                reviewedBy: null,
                reviewedAt: null,
                comments: ''
            }
            state.requests.push(newRequest)
            
            // Save to localStorage
            try {
                localStorage.setItem('leaveRequests', JSON.stringify(state.requests))
            } catch (error) {
                console.error('Error saving leave requests to localStorage:', error)
            }
        },
        approveLeaveRequest: (state, action) => {
            const { id, reviewedBy, comments } = action.payload
            const requestIndex = state.requests.findIndex(req => req.id === id)
            
            if (requestIndex !== -1) {
                const request = state.requests[requestIndex]
                request.status = 'approved'
                request.reviewedBy = reviewedBy
                request.reviewedAt = new Date().toISOString()
                request.comments = comments || ''
                
                // Update leave balance
                const balance = state.balances[request.employeeId]
                if (balance) {
                    balance.used += request.days
                    balance.remaining -= request.days
                    
                    // Update type-specific balance
                    if (balance[request.type]) {
                        balance[request.type].used += request.days
                        balance[request.type].remaining -= request.days
                    }
                }
                
                // Save to localStorage
                try {
                    localStorage.setItem('leaveRequests', JSON.stringify(state.requests))
                    localStorage.setItem('leaveBalances', JSON.stringify(state.balances))
                } catch (error) {
                    console.error('Error saving leave data to localStorage:', error)
                }
            }
        },
        rejectLeaveRequest: (state, action) => {
            const { id, reviewedBy, comments } = action.payload
            const requestIndex = state.requests.findIndex(req => req.id === id)
            
            if (requestIndex !== -1) {
                state.requests[requestIndex].status = 'rejected'
                state.requests[requestIndex].reviewedBy = reviewedBy
                state.requests[requestIndex].reviewedAt = new Date().toISOString()
                state.requests[requestIndex].comments = comments || ''
                
                // Save to localStorage
                try {
                    localStorage.setItem('leaveRequests', JSON.stringify(state.requests))
                } catch (error) {
                    console.error('Error saving leave requests to localStorage:', error)
                }
            }
        },
        updateLeaveBalance: (state, action) => {
            const { employeeId, type, total } = action.payload
            if (!state.balances[employeeId]) {
                state.balances[employeeId] = {
                    total: 0,
                    used: 0,
                    remaining: 0,
                    sick: { total: 0, used: 0, remaining: 0 },
                    vacation: { total: 0, used: 0, remaining: 0 },
                    personal: { total: 0, used: 0, remaining: 0 }
                }
            }
            
            if (type) {
                state.balances[employeeId][type].total = total
                state.balances[employeeId][type].remaining = total - state.balances[employeeId][type].used
            } else {
                state.balances[employeeId].total = total
                state.balances[employeeId].remaining = total - state.balances[employeeId].used
            }
        },
        updateLeavePolicy: (state, action) => {
            const { type, policy } = action.payload
            if (state.policies[type]) {
                state.policies[type] = { ...state.policies[type], ...policy }
            }
        }
    }
})

export const { submitLeaveRequest, approveLeaveRequest, rejectLeaveRequest, updateLeaveBalance, updateLeavePolicy } = leaveSlice.actions

export default leaveSlice.reducer

