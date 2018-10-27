import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native'
import PropTypes from 'prop-types'

const ErrorView = (props) => {
    if (props.errors.length === 0) {
        return null
    }

    return (
        <TouchableHighlight
            onPress={props.close}
            style={styles.errorContainer}>
            <View>
                {
                    props.errors.map((e, index) => {
                        return (<Text key={`error-${index}`}>{e}</Text>)
                    })
                }
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        backgroundColor: '#FD5E52',
        padding: 4,
    },
})

ErrorView.propTypes = {
    errors: PropTypes.array,
    close: PropTypes.function,
}

export default ErrorView
