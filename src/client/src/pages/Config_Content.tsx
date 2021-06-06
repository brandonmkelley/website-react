
import React, { useEffect, useState, useContext } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap'

import LocalStore from 'devextreme/data/local_store'
import DataSource from 'devextreme/data/data_source'

import DataGrid, {
    Column,
    Editing,
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
            subscribe(new Subscriber(userSid, 'user-view'))
        }

        return () => {
            unsubscribe('content-view')
            unsubscribe('user-view')
        }
    }, [ userSid, location.pathname ])

    const content = useSelector((state: any) => state.content)
    const users = useSelector((state: any) => state.users)

    const pageSizes = [5, 10, 20, 100]

    return (
        <React.Fragment>
            <Container fluid={ true } style={{ width: '100%', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col xs={ 12 } style={{ overflowY: 'scroll', height: '100%', paddingTop: '15px' }}>
                        
                        <DataGrid
                            dataSource={
                                new DataSource({
                                    store: new LocalStore({
                                        key: '_id',
                                        data: Object.values(content),
                                        name: 'config/content/content-view'
                                    })
                                })
                            }
                            allowColumnReordering={true}
                            showBorders={true}>

                            <GroupPanel visible={true} />
                            <SearchPanel visible={true} highlightCaseSensitive={true} />
                            <Grouping autoExpandAll={false} />

                            <Column dataField="_id" caption="ID"
                                allowEditing={false} visible={false}/>
                            <Column dataField="topic" caption="Topic" width={ 140 }/>
                            <Column dataField="name" caption="Name" width={ 300 }/>
                            <Column dataField="updatedBy" caption="Updated By"
                                allowEditing={false} visible={false}/>
                            <Column dataField="updatedAt" caption="Updated At" width={ 140 }
                                allowEditing={false}
                                dataType="date" format='shortDateShortTime' />
                            <Column dataField="createdBy" caption="Created By"
                                allowEditing={false} visible={false} />
                            <Column dataField="createdAt" caption="Created At"
                                allowEditing={false} visible={false}
                                dataType="date" format='shortDateShortTime' />

                            <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
                            <Paging defaultPageSize={ 5 } />

                            <Editing
                                allowUpdating={true}
                                allowAdding={true}
                                allowDeleting={true}
                                mode="batch" />
                        </DataGrid>

                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
