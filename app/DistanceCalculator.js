import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import MapView from 'react-native-maps';
import RoutesView from './components/RoutesView';
import AddressInput from './components/AddressInput';
import MapElement from './components/MapElement';
import ErrorView from './components/ErrorViewContainer';

const POINT_TYPE = {
  SOURCE: 'source',
  DESTINATION: 'destination',
}

export default class DistanceCalculator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapElement
          onMapPress={event => this.props.selectMapPoint(event.nativeEvent.coordinate)}
          sourceLocations={this.props.sourceLocations}
          destinationLocations={this.props.destinationLocations}
        />

        <View style={styles.controlsContainer}>
          <ErrorView />
          <AddressInput
            label='Source'
            placeholder='Home address'
            onChange={(sourceAddress) => this.props.setSource(sourceAddress)}
            value={this.props.source}
            isHiglighted={ 1 === this.props.sourceLocations.length }
          />
          <AddressInput
            label='Destination'
            placeholder='Work address'
            onChange={(destinationAddress) => this.props.setDestination(destinationAddress)}
            value={this.props.destination}
            isHiglighted={ 1 === this.props.destinationLocations.length }
          />

          <RoutesView items={this.props.routes} />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#E6F5FF',
  },
  controlsContainer: {
    paddingTop: 50,
    width: '90%',
  },
  locationItem: {
    height: 52,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#E6F5FF',
  },
  loader: {
    fontSize: 20,
    margin: 16,
    padding: 8,
  }
});
