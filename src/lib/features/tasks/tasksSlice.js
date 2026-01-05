import { createSlice } from '@reduxjs/toolkit'

// Initialize with some sample tasks
const initialState = {
    tasks: [
        {
            id: '1',
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the new feature',
            assignedTo: 'emp_1',
            assignedBy: 'admin_1',
            status: 'in-progress', // pending, in-progress, completed
            priority: 'high', // low, medium, high
            deadline: '2025-01-20',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
            progress: 60
        },
        {
            id: '2',
            title: 'Review code changes',
            description: 'Review and approve pull requests from the team',
            assignedTo: 'emp_1',
            assignedBy: 'admin_1',
            status: 'pending',
            priority: 'medium',
            deadline: '2025-01-18',
            createdAt: '2025-01-15T11:00:00Z',
            updatedAt: '2025-01-15T11:00:00Z',
            progress: 0
        },
        {
            id: '3',
            title: 'Team meeting preparation',
            description: 'Prepare agenda and materials for weekly team meeting',
            assignedTo: 'emp_2',
            assignedBy: 'admin_1',
            status: 'completed',
            priority: 'low',
            deadline: '2025-01-16',
            createdAt: '2025-01-14T09:00:00Z',
            updatedAt: '2025-01-16T14:00:00Z',
            progress: 100
        }
    ]
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const newTask = {
                ...action.payload,
                id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                progress: 0,
                status: 'pending'
            }
            state.tasks.push(newTask)
        },
        updateTask: (state, action) => {
            const { id, updates } = action.payload
            const taskIndex = state.tasks.findIndex(task => task.id === id)
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = {
                    ...state.tasks[taskIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
            }
        },
        updateTaskProgress: (state, action) => {
            const { id, progress, status } = action.payload
            const taskIndex = state.tasks.findIndex(task => task.id === id)
            if (taskIndex !== -1) {
                state.tasks[taskIndex].progress = progress
                if (status) {
                    state.tasks[taskIndex].status = status
                }
                state.tasks[taskIndex].updatedAt = new Date().toISOString()
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload)
        },
        assignTask: (state, action) => {
            const { taskId, employeeId } = action.payload
            const taskIndex = state.tasks.findIndex(task => task.id === taskId)
            if (taskIndex !== -1) {
                state.tasks[taskIndex].assignedTo = employeeId
                state.tasks[taskIndex].updatedAt = new Date().toISOString()
            }
        }
    }
})

export const { addTask, updateTask, updateTaskProgress, deleteTask, assignTask } = tasksSlice.actions

export default tasksSlice.reducer

