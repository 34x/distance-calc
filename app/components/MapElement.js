import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';

const screenSize = Dimensions.get('window');

export default MapElement = (props) => {
    return (
        <MapView
          style={{ width: screenSize.width, height: screenSize.height, position: 'absolute' }}
          onPress={props.onMapPress.bind(this)}
        >
          {
            props.sourceLocations.map((location) => {
              return <MapView.Marker
                key={location.location}
                pinColor="blue"
                coordinate={location.location}
              />
            })
          }
          {
            props.destinationLocations.map((location) => {
              return <MapView.Marker
                key={location.location}
                pinColor="green"
                coordinate={location.location}
              />
            })
          }
        </MapView>
    );
}