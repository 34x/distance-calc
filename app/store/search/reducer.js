import {
    CLEAR_ERROR,
    HANDLE_ERROR,
    INPUT_DESTINATION,
    INPUT_SOURCE,
    SELECT_MAP_POINT,
    SET_DESTINATION,
    SET_DESTINATION_LOCATIONS,
    SET_ROUTES,
    SET_SOURCE,
    SET_SOURCE_LOCATIONS,
    SHOW_ERROR,
} from './actions';

export default function search(state, action) {
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

export const selectors = {
    sourceLocations: state => state.sourceLocations,
    destinationLocations: state => state.destinationLocations,
    firstSourceLocation: state => {
        const sources = selectors.sourceLocations(state);
        if (sources.length > 0) {
            return sources[0];
        }

        return undefined;
    },
    firstDestinationLocation: state => {
        const destinations = selectors.destinationLocations(state);
        if (destinations.length > 0) {
            return destinations[0];
        }

        return undefined;
    }
}