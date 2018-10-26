import {
    call,
    put,
    takeEvery,
    takeLatest,
    select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Geo from '../Geo';
import {
    INPUT_SOURCE,
    INPUT_DESTINATION,
    SET_SOURCE_LOCATIONS,
    SET_DESTINATION_LOCATIONS,
    SELECT_MAP_POINT,
    setSource,
    setDestination,
    setSourceLocations,
    setDestinationLocations,
    setRoutes,
} from './actions';
import { selectors } from './reducers';

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
    yield delay(1000);
    const locations = yield call(fetchLocations, action.payload);
    yield put(setSourceLocations(locations))
}

function* fetchDestination(action) {
    yield delay(1000);
    const locations = yield call(fetchLocations, action.payload);
    yield put(setDestinationLocations(locations))
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
        console.error('Calculate distance error: ' + e)
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
        console.error('selectMapPointError: ' + e);
    }
}


function* rootSaga() {
    try {
        yield takeLatest(INPUT_SOURCE, fetchSource);
        yield takeLatest(INPUT_DESTINATION, fetchDestination);
        yield takeLatest(SELECT_MAP_POINT, selectMapPoint);
        yield takeLatest([SET_DESTINATION_LOCATIONS, SET_SOURCE_LOCATIONS], calculateDistance);
    } catch (e) {
        console.error(e);
    }
}

export default rootSaga;