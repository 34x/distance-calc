import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';


export default ErrorView = (props) =>  {

    if (0 === props.errors.length) {
        return null;
    }

    return (
        <View style={styles.errorContainer}>
            {
                props.errors.map(e => {
                    return (<Text key={e}>{e}</Text>)
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
  errorContainer: {
      backgroundColor: '#FD5E52',
      padding: 4,
  },
});
