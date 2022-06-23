import React from 'react';
import {View, Text, StyleSheet, AppRegistry} from 'react-native';
import {NetworkProvider, NetworkConsumer} from 'react-native-offline';

class NetworkStatusBar extends React.Component {
	render() {
		return (
			<NetworkProvider style={{position: 'absolute', zIndex: 20000}}>
				<View style={styles.container}>
					<NetworkConsumer>
						{({isConnected}) =>
							!isConnected ? (
								<View style={styles.textContainer}>
									<Text style={styles.text}>Sin conexión a internet</Text>
								</View>
							) : null
						}
					</NetworkConsumer>
				</View>
			</NetworkProvider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		position: 'absolute',
		top: 0,
		zIndex: 100000,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	textContainer: {
		width: '100%',
		backgroundColor: 'yellow',
		height: 25,
		justifyContent: 'center'
	},
	text: {
		fontSize: 13,
		color: 'red',
		textAlign: 'center'
	}
});

export default NetworkStatusBar;
