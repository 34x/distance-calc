/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import Geo from './Geo';
import Routes from './Routes';

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
      //console.log('LOADER: ', this.state.loaderCount);
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

  prettyLocation(location) {
    const address = location.address;
    const keys = ['street', 'postalCode', 'area', 'country']
    let pretty = [];
    keys.forEach((key) => {
      if (address[key]) {
        pretty.push(address[key]);
      }
    });
    return pretty.join(', ');
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
      this.processRoutes(routes);
      this.load(-1)
    }).catch((error) => {
      this.load(-1)
      console.log('Routes request error: ', error);
    })
  }

  processRoutes(routes) {
    const dist = {};
    for (const idx in routes) {
      const route = routes[idx];
      if (undefined === dist[route.type]) {
        dist[route.type] = {
          time: [],
          distance: [],
        }
      }

      dist[route.type].time.push(route.time);
      dist[route.type].distance.push(route.distance);
    }

    const routesInfo = [];
    for (const key in dist) {
      routesInfo.push(
        {
          type: key,
          distanceMin: (Math.min.apply(Math, dist[key].distance) / 1000.0).toFixed(2),
          distanceMax: (Math.max.apply(Math, dist[key].distance) / 1000.0).toFixed(2),
          timeMin: (Math.max.apply(Math, dist[key].time) / 3600.0).toFixed(2),
          timeMax: (Math.max.apply(Math, dist[key].time) / 3600.0).toFixed(2),
        }
      );
    }

    this.setState({ routes: routesInfo })
  }

  locationInfo(locations, type) {

    return (locations.length > 0 &&
      locations.map((el, idx) => {
      return (
          <TouchableHighlight key="{type}-{idx}">
            <Text style={styles.locationItem}>{this.prettyLocation(el)}</Text>
          </TouchableHighlight>
        );
      })
    );
  }

  onMapPress(event) {

    const address = `${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`;
    const {
      sourceAddress, destinationAddress,
      sourceLocations, destinationLocations,
    } = this.state;
    console.log(address);
    if (0 === sourceLocations.length || destinationLocations.length > 0) {
      this.setState({
        sourceAddress: address,
        sourceLocations: [
          {location: event.nativeEvent.coordinate}
        ]
      })
    } else {
      this.setState({
        destinationAddress: address,
        destinationLocations: [
          {location: event.nativeEvent.coordinate}
        ]
      })
    }
  }

  render() {
    const screenSize = Dimensions.get('window');
    const sourceStyle = 1 === this.state.sourceLocations.length ? styles.locationCorrect : null;
    const destStyle = 1 === this.state.destinationLocations.length ? styles.locationCorrect : null;

    return (
      <View style={styles.container}>
        <MapView
          style={{ width: screenSize.width, height: screenSize.height, position: 'absolute' }}
          onPress={this.onMapPress.bind(this)}
        >
          {
            this.state.sourceLocations.map((location) => {
              return <MapView.Marker
                key={location.location}
                pinColor="blue"
                coordinate={location.location}
              />
            })
          }
          {
            this.state.destinationLocations.map((location) => {
              return <MapView.Marker
                key={location.location}
                pinColor="green"
                coordinate={location.location}
              />
            })
          }
        </MapView>
        <View style={styles.labelContaner}>
          <Text style={styles.label}>Source</Text>
        </View>
        <TextInput
          placeholder="Home address"
          style={[styles.input, sourceStyle]}
          onChangeText={(sourceAddress) => this.setState({sourceAddress})}
          value={this.state.sourceAddress}
        />
        {
          // this.locationInfo(this.state.sourceLocations, POINT_TYPE.SOURCE)
          // for the future to handle different locations for one address
        }
        <View style={styles.labelContaner}>
          <Text style={styles.label}>Destination</Text>
        </View>
        <TextInput
          placeholder="Work address"
          style={[styles.input, destStyle]}
          onChangeText={(destinationAddress) => this.setState({destinationAddress})}
          value={this.state.destinationAddress}
        />
        { this.state.loaderCount > 0 &&
          <Text style={styles.loader}>Loading</Text>
        }

        <Routes items={this.state.routes} />

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
  input: {
    height: 52,
    backgroundColor: 'white'
  },
  labelContaner : {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    fontSize: 16,
    padding: 4,
  },
  locationCorrect: {
    backgroundColor: '#64C65E',
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