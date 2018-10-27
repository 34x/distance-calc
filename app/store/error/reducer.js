import {
    SHOW_ERROR,
    CLEAR_ERROR,
} from './actions'

export default function error(state, action) {
    if (typeof state === 'undefined') {
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
        return state
    }
}

export const selectors = {
    errorsList: state => {
        const error = state.error
        if (error === '') {
            return []
        }
        return [ error ]
    },
}
