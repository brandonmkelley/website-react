
import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { layoutSlice } from '../slices/layout'
import { Container } from 'react-bootstrap'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())
    }, [location])

    return (
        <React.Fragment>
            <Container fluid={ true } style={{ width: '100%', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col xs={ 4 } style={{ overflowY: 'scroll', height: '100%' }}>
                    <div style={{ borderBottom: "1px solid black", paddingTop: '8px' }}>
                            <b>Message 1 title</b>
                            <p>Message 1 preview text can be found here, click to view full message.</p>
                        </div>
                        <div style={{ borderBottom: "1px solid black", paddingTop: '8px' }}>
                            <b>Message 2 title</b>
                            <p>Message 2 preview text can be found here, click to view full message.
                                This one is quite a bit longer though. Likely will need to be clipped.
                            </p>
                        </div>
                        <div style={{ borderBottom: "1px solid black", paddingTop: '8px' }}>
                            <b>Message 3 title</b>
                            <p>Message 3 preview text can be found here, click to view full message.</p>
                        </div>
                    </Col>
                    <Col xs={ 8 } style={{ overflowY: 'scroll', height: '100%' }}>
                    </Col>
                </Row>
            </Container>
            
        </React.Fragment>
    )
}
