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
import Geo from './Geo';
import RoutesView from './components/RoutesView';
import AddressInput from './components/AddressInput'
import MapElement from './components/MapElement'

const geo = new Geo();

const POINT_TYPE = {
  SOURCE: 'source',
  DESTINATION: 'destination',
}

export default class DistanceCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceAddress: '',
      destinationAddress: '',
      checkTimers: {},
      sourceLocations: [],
      destinationLocations: [],
      minAddressLength: 4,
      routes: [
        // {
        //   type: 'walk',
        //   distanceMin: 8,
        //   distanceMax: 12,
        //   timeMin: 12,
        //   timeMax: 18,
        // },
        // {
        //   type: 'auto',
        //   distanceMin: 8,
        //   distanceMax: 16,
        //   timeMin: 12,
        //   timeMax: 18,
        // }
      ],
      loaderCount: 0,
    };
  }

  load(incr) {
      this.setState({loaderCount: this.state.loaderCount + incr});
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      sourceAddress, destinationAddress,
      sourceLocations, destinationLocations
    } = nextState;

    if (this.state.sourceAddress !== sourceAddress) {
      this.getLocations(sourceAddress, POINT_TYPE.SOURCE);
    }
    if (this.state.destinationAddress !== destinationAddress) {
      this.getLocations(destinationAddress, POINT_TYPE.destination);
    }

    if (sourceLocations !== this.state.sourceLocations
      || destinationLocations !== this.state.destinationLocations) {
      this.calculateDistance(sourceLocations, destinationLocations);
    }
  }

  getLocations(address, type) {
    clearTimeout(this.state.checkTimers[type]);
    if (0 === address.search(/^[\d\., ]+$/)) {
      // Assume we entered coordinates,
      // but since we don't handle it yet properly (reverse geocoding) skip update
      return;
    }
    if (address.length < this.state.minAddressLength) {
      if (POINT_TYPE.SOURCE === type) {
        this.setState({ sourceLocations: [] });
      } else {
        this.setState({ destinationLocations: [] });
      }
      return;
    }

    const timerID = setTimeout(() => {
      this.setState({
        routes: [],
      });

      this.load(1);

      geo.geocodeAddress(address)
        .then((locations) => {
          console.log('Got locations: ', locations);
          if (POINT_TYPE.SOURCE === type) {
            this.setState({ sourceLocations: locations });
          } else {
            this.setState({ destinationLocations: locations });
          }
          this.load(-1)
        })
        .catch((error) => {
          this.load(-1)
          console.log('Geocode error: ', error);
          if (POINT_TYPE.SOURCE === type) {
            this.setState({ sourceLocations: [] });
          } else {
            this.setState({ destinationLocations: [] });
          }
        });
    }, 700);

    const newTimerState = {};
    newTimerState[type] = timerID;
    const newTimers = Object.assign({}, this.state.checkTimers, newTimerState);
    this.setState({ checkTimers: newTimers});
  }

  calculateDistance(sourceLocations, destinationLocations) {
    if (0 === sourceLocations.length || 0 === destinationLocations.length) {
      return;
    }
    // this.setState({ sourceLocations: [], destinationLocations: [] });
    const source = sourceLocations[0];
    const destination = destinationLocations[0];

    this.load(1);
    geo.requestRoutes([source, destination]).then((routes, allErrors) => {
      console.log('Found routes: ', routes);
      this.props.setRoutes(routes);
      this.load(-1)
    }).catch((error) => {
      this.load(-1)
      console.log('Routes request error: ', error);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapElement
          onMapPress={event => this.props.selectMapPoint(event.nativeEvent.coordinate)}
          sourceLocations={this.props.sourceLocations}
          destinationLocations={this.props.destinationLocations}
        />

        <View style={styles.controlsContainer}>
          <AddressInput
            label='Source'
            placeholder='Home address'
            onChange={(sourceAddress) => this.props.setSource(sourceAddress)}
            value={this.props.source}
            isHiglighted={ 1 === this.state.sourceLocations.length }
          />
          <AddressInput
            label='Destination'
            placeholder='Work address'
            onChange={(destinationAddress) => this.props.setDestination(destinationAddress)}
            value={this.props.destination}
            isHiglighted={ 1 === this.state.destinationLocations.length }
          />

          { this.state.loaderCount > 0 &&
            <Text style={styles.loader}>Loading</Text>
          }

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
