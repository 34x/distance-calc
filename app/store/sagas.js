import {
    all,
    fork,
} from 'redux-saga/effects'

import searchSaga from './search/sagas'
import errorSaga from './error/sagas'

export default function* rootSaga() {
    try {
        yield all([
            fork(errorSaga),
            fork(searchSaga),
        ])
    } catch (e) {
        console.error(e)
    }
}
