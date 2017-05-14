import { NativeModules } from 'react-native';
const GeoNative = NativeModules.Geo;

export default class GeoIOS {
	geocodeAddress(address) {
		return new Promise((resolve, reject) => {
			GeoNative.geocodeAddress(address, (error, points) => {
				if (error) {
					return reject(error);
				}
				resolve(points)
			});
		});
	}

	requestRoutes(points) {
		return new Promise((resolve, reject) => {
			GeoNative.requestRoutes(points, (error, routes, allErrors) => {
				// if (error) {
				// 	return reject(error);
				// }
				resolve(routes, allErrors)
			});
		});
	}
}