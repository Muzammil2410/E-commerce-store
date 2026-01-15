import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    achievements: [], // All available achievements
    userAchievements: {} // User achievements: { userId: [achievementIds] }
}

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        // Load achievements from localStorage
        loadAchievements: (state) => {
            const stored = localStorage.getItem('achievements')
            if (stored) {
                const data = JSON.parse(stored)
                state.achievements = data.achievements || []
                state.userAchievements = data.userAchievements || {}
            } else {
                // Initialize with default achievements
                state.achievements = [
                    {
                        id: 'ach_1',
                        title: 'First Day',
                        description: 'Complete your first day at work',
                        icon: '🎉',
                        category: 'milestone',
                        points: 10
                    },
                    {
                        id: 'ach_2',
                        title: 'Week Warrior',
                        description: 'Complete a full week of work',
                        icon: '💪',
                        category: 'milestone',
                        points: 50
                    },
                    {
                        id: 'ach_3',
                        title: 'Task Master',
                        description: 'Complete 10 tasks',
                        icon: '✅',
                        category: 'productivity',
                        points: 100
                    },
                    {
                        id: 'ach_4',
                        title: 'Perfect Attendance',
                        description: 'No absences for a month',
                        icon: '📅',
                        category: 'attendance',
                        points: 150
                    },
                    {
                        id: 'ach_5',
                        title: 'Early Bird',
                        description: 'Clock in early 5 times',
                        icon: '🌅',
                        category: 'attendance',
                        points: 75
                    },
                    {
                        id: 'ach_6',
                        title: 'Team Player',
                        description: 'Complete 5 collaborative tasks',
                        icon: '🤝',
                        category: 'teamwork',
                        points: 125
                    }
                ]
                state.userAchievements = {}
                achievementsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Unlock achievement for user
        unlockAchievement: (state, action) => {
            const { userId, achievementId } = action.payload
            
            if (!state.userAchievements[userId]) {
                state.userAchievements[userId] = []
            }
            
            if (!state.userAchievements[userId].includes(achievementId)) {
                state.userAchievements[userId].push(achievementId)
                
                // Save to localStorage
                achievementsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Check and award achievements based on user activity
        checkAchievements: (state, action) => {
            const { userId, stats } = action.payload
            // stats: { daysWorked, tasksCompleted, earlyClockIns, etc. }
            
            if (!state.userAchievements[userId]) {
                state.userAchievements[userId] = []
            }
            
            // Check each achievement condition
            state.achievements.forEach(achievement => {
                if (state.userAchievements[userId].includes(achievement.id)) {
                    return // Already unlocked
                }
                
                let shouldUnlock = false
                
                switch (achievement.id) {
                    case 'ach_1': // First Day
                        shouldUnlock = stats.daysWorked >= 1
                        break
                    case 'ach_2': // Week Warrior
                        shouldUnlock = stats.daysWorked >= 5
                        break
                    case 'ach_3': // Task Master
                        shouldUnlock = stats.tasksCompleted >= 10
                        break
                    case 'ach_4': // Perfect Attendance
                        shouldUnlock = stats.perfectAttendanceDays >= 30
                        break
                    case 'ach_5': // Early Bird
                        shouldUnlock = stats.earlyClockIns >= 5
                        break
                    case 'ach_6': // Team Player
                        shouldUnlock = stats.collaborativeTasks >= 5
                        break
                    default:
                        break
                }
                
                if (shouldUnlock) {
                    state.userAchievements[userId].push(achievement.id)
                }
            })
            
            // Save to localStorage
            achievementsSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state) => {
            localStorage.setItem('achievements', JSON.stringify({
                achievements: state.achievements,
                userAchievements: state.userAchievements
            }))
        }
    }
})

export const {
    loadAchievements,
    unlockAchievement,
    checkAchievements
} = achievementsSlice.actions

export default achievementsSlice.reducer

