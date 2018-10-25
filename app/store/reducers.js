import { combineReducers } from 'redux';
import {
    SET_SOURCE,
    SET_DESTINATION,
    SET_SOURCE_LOCATIONS,
    SET_DESTINATION_LOCATIONS,
    SELECT_MAP_POINT,
} from './actions';

const initialState = {

};

function search(state, action) {
    if ('undefined' === typeof state) {
        return {
            source: '',
            destination: '',
            sourceLocations: [],
            destinationLocations: [],
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
        default:
            return state;
    }
}

export default combineReducers({
    search,
});
