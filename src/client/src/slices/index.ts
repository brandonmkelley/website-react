
import React, { useContext, useReducer } from 'react'

import { Action, Dispatch } from 'redux'

import { useDispatch } from 'react-redux'

import { ServiceContext } from '../'

import { subjectSlice } from './subject'
import { AppState, initialState } from '../AppState'

const allSlices = [subjectSlice]

const allSlicesMap = allSlices.reduce((result: any, slice) => {
    for (var actionName of Object.keys(slice.actions))
        result[slice.name + '-' + actionName] = (slice.actions as { [name: string]: Action })[actionName]

    return result
}, {})

/*
function on(context: any, ioEvent: string, dispatch: Dispatch) {
    console.log('Turning on socket receipt for event: ' + ioEvent)

    context.socket.on(ioEvent, (result: any) => {
        console.log('Socket event triggered for event: ' + ioEvent)
        console.log('Dispatching the following result: ')
        console.log(result)
        dispatch(allSlicesMap[ioEvent](result))
    })
}

function off(context: any, ioEvent: string) {
    const { socket } = useContext(context)

    console.log('Turning off socket receipt for event: ' + ioEvent)
    socket.off(ioEvent)
}

export default { on, off }
*/




/*
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const dataLayerSlice = createSlice({
    name: 'dataLayer',
    initialState: initialState,
    reducers: {
        on: (state: AppState, action: any) => {
            const { socket } = useContext(ServiceContext)
            const dispatch = useDispatch()
            const ioEvent = action.payload

            console.log('Turning on socket receipt for event: ' + ioEvent)

            socket.on(ioEvent, (result: any) => {
                console.log('Socket event triggered for event: ' + ioEvent)
                console.log('Dispatching the following result: ')
                console.log(result)
                dispatch(allSlicesMap[ioEvent](result))
            })

            return state
        },
        off: (state: AppState, action: any) => {
            const { socket } = useContext(ServiceContext)
            const ioEvent = action.payload

            console.log('Turning off socket receipt for event: ' + ioEvent)
            socket.off(ioEvent)

            return state
        }
    }
})

*/

const ioEvents = {}

export function useDataLayerOn() {
    const { socket } = useContext(ServiceContext)
    const dispatch = useDispatch()

    const ioOnEventHandler = (state: any, action: any) => {
        const ioEvent = action as string

        (state as { [name: string]: boolean })[ioEvent] = true

        socket.on(ioEvent, (result: any) => {
            console.log(ioEvent)

            dispatch(allSlicesMap[ioEvent](result))

            console.log('Socket event triggered for event: ' + ioEvent)
            console.log('Dispatching the following result: ')
            console.log(result)
        })

        console.log('Turning on socket receipt for event: ' + ioEvent)

        return { ...state }
    }

    return useReducer(ioOnEventHandler, ioEvents)
}

export function useDataLayerOff() {
    const { socket } = useContext(ServiceContext)

    const ioOffEventHandler = (state: any, action: any) => {
        const ioEvent = action as string

        socket.off(ioEvent);

        (state as { [name: string]: boolean })[ioEvent] = false

        console.log('Turning off socket receipt for event: ' + ioEvent)

        return state
    }

    return useReducer(ioOffEventHandler, ioEvents)
}
