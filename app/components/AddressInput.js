import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native'
import PropTypes from 'prop-types'

const AddressInput = (props) => {
    return (
        <View>
            <View style={styles.labelContaner}>
                <Text style={styles.label}>{ props.label }</Text>
            </View>
            <View style={[styles.inputContainer, props.isHiglighted && styles.highlight]}>
                <TextInput
                    placeholder={ props.placeholder }
                    style={[styles.input]}
                    onChangeText={props.onChange}
                    value={props.value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: 'white',
        padding: 4,
    },
    input: {
        height: 42,
        width: '100%',
    },
    labelContaner: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingLeft: 4,
        opacity: 0.8,
    },
    label: {
        flex: 1,
        fontSize: 16,
        paddingBottom: 4,
        paddingTop: 4,
    },
    highlight: {
        backgroundColor: '#64C65E',
    },
})

AddressInput.propTypes = {
    label: PropTypes.string,
    isHiglighted: PropTypes.boolean,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.function,
}

export default AddressInput
