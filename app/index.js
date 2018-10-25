import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import r from './store';
import Calculator from './DistanceCalculatorContainer';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  r.reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(r.saga)

export default App = () =>  {
  return (
    <Provider store={store}>
      <Calculator />
    </Provider>
  );
}
