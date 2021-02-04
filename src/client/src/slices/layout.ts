
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: initialState,
    reducers: {
        desktopWithScroll: (state: AppState) => {
            const footerHeight = document.getElementById('footer')?.clientHeight || 0

            return {
                ...state,
                layoutPlatform: 'Desktop',
                layoutScroll: true,
                layoutNavHeight: '56px',
                layoutJumboHeight: '32vh',
                layoutCardHeight: '60vh',
                layoutAppHeight: 'initial',
                layoutFooterHeight: footerHeight
            }
        },
        desktopNoScroll: (state: AppState) => {
            const footerHeight = document.getElementById('footer')?.clientHeight || 0

            return {
                ...state,
                layoutPlatform: 'Desktop',
                layoutScroll: false,
                layoutNavHeight: '56px',
                layoutJumboHeight: '32vh',
                layoutCardHeight: '60vh',
                layoutAppHeight: '' + (window.innerHeight - 56 - footerHeight) + 'px',
                layoutFooterHeight: footerHeight
            }
        }
    }
})
