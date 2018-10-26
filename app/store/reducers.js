import { combineReducers } from 'redux';
import {
    SHOW_ERROR,
    HANDLE_ERROR,
    CLEAR_ERROR,
    SET_SOURCE,
    SET_DESTINATION,
    INPUT_SOURCE,
    INPUT_DESTINATION,
    SET_SOURCE_LOCATIONS,
    SET_DESTINATION_LOCATIONS,
    SELECT_MAP_POINT,
    SET_ROUTES,
} from './actions';

function error(state, action) {
    if ('undefined' === typeof state) {
        return {
            error: '',
        }
    }

    switch (action.type) {
        case SHOW_ERROR:
            return { error: action.payload.type + ': ' + action.payload.error }
        case CLEAR_ERROR:
            return { error: '' }
        default:
            return state;
    }
}

function search(state, action) {
    if ('undefined' === typeof state) {
        return {
            source: '',
            destination: '',
            sourceLocations: [],
            destinationLocations: [],
            routes: [
                // {
                //   type: 'walk',
                //   distanceMin: 8,
                //   distanceMax: 12,
                //   timeMin: 12,
                //   timeMax: 18,
                // },
                // {
                //   type: 'auto',
                //   distanceMin: 8,
                //   distanceMax: 16,
                //   timeMin: 12,
                //   timeMax: 18,
                // }
            ],
        }
    }

    switch (action.type) {
        case SET_SOURCE:
        case INPUT_SOURCE:
            return Object.assign({}, state, { source: action.payload });
        case SET_DESTINATION:
        case INPUT_DESTINATION:
            return Object.assign({}, state, { destination: action.payload });
        case SET_SOURCE_LOCATIONS:
            return Object.assign({}, state, { sourceLocations: action.payload });
        case SET_DESTINATION_LOCATIONS:
            return Object.assign({}, state, { destinationLocations: action.payload });
        case SET_ROUTES:
            const routes = action.payload;
            const dist = {};
            for (const idx in routes) {
                const route = routes[idx];
                if (undefined === dist[route.type]) {
                    dist[route.type] = {
                        time: [],
                        distance: [],
                    }
                }

                dist[route.type].time.push(route.time);
                dist[route.type].distance.push(route.distance);
            }

            const routesInfo = [];
            for (const key in dist) {
                routesInfo.push(
                    {
                        type: key,
                        distanceMin: (Math.min.apply(Math, dist[key].distance) / 1000.0).toFixed(2),
                        distanceMax: (Math.max.apply(Math, dist[key].distance) / 1000.0).toFixed(2),
                        timeMin: (Math.max.apply(Math, dist[key].time) / 3600.0).toFixed(2),
                        timeMax: (Math.max.apply(Math, dist[key].time) / 3600.0).toFixed(2),
                    }
                );
            }

            return Object.assign({}, state, { routes: routesInfo });

        default:
            return state;
    }
}

const selectorSearch = state => state.search;

export const selectors = {
    search: {
        root: selectorSearch,
        sourceLocations: state => selectors.search.root(state).sourceLocations,
        destinationLocations: state => selectors.search.root(state).destinationLocations,
        firstSourceLocation: state => {
            const sources = selectors.search.sourceLocations(state);
            if (sources.length > 0) {
                return sources[0];
            }

            return undefined;
        },
        firstDestinationLocation: state => {
            const destinations = selectors.search.destinationLocations(state);
            if (destinations.length > 0) {
                return destinations[0];
            }

            return undefined;
        }
    },
    error: {
        errorsList: state => {
            const error = state.error.error;
            if ('' === error) {
                return [];
            }
            return [ error ];
        },
    }
}

export default combineReducers({
    search,
    error,
});
