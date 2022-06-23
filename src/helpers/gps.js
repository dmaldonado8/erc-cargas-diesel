import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default class GPS {
	// Función para obtener el permiso del usuario para utilzar el gps del dispositivo
	static async GPSPersmission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: 'Acceso a GPS del dispositivo',
					message:
						'Esta aplicación necesita utilizar el gps del móvil para entregar un mejor servicio',
					buttonNeutral: 'Preguntarme después',
					buttonNegative: 'Cancelar',
					buttonPositive: 'Aceptar'
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				// Obtener localización del usuario
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.warn(err);
		}
	}

	static async GPSCurrentPosition() {
		// Consultar por el acceso al gps
		const permiso = await this.GPSPersmission();
		var response;
		if (permiso) {
			// Obtener localización del usuario
			Geolocation.getCurrentPosition(
				position => {
					response = {
						lat: position.coords.latitude.toString(),
						long: position.coords.longitude.toString()
					};
				},
				error => {
					response = 'GPS_NO_ACTIVADO';
				},
				{
					enableHighAccuracy: true,
					timeout: 3000,
					maximumAge: 10000
				}
			);
		} else {
			return 'SIN_PERMISOS';
		}
	}
}
