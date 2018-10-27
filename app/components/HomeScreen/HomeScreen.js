import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
} from 'react-native'
import RoutesView from '../RoutesView'
import AddressInput from '../AddressInput'
import MapElement from '../MapElement'
import ErrorView from '../ErrorView'

const screenSize = Dimensions.get('window')

export default class DistanceCalculator extends Component {
    render() {
        return (
            <View style={styles.container}>
                <MapElement
                    style={{ width: screenSize.width, height: screenSize.height, position: 'absolute' }}
                    onPress={event => this.props.selectMapPoint(event.nativeEvent.coordinate)}
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
                        isHiglighted={ this.props.sourceLocations.length === 1 }
                    />
                    <AddressInput
                        label='Destination'
                        placeholder='Work address'
                        onChange={(destinationAddress) => this.props.setDestination(destinationAddress)}
                        value={this.props.destination}
                        isHiglighted={ this.props.destinationLocations.length === 1 }
                    />

                    <RoutesView items={this.props.routes} />

                </View>
            </View>
        )
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
})
