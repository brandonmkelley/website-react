
import { useContext, useReducer } from 'react'

import { Action } from 'redux'

import { useDispatch } from 'react-redux'

import { ServiceContext } from '../'

import { userSlice } from './user'
import { subjectSlice } from './subject'
import { messageSlice } from './message'
import { chatSlice } from './chat'
import { contentSlice } from './content'
import { composeEvent } from 'api/build'

export const dataSlices = [ subjectSlice, userSlice, messageSlice, chatSlice, contentSlice ]

export class Subscriber {
    sid: string
    event: string
    payload: any

    constructor(sid: string, event: string, payload?: any) {
        this.sid = sid
        this.event = event
        this.payload = payload
    }
}

const apiEventActions = dataSlices.reduce((eventActions: any, slice: any) => {
    let dataEntity = slice.name
    let sliceActions = slice.actions as { [name: string]: Action }

    for (var sliceActionName of Object.keys(slice.actions)) {
        let dataTranslation = sliceActionName
        let apiEvent = composeEvent("socket", "sub", dataEntity, dataTranslation)

        eventActions[apiEvent] = sliceActions[sliceActionName]
    }

    return eventActions
}, {})

function useDatabaseState() {
    const { socket } = useContext(ServiceContext)
    const dispatch = useDispatch()

    const subscribe = (state: any, subscriber: Subscriber) => {
        //console.log('Subscribing to Socket IO event: ' + event)

        socket.on(subscriber.event, (result: any) => {
            dispatch(apiEventActions[subscriber.event](result))

            //console.log('Socket event triggered for event: ' + event)
            //console.log('Dispatching the following result: ')
            //console.log(result)
        });

        socket.emit(subscriber.event, subscriber)

        return { ...state }
    }

    return useReducer(subscribe, null)
}

export default () => {
    const { socket } = useContext(ServiceContext)

    const [_, subscribe] = useDatabaseState()

    const unsubscribe = (event: string) => socket.off(event)

    return { subscribe, unsubscribe }
}
