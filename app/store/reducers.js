import { combineReducers } from 'redux';
import {
    SET_SOURCE,
    SET_DESTINATION,
    SET_SOURCE_LOCATIONS,
    SET_DESTINATION_LOCATIONS,
    SELECT_MAP_POINT,
} from './actions';

function search(state, action) {
    if ('undefined' === typeof state) {
        return {
            source: '',
            destination: '',
            sourceLocations: [],
            destinationLocations: [],
            routes: [],
        }
    }

    switch (action.type) {
        case SET_SOURCE:
            return Object.assign({}, state, { source: action.payload });
        case SET_DESTINATION:
            return Object.assign({}, state, { destination: action.payload });
        case SELECT_MAP_POINT:
            const address = `${action.payload.latitude}, ${action.payload.longitude}`;
            const {
              source, destination,
              sourceLocations, destinationLocations,
            } = state;

            if (0 === sourceLocations.length) {
                return Object.assign({},
                    state,
                    {
                        source: address,
                        sourceLocations: [ { location: action.payload } ]
                    }
                );
            } else if (0 === destinationLocations.length) {
                return Object.assign({},
                    state,
                    {
                        destination: address,
                        destinationLocations: [ { location: action.payload } ]
                    }
                );
            } else {
                return Object.assign({},
                    state,
                    {
                        source: address,
                        destinationAddress: '',
                        sourceLocations: [ { location: action.payload } ],
                        destinationLocations: [],
                    }
                );
            }
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

export default combineReducers({
    search,
});
