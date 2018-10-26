import {
    call,
    put,
    takeEvery,
    takeLatest,
    select,
    all,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Geo from '../../Geo';
import {
    INPUT_DESTINATION,
    INPUT_SOURCE,
    SELECT_MAP_POINT,
    SET_DESTINATION_LOCATIONS,
    SET_SOURCE_LOCATIONS,
    setDestination,
    setDestinationLocations,
    setRoutes,
    setSource,
    setSourceLocations,
} from './actions';
import { handleError } from '../error/actions';
import { selectors } from '../reducer';

const geo = new Geo();

function fetchLocations(address) {
    const minAddressLength = 1;

    if (address.length < minAddressLength) {
        return [];
    }

    if (0 === address.search(/^[\d\., ]+$/)) {
      // Assume we entered coordinates,
      // but since we don't handle it yet properly (reverse geocoding) skip update
      return [];
    }

    return geo.geocodeAddress(address)
}

function* fetchSource(action) {
    try {
        yield delay(1000);
        const locations = yield call(fetchLocations, action.payload);
        yield put(setSourceLocations(locations))
    } catch (e) {
        yield put(handleError({
            type: 'Fetch source error',
            error: e
        }));
    }

}

function* fetchDestination(action) {
    try {
        yield delay(1000);
        const locations = yield call(fetchLocations, action.payload);
        yield put(setDestinationLocations(locations))
    } catch (e) {
        yield put(handleError({
            type: 'Fetch destination error',
            error: e
        }));
    }
}

function requestRoutes(points) {
    return geo.requestRoutes(points);
}

function* calculateDistance(action) {
    try {
        const source = yield select(selectors.search.firstSourceLocation);
        const destination = yield select(selectors.search.firstDestinationLocation);

        if (undefined === source || undefined === destination) {
            return;
        }

        const routes = yield call(requestRoutes, [source, destination]);
        yield put(setRoutes(routes));
    } catch(e) {
        yield put(handleError({
            type: 'Calculate distance error',
            error: e
        }));
    }
}

function* selectMapPoint(action) {
    try {
        const address = `${action.payload.latitude}, ${action.payload.longitude}`;
        const {
          sourceLocations, destinationLocations,
        } = yield select(selectors.search.root);

        if (0 === sourceLocations.length) {
            yield put(setSource(address))
            yield put(setSourceLocations([ { location: action.payload } ]))
        } else if (0 === destinationLocations.length) {
            yield put(setDestination(address))
            yield put(setDestinationLocations([ { location: action.payload } ]))
        } else {
            yield put(setSource(address))
            yield put(setDestination(''))
            yield put(setSourceLocations([ { location: action.payload } ]))
            yield put(setDestinationLocations([]))
        }
    } catch (e) {
        yield put(handleError({
            type: 'Select map point error',
            error: e
        }));
    }
}

export default function* searchSaga() {
    try {
        yield all([
            takeLatest(INPUT_SOURCE, fetchSource),
            takeLatest(INPUT_DESTINATION, fetchDestination),
            takeLatest(SELECT_MAP_POINT, selectMapPoint),
            takeLatest([SET_DESTINATION_LOCATIONS, SET_SOURCE_LOCATIONS], calculateDistance),
            takeLatest([SET_DESTINATION_LOCATIONS, SET_SOURCE_LOCATIONS], calculateDistance),
        ]);
    } catch (e) {
        yield put(handleError({
            type: 'Search saga error',
            error: e
        }));
    }
}
