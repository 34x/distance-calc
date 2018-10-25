import {
    call,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Geo from '../Geo';
import {
    SET_SOURCE,
    SET_DESTINATION,
    setSourceLocations,
    setDestinationLocations,
} from './actions';

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

function* rootSaga() {
    try {
        yield takeLatest(SET_SOURCE, fetchSource);
        yield takeLatest(SET_DESTINATION, fetchDestination);
    } catch (e) {
        console.error(e);
    }
}

export default rootSaga;