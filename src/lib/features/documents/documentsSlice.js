import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    documents: [],
    categories: ['Policy', 'Handbook', 'Guidelines', 'Forms', 'Other']
}

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        // Load documents from localStorage
        loadDocuments: (state) => {
            const stored = localStorage.getItem('documents')
            if (stored) {
                const data = JSON.parse(stored)
                state.documents = data.documents || []
                state.categories = data.categories || state.categories
            } else {
                // Initialize with sample documents
                state.documents = [
                    {
                        id: 'doc_1',
                        title: 'Employee Handbook 2024',
                        description: 'Complete guide to company policies and procedures',
                        category: 'Handbook',
                        fileUrl: '#',
                        fileType: 'pdf',
                        fileSize: '2.5 MB',
                        uploadedBy: 'admin',
                        uploadedAt: new Date().toISOString(),
                        accessLevel: 'all' // 'all', 'admin', 'specific_roles'
                    },
                    {
                        id: 'doc_2',
                        title: 'Code of Conduct',
                        description: 'Professional standards and ethical guidelines',
                        category: 'Policy',
                        fileUrl: '#',
                        fileType: 'pdf',
                        fileSize: '1.2 MB',
                        uploadedBy: 'admin',
                        uploadedAt: new Date().toISOString(),
                        accessLevel: 'all'
                    },
                    {
                        id: 'doc_3',
                        title: 'Leave Request Form',
                        description: 'Template for requesting time off',
                        category: 'Forms',
                        fileUrl: '#',
                        fileType: 'docx',
                        fileSize: '0.5 MB',
                        uploadedBy: 'admin',
                        uploadedAt: new Date().toISOString(),
                        accessLevel: 'all'
                    }
                ]
                documentsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Upload a new document (admin only)
        uploadDocument: (state, action) => {
            const { title, description, category, fileUrl, fileType, fileSize, uploadedBy, accessLevel } = action.payload
            
            const newDocument = {
                id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title,
                description,
                category: category || 'Other',
                fileUrl,
                fileType: fileType || 'pdf',
                fileSize: fileSize || '0 MB',
                uploadedBy,
                uploadedAt: new Date().toISOString(),
                accessLevel: accessLevel || 'all'
            }
            
            state.documents.unshift(newDocument)
            
            // Save to localStorage
            documentsSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Delete document (admin only)
        deleteDocument: (state, action) => {
            const documentId = action.payload
            state.documents = state.documents.filter(doc => doc.id !== documentId)
            
            // Save to localStorage
            documentsSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state) => {
            localStorage.setItem('documents', JSON.stringify({
                documents: state.documents,
                categories: state.categories
            }))
        }
    }
})

export const {
    loadDocuments,
    uploadDocument,
    deleteDocument
} = documentsSlice.actions

export default documentsSlice.reducer

