import React from 'react';
import RadioButton from '../components/RadioButton';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Alert,
  CheckBox,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import GPS from '../helpers/gps';
import {
  SIN_INICIAR,
  INICIO_NORMAL,
  INICIO_NO_DISPONIBLE,
  HABILITACION_CAMION,
  FIN_JORNADA,
} from '../redux/constants';
import {
  cambiarEstadoJornada,
  addEventoJornada,
  definirFechaJornada,
  resetFechaJornada,
  definirUltimaJornada,
  actualizarLitros,
} from '../redux/actions';
import {subirDataAsync} from '../functions';
import {makeid} from '../helpers/functions';
import ModalLoad from './ModalLoad';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

class FormInicioJornada extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puedeContinuar: true,
      kilometraje: '',
      observacion: '',
      litros: '',
      date: '',
      lat: 'null',
      lng: 'null',
      sending: false,
      estadoSistemaElectrico: true,
      estadoSistemaFrenos: true,
      estadoNeumaticos: true,
      nivelAceite: true,
      nivelAgua: true,
    };
  }

  gpsEnabled = () => {
    return new Promise((resolve, reject) => {
      if (this.props.validarGPSActivo == 1) {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(data => {
            resolve();
            console.log(data);
          })
          .catch(err => {
            reject();
            console.log(err);
          });
      } else {
        resolve();
      }
    });
  };

  getGPSHour = () => {
    return new Promise((resolve, reject) => {
      const permiso = GPS.GPSPersmission();
      if (permiso) {
        this.setState({sending: true});
        Geolocation.getCurrentPosition(
          position => {
            var pos = {
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
            };
            let date = new Date(position.timestamp);
            this.setState({
              date: date,
              sending: false,
              lat: pos.lat,
              lng: pos.lng,
            });
            resolve();
          },
          error => {
            const date = new Date();
            this.setState({
              showButton: true,
              sending: false,
              date: date,
              lat: 'null',
              lng: 'null',
            });
            resolve();
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      } else {
        alert(
          'Para registrar el evento debes permitir que la aplicación tenga acceso al GPS',
        );
      }
    });
  };

  _renderFechaTelefono = () => {
    const date = new Date();
    let dia = '0' + date.getDate();
    let mes = '0' + (date.getMonth() + 1);
    let anio = date.getFullYear();
    return `${dia.substr(-2)}-${mes.substr(-2)}-${anio}`;
  };

  _renderFormInicioJornada = () => {
    return (
      <View>
        <View style={styles.containerFormInicioJornada}>
          <View>
            <Text style={{fontSize: 18, marginBottom: 15}}>
              Iniciar Jornada de trabajo
            </Text>
            <Text>BIENVENIDO {this.props.signInData[0].nombre}</Text>
            <Text style={{marginTop: 5}}>
              Iniciar jornada del dia {this._renderFechaTelefono()}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Kilometraje</Text>
            <TextInput
              keyboardType={'numeric'}
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({kilometraje: value})}
              value={this.state.kilometraje}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Litros</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({litros: value})}
              value={this.state.litros}
            />
          </View>
          <View style={{flexDirection: 'column', marginTop: 16}}>
            <Text style={{fontSize: 16, marginBottom: 10}}>
              Desmarque una opción solo si esta presenta alguna falla y describa
              el problema en el campo "Observación"
            </Text>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaElectrico}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaElectrico: !this.state.estadoSistemaElectrico,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema eléctrico</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaFrenos}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaFrenos: !this.state.estadoSistemaFrenos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema de frenos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoNeumaticos}
                onValueChange={() =>
                  this.setState({
                    estadoNeumaticos: !this.state.estadoNeumaticos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado neumáticos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAceite}
                onValueChange={() =>
                  this.setState({
                    nivelAceite: !this.state.nivelAceite,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de aceite</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAgua}
                onValueChange={() =>
                  this.setState({
                    nivelAgua: !this.state.nivelAgua,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de agua</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Observación: </Text>
            <TextInput
              style={styles.inputTextMulti}
              multiline={true}
              numberOfLines={4}
              value={this.state.observacion}
              onChangeText={text => this.setState({observacion: text})}
            />
          </View>
          <View style={styles.radioContainer}>
            <Text style={{fontSize: 16, marginBottom: 15}}>
              Según el estado del camión ¿puedes concretar tus giros?
            </Text>
            <RadioButton
              options={[
                {
                  TEXTO: 'SI',
                  VALUE: true,
                },
                {
                  TEXTO: 'NO',
                  VALUE: false,
                },
              ]}
              selectOption={this.selectOption}
              value={this.state.puedeContinuar}
            />
          </View>
          <View>
            <TouchableHighlight
              underlayColor="#8adaf2"
              style={[styles.btnAccion, {backgroundColor: '#59baaf'}]}
              onPress={() => this.cambiarEstadoJornada(1)}>
              <Text style={styles.btnText}>Iniciar Jornada</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  _formatFechaJornada = () => {
    let fechaD;
    if (this.props.fechaJornada == null) {
      const date = new Date();
      let dia = '0' + date.getDate();
      let mes = '0' + (date.getMonth() + 1);
      let anio = date.getFullYear();
      fechaD = `${mes.substr(-2)}-${dia.substr(-2)}-${anio}`;
    } else {
      fechaD = this.props.fechaJornada;
    }
    const fecha = fechaD.split('-');
    return `${fecha[1]}-${fecha[0]}-${fecha[2]}`;
  };

  _renderFormNoDisponible = () => {
    return (
      <View>
        <View style={styles.containerFormInicioJornada}>
          <View style={{marginBottom: 10}}>
            <Text style={{fontSize: 18}}>Camión no disponible</Text>
            <Text>BIENVENIDO {this.props.signInData[0].nombre}</Text>
            <Text>Jornada del dia {this._formatFechaJornada()}</Text>
          </View>
          <Text>Haz indicado que tu camión no está disponible:</Text>
          <Text>
            * Si el problema ha sido solucionado presiona "Habilitar camión"
            para ver tus viajes.
          </Text>
          <Text>
            * Si el problema aún existe al final del dia presiona "Terminar
            jornada".
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Kilometraje</Text>
            <TextInput
              keyboardType={'numeric'}
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({kilometraje: value})}
              value={this.state.kilometraje}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Litros</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({litros: value})}
              value={this.state.litros}
            />
          </View>
          <View style={{flexDirection: 'column', marginTop: 16}}>
            <Text style={{fontSize: 16, marginBottom: 10}}>
              Los elementos seleccionados se presentan en buen estado:{' '}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaElectrico}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaElectrico: !this.state.estadoSistemaElectrico,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema eléctrico</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaFrenos}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaFrenos: !this.state.estadoSistemaFrenos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema de frenos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoNeumaticos}
                onValueChange={() =>
                  this.setState({
                    estadoNeumaticos: !this.state.estadoNeumaticos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado neumáticos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAceite}
                onValueChange={() =>
                  this.setState({
                    nivelAceite: !this.state.nivelAceite,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de aceite</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAgua}
                onValueChange={() =>
                  this.setState({
                    nivelAgua: !this.state.nivelAgua,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de agua</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Observación: </Text>
            <TextInput
              style={styles.inputTextMulti}
              multiline={true}
              numberOfLines={4}
              value={this.state.observacion}
              onChangeText={text => this.setState({observacion: text})}
            />
          </View>
          <View>
            <TouchableHighlight
              underlayColor="#8adaf2"
              style={[styles.btnAccion, {backgroundColor: '#59baaf'}]}
              onPress={() => this.cambiarEstadoJornada(2)}>
              <Text style={styles.btnText}>Terminar Jornada</Text>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              underlayColor="#8adaf2"
              style={[styles.btnAccion, {backgroundColor: '#33658A'}]}
              onPress={() => this.cambiarEstadoJornada(3)}>
              <Text style={styles.btnText}>Habilitar camión</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  _renderFormFinalizarJornada = () => {
    return (
      <View>
        <View style={styles.containerFormInicioJornada}>
          <View>
            <Text style={{fontSize: 18}}>Finalizar jornada</Text>
            <Text>BIENVENIDO {this.props.signInData[0].nombre}</Text>
            <Text>Finalizar jornada del dia {this._formatFechaJornada()}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Kilometraje</Text>
            <TextInput
              keyboardType={'numeric'}
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({kilometraje: value})}
              value={this.state.kilometraje}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Litros</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Toca para escribir"
              onChangeText={value => this.setState({litros: value})}
              value={this.state.litros}
            />
          </View>
          <View style={{flexDirection: 'column', marginTop: 16}}>
            <Text style={{fontSize: 16, marginBottom: 10}}>
              Los elementos seleccionados se presentan en buen estado:{' '}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaElectrico}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaElectrico: !this.state.estadoSistemaElectrico,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema eléctrico</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoSistemaFrenos}
                onValueChange={() =>
                  this.setState({
                    estadoSistemaFrenos: !this.state.estadoSistemaFrenos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado sistema de frenos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.estadoNeumaticos}
                onValueChange={() =>
                  this.setState({
                    estadoNeumaticos: !this.state.estadoNeumaticos,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Estado neumáticos</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAceite}
                onValueChange={() =>
                  this.setState({
                    nivelAceite: !this.state.nivelAceite,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de aceite</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={this.state.nivelAgua}
                onValueChange={() =>
                  this.setState({
                    nivelAgua: !this.state.nivelAgua,
                  })
                }
              />
              <Text style={{marginTop: 5}}>Nivel de agua</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textForm}>Observación: </Text>
            <TextInput
              style={styles.inputTextMulti}
              multiline={true}
              numberOfLines={4}
              value={this.state.observacion}
              onChangeText={text => this.setState({observacion: text})}
            />
          </View>
          <View>
            <TouchableHighlight
              underlayColor="#8adaf2"
              style={[styles.btnAccion, {backgroundColor: '#59baaf'}]}
              onPress={() => this.cambiarEstadoJornada(4)}>
              <Text style={styles.btnText}>Terminar Jornada</Text>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              underlayColor="#8adaf2"
              style={[styles.btnAccion, {backgroundColor: '#9faabd'}]}
              onPress={() => this.props.cerrarFormJornada()}>
              <Text style={styles.btnText}>Volver a registro de carga</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  resetForm = () => {
    this.setState({
      lat: 'null',
      lng: 'null',
      date: '',
      observacion: '',
      kilometraje: '',
      puedeContinuar: true,
      estadoSistemaElectrico: true,
      estadoSistemaFrenos: true,
      estadoNeumaticos: true,
      nivelAceite: true,
      nivelAgua: true,
      litros: '',
    });
  };

  cambiarEstadoJornada = type => {
    if (
      isNaN(this.state.kilometraje) ||
      parseFloat(this.state.kilometraje) <= 0 ||
      this.state.kilometraje.trim() == '' ||
      isNaN(this.state.litros) ||
      parseFloat(this.state.litros) <= 0 ||
      this.state.litros.trim() == ''
    ) {
      alert('Ingresa un kilometraje válido');
      return;
    }
    this.gpsEnabled()
      .then(() => {
        Alert.alert('Confirmación', '¿Estás seguro de iniciar la acción?', [
          {
            text: 'Rechazar',
            onPress: () => {
              this.setState({sending: false});
              console.log('cancelada');
            },
          },
          {
            text: 'Aceptar',
            onPress: () => {
              this.getGPSHour().then(() => {
                let rut = this.props.signInData[0].rut;
                let usuarioId = this.props.signInData[0].userId;
                const date = this.state.date;
                let hours = '0' + date.getHours();
                let minutes = '0' + date.getMinutes();
                let dia = '0' + date.getDate();
                let mes = '0' + (date.getMonth() + 1);
                let anio = date.getFullYear();
                let fecha = `${mes.substr(-2)}-${dia.substr(-2)}-${anio}`;
                let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
                let tipoEvento = 0;
                let eventoCambio = 0;
                let fechaJornada = null;
                switch (type) {
                  case 1:
                    if (
                      this.props.ultimaJornada == fecha &&
                      this.props.validadorJornada == 1
                    ) {
                      alert('Previamente ya iniciaste jornada en esta fecha');
                      return;
                    }
                    if (this.state.puedeContinuar) {
                      tipoEvento = INICIO_NORMAL;
                      eventoCambio = INICIO_NORMAL;
                    } else {
                      tipoEvento = INICIO_NO_DISPONIBLE;
                      eventoCambio = INICIO_NO_DISPONIBLE;
                    }
                    this.props.definirFechaJornada(fecha);
                    fechaJornada =
                      this.props.fechaJornada == null
                        ? fecha
                        : this.props.fechaJornada;
                    break;
                  case 2:
                    tipoEvento = FIN_JORNADA;
                    eventoCambio = SIN_INICIAR;
                    fechaJornada =
                      this.props.fechaJornada == null
                        ? fecha
                        : this.props.fechaJornada;
                    this.props.resetFechaJornada();
                    break;
                  case 3:
                    tipoEvento = HABILITACION_CAMION;
                    eventoCambio = INICIO_NORMAL;
                    fechaJornada =
                      this.props.fechaJornada == null
                        ? fecha
                        : this.props.fechaJornada;
                    break;
                  case 4:
                    tipoEvento = FIN_JORNADA;
                    eventoCambio = SIN_INICIAR;
                    fechaJornada =
                      this.props.fechaJornada == null
                        ? fecha
                        : this.props.fechaJornada;
                    this.props.resetFechaJornada();
                    this.props.definirUltimaJornada(fechaJornada);
                    break;
                }
                this.props.addEventoJornada({
                  ID: makeid(),
                  RUT: rut,
                  USUARIOID: usuarioId,
                  FECHA: fecha,
                  FECHA_JORNADA: fechaJornada,
                  HORA: formattedTime,
                  EVENTO_JORNADA: tipoEvento,
                  LAT: this.state.lat,
                  LNG: this.state.lng,
                  KILOMETRAJE: this.state.kilometraje,
                  ESTADO_SISTEMA_ELECTRICO: this.state.estadoSistemaElectrico,
                  ESTADO_SISTEMA_FRENOS: this.state.estadoSistemaFrenos,
                  ESTADO_NEUMATICOS: this.state.estadoNeumaticos,
                  ESTADO_NIVEL_ACEITE: this.state.nivelAceite,
                  NIVEL_DE_AGUA: this.state.nivelAgua,
                  OBSERVACION: this.state.observacion,
                  LITROS: this.state.litros,
                });
                this.calcularLitrosStock(this.state.litros);
                this.resetForm();
                this.props.subirDataAsync();
                this.props.cambiarEstadoJornada(eventoCambio);
                if (eventoCambio === INICIO_NORMAL) {
                  this.props.cerrarFormJornada();
                }
              });
            },
          },
        ]);
      })
      .catch(() => {
        alert('Para continuar activa el GPS del movil');
        return false;
      });
  };

  calcularLitrosStock = litros => {
    const litrosActuales = 0;
    const litrosUpdate = parseFloat(litrosActuales) + parseFloat(litros);
    this.props.actualizarLitros(litrosUpdate);
  };

  selectOption = value => {
    this.setState({puedeContinuar: value});
  };

  render() {
    return (
      <View>
        <ScrollView>
          {this.props.estadoJornada === SIN_INICIAR
            ? this._renderFormInicioJornada()
            : this.props.estadoJornada === INICIO_NO_DISPONIBLE
            ? this._renderFormNoDisponible()
            : this.props.estadoJornada === INICIO_NORMAL &&
              this.props.showFormJornada
            ? this._renderFormFinalizarJornada()
            : null}
        </ScrollView>
        <ModalLoad modalVisible={this.state.sending} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerFormInicioJornada: {
    padding: 15,
  },
  btnAccion: {
    borderRadius: 10,
    marginTop: 25,
    padding: 15,
    height: 55,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  btnText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  radioContainer: {
    marginTop: 15,
  },
  inputText: {
    width: '100%',
    height: 40,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#6ca5ad',
    padding: 6,
    fontSize: 17,
    color: '#2b2b2b',
    backgroundColor: '#f5feff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  textForm: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 8,
    color: '#454545',
  },
  inputTextMulti: {
    width: '100%',
    height: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#6ca5ad',
    padding: 6,
    fontSize: 18,
    color: '#2b2b2b',
    backgroundColor: '#f5feff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  inputContainer: {
    marginTop: 10,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    cambiarEstadoJornada: estado => dispatch(cambiarEstadoJornada(estado)),
    addEventoJornada: data => dispatch(addEventoJornada(data)),
    subirDataAsync: () => dispatch(subirDataAsync()),
    definirFechaJornada: fecha => dispatch(definirFechaJornada(fecha)),
    resetFechaJornada: () => dispatch(resetFechaJornada()),
    definirUltimaJornada: fecha => dispatch(definirUltimaJornada(fecha)),
    actualizarLitros: litros => dispatch(actualizarLitros(litros)),
  };
};

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    estadoJornada: state.estadoJornada,
    signInData: state.signInData,
    fechaJornada: state.fechaJornada,
    ultimaJornada: state.ultimaJornada,
    validadorJornada: state.validadorJornada,
    validarGPSActivo: state.validarGPSActivo,
    litrosEstanque: state.litrosEstanque,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormInicioJornada);
