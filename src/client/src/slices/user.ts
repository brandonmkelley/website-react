
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        view: (state: AppState, action: any) => {
            if (!state.users)
                return ({})

            else if (action.payload.apimeta.scope === 'none')
                return ({ ...state, users: action.payload.data })

            // This is SLOW.
            else if (['add', 'update'].includes(action.payload.apimeta.scope)
                && Object.keys(action.payload.data).length > 0) {
                const updatedID = Object.keys(action.payload.data)[0]
                var updated = Object.assign({}, state.users[updatedID] || {})
                updated = Object.assign(updated, action.payload.data[updatedID])
                const users = { ...state.users }
                users[updatedID] = updated
                return ({ ...state, users: users })
            }

            else if (action.payload.apimeta.scope === 'delete') {
                const updatedID = Object.keys(action.payload.data)[0]
                delete state.users[updatedID]
                return ({ ...state, users: ({ ...state.users }) })
            }

            console.log('Warning: no apimeta.scope provided, setting data by default.')
            return ({ ...state, users: action.payload.data })
        },
        id: (state: AppState, action: any) => {
            return ({ ...state, user: action.payload.data })
        }
    }
})
