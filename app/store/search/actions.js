export const SET_SOURCE = 'SET_SOURCE'
export const SET_DESTINATION = 'SET_DESTINATION'
export const INPUT_SOURCE = 'INPUT_SOURCE'
export const INPUT_DESTINATION = 'INPUT_DESTINATION'
export const LOOKUP_DESTINATION = 'LOOKUP_DESTINATION'
export const LOOKUP_SOURCE = 'LOOKUP_SOURCE'
export const SELECT_MAP_POINT = 'SELECT_MAP_POINT'
export const SET_DESTINATION_LOCATIONS = 'SET_DESTINATION_LOCATIONS'
export const SET_ROUTES = 'SET_ROUTES'
export const SET_SOURCE_LOCATIONS = 'SET_SOURCE_LOCATIONS'

export function setSource(text) {
    return { type: SET_SOURCE, payload: text }
}

export function setDestination(text) {
    return { type: SET_DESTINATION, payload: text }
}

export function inputSource(text) {
    return { type: INPUT_SOURCE, payload: text }
}

export function inputDestination(text) {
    return { type: INPUT_DESTINATION, payload: text }
}

export function selectMapPoint(text) {
    return { type: SELECT_MAP_POINT, payload: text }
}

export function setRoutes(routes) {
    return { type: SET_ROUTES, payload: routes }
}

export function setSourceLocations(locations) {
    return { type: SET_SOURCE_LOCATIONS, payload: locations }
}

export function setDestinationLocations(locations) {
    return { type: SET_DESTINATION_LOCATIONS, payload: locations }
}
