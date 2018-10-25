/*
 * action types
 */
export const SET_SOURCE = 'SET_SOURCE';
export const SET_DESTINATION = 'SET_DESTINATION';
export const SELECT_MAP_POINT = 'SELECT_MAP_POINT';

/*
 * action creators
 */

export function setSource(text) {
  return { type: SET_SOURCE, payload: text };
}

export function setDestination(text) {
  return { type: SET_DESTINATION, payload: text };
}

export function selectMapPoint(text) {
  return { type: SELECT_MAP_POINT, payload: text };
}