import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import r from './store'
import HomeScreen from './components/HomeScreen'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    r.reducer,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(r.saga)

const App = () => {
    return (
        <Provider store={store}>
            <HomeScreen />
        </Provider>
    )
}

export default App
