import { combineReducers } from 'redux';

import search from './search/reducer';
import error from './error/reducer';


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
