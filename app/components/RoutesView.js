import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';


export default RoutesView = (props) => {

	const routes = props.items.map((el) => {
	  let time;
	  let dist;
	  if (el.timeMax === el.timeMin) {
	    time = `${el.timeMax}h`;
	  } else {
	    time = `${el.timeMin}h - ${el.timeMax}h`
	  }

	  if (el.distanceMax === el.distanceMin) {
	    dist = `${el.distanceMax}km`;
	  } else {
	    dist = `${el.distanceMin}km - ${el.distanceMax}km`
	  }

	  return (
	    <View style={styles.routeInfo} key={el.type}>
	      <Text>{el.type}</Text>
	      <Text style={styles.routeLabel}>Time: { time }</Text>
	      <Text style={styles.routeLabel}>Distance: { dist }</Text>
	    </View>
	  )
	})

	return(
		<View style={ styles.container }>
          <View style={{flex: 1, flexDirection: 'column'}}>
            { routes }
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#E6F5FF'
	},
	routeInfo: {
		flexDirection: 'column',
		margin: 8,
	},
	routeLabel: {
		fontSize: 16,
		textAlign: 'left',
	},
});
