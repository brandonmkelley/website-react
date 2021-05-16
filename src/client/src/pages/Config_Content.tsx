
import React, { useEffect, useState, useContext } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap'

import ArrayStore from 'devextreme/data/array_store'
import DataSource from 'devextreme/data/data_source'

import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel
} from 'devextreme-react/data-grid';

import { layoutSlice } from '../slices/layout'

import useDatabaseSubscription, { Subscriber } from '../slices'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    const { subscribe, unsubscribe } = useDatabaseSubscription()

    const userSid: string | null | undefined = useSelector((state: any) => state.userSid) || {}

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())
    }, [location.pathname])

    useEffect(() => {
        if (typeof(userSid) === 'string') {
            subscribe(new Subscriber(userSid, 'content-view'))
        }

        return () => {
            unsubscribe('content-view')
        }
    }, [ userSid, location.pathname ])

    const content = useSelector((state: any) => state.content)

    const pageSizes = [5, 10, 20, 100]

    return (
        <React.Fragment>
            <Container fluid={ true } style={{ width: '100%', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col xs={ 12 } style={{ overflowY: 'scroll', height: '100%' }}>
                        
                        <DataGrid
                            dataSource={
                                new DataSource({
                                    store: new ArrayStore({
                                        key: '_id',
                                        data: content
                                    })
                                })
                            }
                            allowColumnReordering={true}
                            showBorders={true}>

                            <GroupPanel visible={true} />
                            <SearchPanel visible={true} highlightCaseSensitive={true} />
                            <Grouping autoExpandAll={false} />

                            <Column dataField="_id" caption="ID" allowEditing={false}/>
                            <Column dataField="topic" caption="Topic"/>
                            <Column dataField="name" caption="Name" />
                            <Column dataField="modifiedby" caption="Modified By" allowEditing={false} />
                            <Column dataField="modifiedat" caption="Modified At" allowEditing={false}
                                dataType="date" format='shortDateShortTime' />
                            <Column dataField="createdat" caption="Created At" allowEditing={false}
                                dataType="date" format='shortDateShortTime' />

                            <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
                            <Paging defaultPageSize={ 5 } />
                        </DataGrid>

                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
