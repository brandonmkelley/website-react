
import React, { useEffect, useState, useContext } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap'

import { layoutSlice } from '../slices/layout'

import useDatabaseSubscription, { Subscriber } from '../slices'
import { ServiceContext } from '..'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    const { subscribe, unsubscribe } = useDatabaseSubscription()

    const userSid: string | null | undefined = useSelector((state: any) => state.userSid) || {}

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())

        if (typeof(userSid) === 'string') {
            subscribe(new Subscriber(userSid, 'user-id'))
            subscribe(new Subscriber(userSid, 'user-view'))
            subscribe(new Subscriber(userSid, 'subject-view'))
            subscribe(new Subscriber(userSid, 'message-view'))

            subscribe(new Subscriber(userSid, 'chat-view'))
        }

        return () => {
            unsubscribe('user-id')
            unsubscribe('user-view')
            unsubscribe('subject-view')
            unsubscribe('message-view')

            unsubscribe('chat-view')
        }
    }, [location.pathname, userSid])

    const user = useSelector((state: any) => state.user)
    const users = useSelector((state: any) => state.users) || {}
    const messages = useSelector((state: any) => state.messages) || {}
    const subjects = useSelector((state: any) => state.subjects) || {}
    const chat = useSelector((state: any) => state.chat)

    /*
    useEffect(() => {
        if (Object.keys(messages).length > 0) {
            var sortedMessages = Object.values(messages).sort((m1: any, m2: any) => m2.sentDt - m1.sentDt)
            var latestMessage = sortedMessages[0]
            
            // Is the active item a user or a subject or a user group???
            setActiveMessage(latestMessage)
        }
    }, [messages])
    */

    return (
        <React.Fragment>
            <Container fluid={ true } style={{ width: '100%', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col xs={ 4 } style={{ overflowY: 'scroll', height: '100%' }}>
                        {
                            Object.keys(users).map(function(id: any) {
                                return (users?.email == user?.email) ? null : (
                                    <div key={ id } id={ 'user-' + id } style={{ borderTop: "1px solid black", paddingTop: '8px' }}
                                        onClick={
                                            console.log
                                            // e => setActiveMessage(messages[e.currentTarget.id.substring(messageIDPrefixLen)])
                                        }>
                                        <b>{
                                            users[id].firstName + ' ' + users[id].lastName
                                            //((subjects as { [name: string]: { [name: string]: string } })[messages[id].subjectID] || {}).name
                                        }</b>
                                        <p>{
                                            'Hello world!'
                                            //messages[id].body
                                        }</p>
                                    </div>
                                )
                            })
                        }
                    </Col>
                    { /*
                    <Col xs={ 8 } style={{ overflowY: 'scroll', height: '100%', paddingTop: '8px' }}>
                        { activeMessage === null && <b>You have no messages to show.</b> }
                        { activeMessage !== null && 
                            <div>
                                <h2 style={{ marginBottom: '16px' }}>{ (subjects[activeMessage!.subjectID] || {}).name }</h2>
                                <p>From: { (users[activeMessage!.fromUserID] || {}).email }<br/>
                                    To: Brandon Kelley &lt;brandonmkelley@outlook.com&gt;<br/>
                                    Cc: Someone else &lt;somebody@gmail.com&gt;</p>
                                <hr></hr>
                                <p>{ activeMessage!.body }</p>
                            </div>
                        }
                    </Col>
                    */ }
                </Row>
            </Container>
            
        </React.Fragment>
    )
}
