import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import r from './store';
import Calculator from './DistanceCalculatorContainer';


const store = createStore(
  r.reducer,
);

export default App = () =>  {
  return (
    <Provider store={store}>
      <Calculator />
    </Provider>
  );
}
