import GeoPlatform from './Platforms/Geo';



export default class Geo {
	constructor() {
		this.platform = new GeoPlatform();
	}

	geocodeAddress(address) {
		return this.platform.geocodeAddress(address);
	}

	requestRoutes(points) {
		return this.platform.requestRoutes(points);
	}
}