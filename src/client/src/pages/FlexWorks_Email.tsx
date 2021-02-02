

import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap'

import { layoutSlice } from '../slices/layout'

import flexworksData from '../data/flexworks.json'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())
    }, [dispatch, location])

    return (
        <React.Fragment>
            <Container fluid={ true } style={{ width: '100%', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col xs={ 4 } style={{ overflowY: 'scroll', height: '100%' }}>
                        { Object.values(flexworksData.message).map((m: any, i: any) => (
                            <div style={{ borderTop: "1px solid black", paddingTop: '8px' }} onClick={ console.log }>
                                <b>{ (flexworksData.subject as { [name: string]: { [name: string]: string } })[m.subjectID].name }</b>
                                <p>{ m.body }</p>
                            </div>
                        )) }
                    </Col>
                    <Col xs={ 8 } style={{ overflowY: 'scroll', height: '100%', paddingTop: '8px' }}>
                        <h2 style={{ marginBottom: '16px' }}>This is the title of the current message</h2>
                        <p>From: Katie Taylor &lt;katiemtaylor@whatever.net&gt;<br/>
                            To: Brandon Kelley &lt;brandonmkelley@outlook.com&gt;<br/>
                            Cc: Someone else &lt;somebody@gmail.com&gt;</p>
                        <hr></hr>
                        <p>See the content of this message down here.</p>
                        <p>It might also have paragraphs and whatnot.</p>
                    </Col>
                </Row>
            </Container>
            
        </React.Fragment>
    )
}
