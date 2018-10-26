import {
    put,
    takeEvery,
    all,
    fork,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
    HANDLE_ERROR,
    showError,
    clearError,
} from './actions';
import { selectors } from '../reducer';

function* errorHandleSaga(action) {
    yield put(showError(action.payload));
    yield delay(5000);
    yield put(clearError());
}

export default function* errorSaga(action) {
    yield takeEvery(HANDLE_ERROR, errorHandleSaga);
}
