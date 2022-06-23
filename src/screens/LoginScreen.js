import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Animated,
	TextInput,
	ActivityIndicator,
	TouchableHighlight
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NetworkStatusBar from '../components/NetworkStatusBar';
import {connect} from 'react-redux';
import {iniciarSesion} from '../functions';
import {normalize} from '../helpers/normalize';

class LoginScreen extends React.Component {
	state = {
		rut: '',
		password: '',
		error: '',
		isLoading: false,
		fadeAnim: new Animated.Value(0) // Opacidad del contenedor del form (transition)
	};

	static navigationOptions = {
		title: 'Login',
		headerShown: false
	};

	componentDidMount() {
		// *Propiedades del efecto de animación utilizado para la carga del componente Login
		Animated.timing(this.state.fadeAnim, {
			toValue: 1,
			duration: 3000,
			useNativeDriver: true
		}).start();
	}

	// *Función a ejecutarse si existe conexión a internet
	// *La valiación previa se realiza en la función '_signInAync'
	_onlineSignIn = () => {
		this.setState({
			error: ''
		});
		this.props
			.iniciarSesion(this.state.rut, this.state.password)
			.then($result => {
				if ($result === 200) {
					// Si la respuesta de la función es 200 se asume que los datos de ingreso son correctos por lo que se inicia sesión
					this.props.navigation.navigate('SignInStack');
				}
			})
			.catch(error => {
				this.setState({error: error, isLoading: false});
			});
	};

	// Función asíncrona para solicitar respuesta de la api y realizar el login
	_signInAsync = () => {
		// *Validación de campos (states)
		if (
			this.state.rut == '' ||
			this.state.password == '' ||
			this.state.rut == null ||
			this.state.password == null
		) {
			this.setState({error: 'Completa los campos solicitados'});
			// *Setea el estado de mensaje de error
		} else {
			this.setState({isLoading: true});
			// *Validación del estado de conexión
			NetInfo.fetch().then(state => {
				if (state.isConnected) {
					this._onlineSignIn();
				} else {
					alert('Sin Conexión a internet');
					this.setState({isLoading: false});
				}
			});
		}
	};

	_renderButtonSignIn() {
		return (
			<TouchableHighlight
				style={styles.btnIngresar}
				onPress={this._signInAsync}>
				<Text
					style={{
						fontSize: normalize(13),
						color: '#43aff2',
						alignSelf: 'center'
					}}>
					Ingresar
				</Text>
			</TouchableHighlight>
		);
	}

	render() {
		let {fadeAnim} = this.state;
		// *Loader visual
		const load = <ActivityIndicator size="large" color="#007bff" />;
		// *Botón de logueo
		return (
			<View style={styles.container}>
				<NetworkStatusBar />
				<Animated.View
					style={{
						...this.props.style,
						opacity: fadeAnim
					}}>
					<View>
						<Image
							source={require('./../assets/logo-erc.png')}
							style={styles.logo}
						/>
						<Text style={styles.loginTittle}>Registro de cargas diesel</Text>
						<View style={styles.formContainer}>
							<View style={styles.form}>
								<Text style={styles.formTittle}>Iniciar sesión</Text>
								<TextInput
									style={styles.inputText}
									value={this.state.rut}
									placeholder="Rut"
									placeholderTextColor="#e6e6e6"
									onChangeText={text => this.setState({rut: text})}
								/>
								<TextInput
									style={styles.inputText}
									value={this.state.password}
									placeholder="Contraseña"
									secureTextEntry={true}
									placeholderTextColor="#e6e6e6"
									onChangeText={text => this.setState({password: text})}
								/>
								<View style={styles.submitContainer}>
									{this.state.isLoading ? load : this._renderButtonSignIn()}
								</View>
								<Text style={styles.errorMessage}>
									{this.state.error ? this.state.error : null}
								</Text>
							</View>
							<Text style={styles.footerText}>Energía Rio Claro</Text>
						</View>
					</View>
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		position: 'relative',
		paddingTop: 30,
		zIndex: 10000,
		backgroundColor: 'white'
	},
	inputText: {
		height: normalize(35),
		width: '100%',
		borderStyle: 'solid',
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 1,
		borderColor: 'white',
		paddingLeft: 15,
		fontSize: normalize(13),
		marginBottom: 15,
		color: 'white'
	},
	btnIngresar: {
		backgroundColor: 'white',
		height: normalize(35),
		borderRadius: 5,
		justifyContent: 'center',
		width: '100%'
	},
	errorMessage: {
		marginTop: 15,
		color: 'red',
		alignSelf: 'center',
		fontSize: normalize(13)
	},
	divider: {
		borderBottomColor: '#919191',
		borderBottomWidth: 1,
		marginBottom: 15
	},
	logo: {
		width: normalize(240),
		height: normalize(70),
		marginBottom: 10,
		alignSelf: 'center'
	},
	loginTittle: {
		marginTop: 5,
		textAlign: 'center',
		color: '#6e6e6e',
		fontSize: normalize(12)
	},
	submitContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 10
	},
	formContainer: {
		height: '100%',
		backgroundColor: '#43aff2',
		minWidth: '100%',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		marginTop: 30
	},
	form: {
		padding: 35,
		display: 'flex',
		justifyContent: 'center'
	},
	formTittle: {
		fontSize: normalize(20),
		color: 'white',
		fontWeight: 'bold',
		marginBottom: 15
	},
	footerText: {
		fontSize: normalize(8),
		color: 'white',
		textAlign: 'center'
	}
});

const mapDispatchToProps = dispatch => {
	//Convertir los actions de redux en propiedades
	return {
		iniciarSesion: (rut, pass) => dispatch(iniciarSesion(rut, pass))
	};
};

//Conexion del componente con el estado global 'redux'
export default connect(
	null,
	mapDispatchToProps
)(LoginScreen);
