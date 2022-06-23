import React, {Component} from 'react';
import {Modal, View, ActivityIndicator, StyleSheet, Text} from 'react-native';

class ModalLoad extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal transparent={true} visible={this.props.modalVisible}>
				<View style={styles.modalBase}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTittle}>Espera</Text>
						<View style={{padding: 20}}>
							<ActivityIndicator size="large" color="#007bff" />
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modalBase: {
		backgroundColor: 'rgba(35, 35, 35, .8)',
		height: '100%',
		justifyContent: 'center',
		paddingTop: 20,
		paddingBottom: 20
	},
	modalContainer: {
		backgroundColor: 'white',
		margin: 20,
		position: 'relative',
		borderRadius: 5
	},
	modalTittle: {
		fontSize: 20,
		textAlign: 'center'
	}
});

export default ModalLoad;
