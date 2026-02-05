import { createSlice } from '@reduxjs/toolkit'

// Initialize with sample employees
const initialState = {
    employees: [
        {
            id: 'emp_1',
            name: 'John Doe',
            email: 'john.doe@company.com',
            role: 'employee',
            department: 'Engineering',
            position: 'Software Developer',
            phone: '+1234567890',
            joinDate: '2024-01-15',
            avatar: null
        },
        {
            id: 'emp_2',
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            role: 'employee',
            department: 'Design',
            position: 'UI/UX Designer',
            phone: '+1234567891',
            joinDate: '2024-02-01',
            avatar: null
        },
        {
            id: 'emp_3',
            name: 'Mike Johnson',
            email: 'mike.johnson@company.com',
            role: 'employee',
            department: 'Marketing',
            position: 'Marketing Specialist',
            phone: '+1234567892',
            joinDate: '2024-03-10',
            avatar: null
        }
    ],
    currentUser: null // Currently logged in user
}

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        addEmployee: (state, action) => {
            const newEmployee = {
                ...action.payload,
                id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                role: 'employee',
                joinDate: new Date().toISOString().split('T')[0]
            }
            state.employees.push(newEmployee)
        },
        updateEmployee: (state, action) => {
            const { id, updates } = action.payload
            const employeeIndex = state.employees.findIndex(emp => emp.id === id)
            if (employeeIndex !== -1) {
                state.employees[employeeIndex] = {
                    ...state.employees[employeeIndex],
                    ...updates
                }
            }
            // Also update currentUser if it matches the id
            if (state.currentUser && state.currentUser.id === id) {
                state.currentUser = {
                    ...state.currentUser,
                    ...updates
                }
            }
        },
        deleteEmployee: (state, action) => {
            state.employees = state.employees.filter(emp => emp.id !== action.payload)
        },
        logout: (state) => {
            state.currentUser = null
        }
    }
})

export const { setCurrentUser, addEmployee, updateEmployee, deleteEmployee, logout } = employeesSlice.actions

export default employeesSlice.reducer

