import { combineReducers } from 'redux'

import search, { selectors as searchSelectors } from './search/reducer'
import error, { selectors as errorSelectors } from './error/reducer'
import * as errorActions from './error/actions'
import * as searchActions from './search/actions'

// to not disclosure root state for child selectors
const slicedSelectors = (rootSelector, selectors) => {
    const sliced = {}
    for (const key of Object.keys(selectors)) {
        sliced[key] = state => selectors[key](rootSelector(state))
    }
    return sliced
}

export const selectors = {
    search: slicedSelectors(state => state.search, searchSelectors),
    error: slicedSelectors(state => state.error, errorSelectors),
}

export const actions = {
    search: searchActions,
    error: errorActions,
}

export default combineReducers({
    search,
    error,
})
