import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native'

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

export default ErrorView
