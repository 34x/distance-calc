export const CLEAR_ERROR = 'CLEAR_ERROR'
export const HANDLE_ERROR = 'HANDLE_ERROR'
export const SHOW_ERROR = 'SHOW_ERROR'

export function handleError(payload) {
    return { type: HANDLE_ERROR, payload: payload }
}

export function showError(text) {
    return { type: SHOW_ERROR, payload: text }
}

export function clearError() {
    return { type: CLEAR_ERROR }
}
