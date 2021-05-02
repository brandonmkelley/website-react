
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        view: (state: AppState, action: any) => {
            /*
            if (action.payload.apimeta.changeEvent === 'none')
                return ({ ...state, users: action.payload.data })

            else if (['add', 'update'].includes(action.payload.apimeta.changeEvent)
                && Object.keys(action.payload.data).length > 0) {
                const updatedID = Object.keys(action.payload.data)[0]
                const updated = Object.assign(
                    state.users[updatedID] || {},
                    action.payload.data[updatedID])
                return ({ ...state, users: { ...state.users, updated } })
                return ({ ...state, users: action.payload.data })
            }

            else if (action.payload.apimeta.changeEvent === 'delete') {
                return ({ ...state, users: action.payload })
            }
            */

            return ({ ...state, users: action.payload })
        },
        id: (state: AppState, action: any) => {
            return ({ ...state, user: action.payload })
        }
    }
})
