import React from 'react';
import {ActivityIndicator, StatusBar, View, Image, Text} from 'react-native';
import {connect} from 'react-redux';
class AuthValidator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //* Al abir la aplicación se validará si existen datos de usuario logueado
    this._validarInicioDeSesion();
  }

  _validarInicioDeSesion = () => {
    const signInData = this.props.signInData;
    // Validar si existe data de login y el rut es válido
    setTimeout(() => {
      if (signInData.length > 0) {
        // *En caso de que SI existan datos se envía al usuario a la pantalla de principal de registro de despachos
        this.props.navigation.navigate('SignInStack');
      } else {
        //* Si NO existen datos se envía al usuario a la pantalla de login
        this.props.navigation.navigate('LoginScreen');
      }
    }, 3000);
  };

  // Render any loading content that you like here
  render() {
    return (
      <View
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <View
          style={{
            padding: 15,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Image
            source={require('./../assets/logo-erc.png')}
            style={{
              width: 200,
              height: 50,
              marginBottom: 25,
            }}
          />
          <Text style={{textAlign: 'center', marginBottom: 25}}>
            Versión 1.0
          </Text>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    signInData: state.signInData,
  };
}

//Conexion del componente con el estado global 'redux'
export default connect(mapStateToProps)(AuthValidator);
