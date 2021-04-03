
import { useContext, useReducer } from 'react'

import { Action } from 'redux'

import { useDispatch } from 'react-redux'

import { ServiceContext } from '../'

import { userSlice } from './user'
import { subjectSlice } from './subject'
import { messageSlice } from './message'
import { chatSlice } from './chat'

export const dataSlices = [ subjectSlice, userSlice, messageSlice, chatSlice ]

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

const allSlicesMap = dataSlices.reduce((result: any, slice: any) => {
    for (var actionName of Object.keys(slice.actions))
        result[slice.name + '-' + actionName] = (slice.actions as { [name: string]: Action })[actionName]

    return result
}, {})

function useDatabaseState() {
    const { socket } = useContext(ServiceContext)
    const dispatch = useDispatch()

    const subscribe = (state: any, subscriber: Subscriber) => {
        //console.log('Subscribing to Socket IO event: ' + event)

        socket.on(subscriber.event, (result: any) => {
            dispatch(allSlicesMap[subscriber.event](result))

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
