import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {normalize} from '../helpers/normalize';
import {
  actualizarLitros,
  addDataCargasReabastecimiento,
  addImage,
} from '../redux/actions';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import GPS from '../helpers/gps';
import {generarNombreImagen, makeid} from '../helpers/functions';
import Geolocation from '@react-native-community/geolocation';
import ModalLoad from '../components/ModalLoad';
import {SIN_INICIAR} from '../redux/constants';

const options = {
  title: 'Imagen',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Tomar una foto',
  chooseFromLibraryButtonTitle: null,
  quality: 0.8,
  maxWidth: 640,
  maxHeight: 480,
  // Calidad de la imagen seleccionada
};

class ReabastecimientoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidadLitros: '',
      monto: '',
      foto: null,
      statusCamera: false,
      sending: false,
      nDocumento: '',
      date: null,
    };
  }

  static navigationOptions = {
    headerShown: false,
  };

  sacarFoto = () => {
    this.setState({statusCamera: true});
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({statusCamera: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({statusCamera: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({statusCamera: false});
      } else {
        const imgName = generarNombreImagen();
        //* Se obtiene la imagen y se almanacena en el estado del componente (form)
        const source = {
          uri: response.uri,
          type: response.type,
          name: imgName + '.jpeg',
        };
        this.setState({
          foto: source,
          statusCamera: false,
        });
      }
    });
  };

  resetForm = () => {
    this.setState({cantidadLitros: '', monto: '', foto: null, nDocumento: ''});
  };

  getGPSHour = () => {
    return new Promise((resolve, reject) => {
      const permiso = GPS.GPSPersmission();
      if (permiso) {
        this.setState({sending: true});
        Geolocation.getCurrentPosition(
          position => {
            let date = new Date(position.timestamp);
            this.setState({date: date, sending: false});
            resolve();
          },
          error => {
            console.log(error);
            const date = new Date();
            this.setState({sending: false, date: date});
            resolve();
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      } else {
        reject();
        this.setState({sending: false});
        alert(
          'Para finalizar el tiempo de colación debes permitir que la aplicación acceda al GPS',
        );
      }
    });
  };

  _renderLoad = () => {
    const load = <ActivityIndicator size="large" color="#fcbe35" />;
    return load;
  };

  validarCamposReabastecimiento = () => {
    if (
      this.state.cantidadLitros == '' ||
      this.state.cantidadLitros <= 0 ||
      isNaN(this.state.cantidadLitros)
    ) {
      alert('Ingresa un valor válido para la cantidad de litros');
      return false;
    }
    if (
      this.state.monto == '' ||
      this.state.monto <= 0 ||
      isNaN(this.state.monto)
    ) {
      alert('Ingresa un valor válido para el monto de la carga');
      return false;
    }
    if (
      this.state.nDocumento == '' ||
      this.state.nDocumento <= 0 ||
      isNaN(this.state.nDocumento)
    ) {
      alert('Ingresa un número de documento válido');
      return false;
    }
    if (this.state.foto == null) {
      alert('Para continuar debes tomar una foto del sensor');
      return false;
    }
    return true;
  };

  registrarReabastecimiento = () => {
    if (!this.validarCamposReabastecimiento()) {
      return;
    }
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de registrar el abastecimiento?',
      [
        {
          text: 'Rechazar',
          onPress: () => {
            this.setState({statusCamera: false});
            console.log('cancelada');
          },
        },
        {
          text: 'Aceptar',
          onPress: () => {
            this.getGPSHour()
              .then(() => {
                this.setState({statusCamera: false, sending: false});
                let rut = this.props.signInData[0].rut;
                let usuarioId = this.props.signInData[0].userId;
                const date = this.state.date;
                let hours = '0' + date.getHours();
                let minutes = '0' + date.getMinutes();
                let mes = '0' + (date.getMonth() + 1);
                let dia = '0' + date.getDate();
                let anio = date.getFullYear();
                let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
                let fechaJornada =
                  this.props.fechaJornada == null
                    ? `${anio}-${mes.substr(-2)}-${dia.substr(-2)}`
                    : this.props.fechaJornada;
                const dataReabastecimiento = {
                  ID: makeid(),
                  TIPO: 2,
                  NDOCUMENTO: this.state.nDocumento,
                  MONTO: this.state.monto,
                  LITROS: this.state.cantidadLitros,
                  FECHA: `${anio}-${mes.substr(-2)}-${dia.substr(-2)}`,
                  HORA: formattedTime,
                  FOTO: this.state.foto.name,
                  RUT: rut,
                  USUARIOID: usuarioId,
                  FECHA_JORNADA: fechaJornada,
                };
                this.props.addDataCargasReabastecimiento(dataReabastecimiento);
                this.calcularLitrosStock(dataReabastecimiento.LITROS);
                this.props.addImage(this.state.foto);
                this.resetForm();
                alert('Carga registrada');
                this.setState({sending: false});
              })
              .catch(error => {
                console.log(error);
              });
          },
        },
      ],
    );
  };

  calcularLitrosStock = litros => {
    const litrosActuales = this.props.litrosEstanque;
    const litrosUpdate = parseFloat(litrosActuales) + parseFloat(litros);
    this.props.actualizarLitros(litrosUpdate);
  };

  render() {
    console.log(this.props.eventosJornada);
    return (
      <View>
        {this.props.estadoJornada != SIN_INICIAR ? (
          <View>
            <View style={styles.headerTittleContainerBack}>
              <View style={styles.headerTittleContainer}>
                <Text style={styles.headerTittle}>
                  Registrar Inicio de carga
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.body}>
                <View style={styles.container}>
                  <ScrollView>
                    <View>
                      <Text style={styles.labelInput}>Cantidad (lts)</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TextInput
                          style={styles.inputText}
                          placeholder="Litros"
                          value={this.state.cantidadLitros}
                          onChangeText={text => {
                            this.setState({
                              cantidadLitros: text,
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={styles.labelInput}>Monto ($)</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TextInput
                          style={styles.inputText}
                          placeholder="Monto"
                          value={this.state.monto}
                          onChangeText={text => {
                            this.setState({
                              monto: text,
                            });
                          }}
                          keyboardType={'numeric'}
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={styles.labelInput}>Número de guía</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TextInput
                          style={styles.inputText}
                          placeholder="Número de guía"
                          value={this.state.nDocumento}
                          onChangeText={text => {
                            this.setState({
                              nDocumento: text,
                            });
                          }}
                          keyboardType={'numeric'}
                        />
                      </View>
                    </View>
                    <View style={styles.fotoContainer}>
                      <Text style={styles.textForm}>Foto sensor</Text>
                      <View style={styles.imageBox}>
                        {this.state.foto != null ? (
                          <Image
                            source={this.state.foto}
                            style={styles.imageContainer}
                          />
                        ) : (
                          <View style={styles.imageContainer}>
                            <View style={styles.sinFoto}>
                              <Text style={styles.textoFoto}>Sin Foto</Text>
                            </View>
                          </View>
                        )}
                      </View>
                      {this.state.statusCamera ? null : (
                        <View style={{marginBottom: 8}}>
                          <TouchableHighlight
                            style={styles.btnCamera}
                            onPress={() => this.sacarFoto()}>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={styles.textBtnFoto}>TOMAR FOTO</Text>
                            </View>
                          </TouchableHighlight>
                        </View>
                      )}
                    </View>
                    {!this.state.pressStatus ? (
                      <View>
                        <View style={styles.container}>
                          <View style={styles.btnsSubmitContainer}>
                            <TouchableHighlight
                              style={styles.btnLimpiar}
                              onPress={this.resetForm}>
                              <View style={{flexDirection: 'row'}}>
                                <Text style={styles.btnLimpiarText}>
                                  Limpiar
                                </Text>
                              </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                              style={styles.btnEnviar}
                              onPress={this.registrarReabastecimiento}>
                              <View style={{flexDirection: 'row'}}>
                                <Text style={styles.btnEnviarText}>Enviar</Text>
                              </View>
                            </TouchableHighlight>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={{padding: 30}}>{_renderLoad}</View>
                    )}
                  </ScrollView>
                  <ModalLoad modalVisible={this.state.sending} />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              height: '100%',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Image
                source={require('./../assets/calendario.png')}
                style={{width: 250, height: 250}}
              />
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Para registrar datos debes iniciar jornada
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    position: 'relative',
    zIndex: 0,
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    padding: 8,
    position: 'relative',
    height: '100%',
    zIndex: 1,
    borderTopRightRadius: 20,
  },
  formContainer: {
    height: '92%',
    backgroundColor: '#43aff2',
  },
  labelInput: {
    color: 'black',
    fontSize: normalize(11),
    marginTop: 7,
    marginBottom: 6,
  },
  inputTextSearch: {
    width: '78%',
    height: normalize(30),
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#737373',
    padding: 6,
    fontSize: normalize(11),
    color: '#2b2b2b',
    backgroundColor: '#f0f0f0',
  },
  inputText: {
    width: '100%',
    height: normalize(30),
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#737373',
    padding: 6,
    fontSize: normalize(10),
    color: '#2b2b2b',
    backgroundColor: '#f0f0f0',
  },
  headerTittleContainerBack: {
    backgroundColor: 'white',
    height: '8%',
    position: 'relative',
  },
  headerTittleContainer: {
    padding: 10,
    backgroundColor: '#43aff2',
    height: '100%',
    borderBottomLeftRadius: 20,
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    width: '100%',
  },
  headerTittle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 120,
    height: 150,
    marginTop: 10,
  },
  sinFoto: {
    height: '100%',
    width: '100%',
    backgroundColor: '#919191',
    justifyContent: 'center',
  },
  btnCamera: {
    backgroundColor: '#5fe398',
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 15,
  },
  textoFoto: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  fotoContainer: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  },
  textBtnFoto: {
    color: 'white',
    fontSize: 15,
  },
  btnLimpiar: {
    width: '48%',
    height: normalize(32),
    backgroundColor: '#ededed',
    borderRadius: 5,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#828282',
  },
  btnLimpiarText: {
    color: '#4a4949',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
  },
  btnEnviar: {
    width: '48%',
    height: normalize(32),
    backgroundColor: '#649ce8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEnviarText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
  },
  btnsSubmitContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    network: state.network,
    litrosEstanque: state.litrosEstanque,
    signInData: state.signInData,
    estadoJornada: state.estadoJornada,
    fechaJornada: state.fechaJornada,
    eventosJornada: state.eventosJornada,
  };
}

const mapDispatchToProps = dispatch => {
  //Convertir los actions de redux en propiedades
  return {
    addDataCargasReabastecimiento: data =>
      dispatch(addDataCargasReabastecimiento(data)),
    actualizarLitros: litros => dispatch(actualizarLitros(litros)),
    addImage: image => dispatch(addImage(image)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReabastecimientoScreen);
