import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {removeSesionData} from '../redux/actions';
import {normalize} from '../helpers/normalize';
import {View, Text, TouchableHighlight, StyleSheet, Alert} from 'react-native';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Ajustes',
  };

  cerrarSesion() {
    Alert.alert(
      '¿Estás seguro?',
      '¿Deseas cerrar tu sesión y volver a la pantalla de registro?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Si está seguro se borran los datos y se envía al usuario a la pantalla de inicio de sesión
            this.props.removeSesionData();
            this.props.navigation.navigate('LoginScreen');
          },
        },
      ],
      {cancelable: false},
    );
  }

  sync() {
    // *Validación del estado de conexión
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // Si hay conexión se envía al usuario a la pantalla de sincronización
        this.props.navigation.navigate('SyncScreen', {type: 1});
      } else {
        alert('No hay conexión a internet');
      }
    });
  }

  upload() {
    if (
      this.props.dataCargasGeneradas.length > 0 ||
      this.props.cargasReabastecimiento.length > 0
    ) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          // Si hay conexión se envía al usuario a la pantalla de sincronización
          this.props.navigation.navigate('SyncScreen', {type: 2});
        } else {
          alert('No hay conexión a internet');
        }
      });
    } else {
      alert('No hay cargas pendientes por subir');
    }
  }

  cantidadPendientes() {
    const cg = parseInt(this.props.dataCargasGeneradas.length);
    const cab = parseInt(this.props.cargasReabastecimiento.length);
    const suma = cg + cab;
    return suma;
  }

  render() {
    return (
      <View>
        <View style={styles.option}>
          <TouchableHighlight onPress={() => this.sync()} underlayColor={0.1}>
            <Text style={{fontSize: normalize(10)}}>Descargar datos</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.option}>
          <TouchableHighlight onPress={() => this.upload()} underlayColor={0.1}>
            <View style={styles.optionPendientes}>
              <Text style={{fontSize: normalize(10)}}>Subir pendientes</Text>
              <View style={styles.containerCantidadPendientes}>
                <Text style={styles.pendientesText}>
                  <Text style={styles.pendientesText}>
                    {this.cantidadPendientes()}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.option}>
          <View>
            <Text style={{fontSize: normalize(10)}}>Versión 1.0</Text>
          </View>
        </View>
        <View style={styles.option}>
          <TouchableHighlight
            onPress={() => this.cerrarSesion()}
            underlayColor={0.1}>
            <Text style={{fontSize: normalize(10)}}>Cerrar Sesión</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  option: {
    padding: 15,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8',
    backgroundColor: 'white',
  },
  optionPendientes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerCantidadPendientes: {
    backgroundColor: '#43aff2',
    height: 24,
    width: 24,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendientesText: {
    color: 'white',
    fontSize: 17,
  },
});

const mapDispatchToProps = dispatch => {
  //Convertir los actions de redux en propiedades
  return {
    removeSesionData: () => dispatch(removeSesionData()),
  };
};

const mapStateToProps = state => {
  return {
    dataCargasGeneradas: state.dataCargasGeneradas,
    cargasReabastecimiento: state.cargasReabastecimiento,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
