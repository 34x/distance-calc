import {
    SHOW_ERROR,
    HANDLE_ERROR,
    CLEAR_ERROR,
} from './actions';

export default function error(state, action) {
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
