import React, { Component } from 'react'
import MapView from 'react-native-maps'

export default class MapElement extends Component {
    constructor(props) {
        super(props)
        this.state = { source: undefined, destination: undefined }
        this.map = null
    }

    componentDidUpdate() {
        let source
        let destination

        if (this.props.sourceLocations.length > 0) {
            source = this.props.sourceLocations[0]
        }
        if (this.props.destinationLocations.length > 0) {
            destination = this.props.destinationLocations[0]
        }

        if (undefined !== source && this.state.source !== source) {
            this.map.animateToCoordinate(source.location, 2000)
            this.setState({ source })
        }

        if (undefined !== destination && this.state.destination !== destination) {
            this.map.animateToCoordinate(destination.location, 2000)
            this.setState({ destination })
        }
    }

    render() {
        const props = this.props
        return (
            <MapView
                ref= { ref => { this.map = ref; return true }}
                style={props.style}
                onPress={props.onPress.bind(this)}
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
        )
    }
}
