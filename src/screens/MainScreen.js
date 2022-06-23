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
import ModalSelect from '../components/ModalSelect';
import ModalLoad from '../components/ModalLoad';
import {
  definirEquipoOperador,
  definirEstadoCarga,
  addDataInicioCarga,
  resetCargaDiesel,
  addDataTerminoCarga,
  addDataCargasGeneradas,
  addImage,
  actualizarLitros,
} from '../redux/actions';
import {INICIO_NO_DISPONIBLE, SIN_INICIAR} from '../redux/constants';
import FormInicioJornada from '../components/FormInicioJornada';
import {ScrollView} from 'react-native-gesture-handler';
import ScanearQr from '../components/ScanearQR';
import {SIN_CARGA, CARGANDO} from '../redux/constants';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import {generarNombreImagen, calcularDuracion} from '../helpers/functions';
import GPS from '../helpers/gps';

/* 
	Opciones del imagePicker 
	El imagepicker se muestra en forma de modal 
	permite seleccionar una imagen de la galeria o
	sacar una foto con la cámara del dispositivo
*/
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

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQrScanner: false,
      showModal: false,
      modalDataRender: 1,
      operadorId: null,
      operadorNombre: '',
      numeroTicket: '',
      predioId: null,
      predioNombre: '',
      equipoId: null,
      tipoEquipoId: null,
      equipoNombre: '',
      horometro: '',
      fotoHorometro: null,
      cantidad: '',
      monto: '', //?
      totalizadorInicio: '',
      fotoTotalizadorInicio: null,
      totalizadorFinal: '',
      fotoTotalizadorFinal: null,
      statusCamera: false,
      pressStatus: false,
      dataGenerarQRCarga: null,
      sending: false,
      date: null,
      mostrarFormJornada: false,
    };
  }

  static navigationOptions = {
    title: 'Registrar Carga Diesel',
    headerShown: false,
  };

  componentDidMount() {
    const estadoJornada = this.props.estadoJornada;
    if (estadoJornada == SIN_INICIAR || estadoJornada == INICIO_NO_DISPONIBLE) {
      this.setState({mostrarFormJornada: true});
    }
  }

  cerrarFormJornada = () => {
    this.setState({mostrarFormJornada: false});
  };

  sacarFoto = async type => {
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
        switch (type) {
          case 1:
            this.setState({
              fotoHorometro: source,
              statusCamera: false,
            });
            break;
          case 2:
            this.setState({
              fotoTotalizadorInicio: source,
              statusCamera: false,
            });
            break;
          case 3:
            this.setState({
              fotoTotalizadorFinal: source,
              statusCamera: false,
            });
            break;
        }
      }
    });
  };

  closeModal = () => {
    this.setState({showModal: false});
  };

  seleccionarEquipoSuministro = item => {
    this.props.definirEquipoOperador(item);
    this.setState({showModal: false});
  };

  seleccionarOperadorMaquina = item => {
    this.setState({
      operadorId: item.IDOPERADOR,
      operadorNombre: item.NOMBRE_OPERADOR,
      showModal: false,
    });
  };

  seleccionarFundo = item => {
    this.setState({
      predioId: item.FUNDOID,
      predioNombre: item.FUNDO,
      showModal: false,
    });
  };

  _renderInputEquipoSuministro = () => {
    return (
      <View>
        <Text style={styles.labelInput}>Equipo suministro: </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextInput
            editable={false}
            style={styles.inputTextSearch}
            value={
              this.props.equipoOperador == null
                ? 'No Seleccionado'
                : this.props.equipoOperador.NOMBRE
            }
          />
          <TouchableHighlight
            style={styles.btnSearch}
            onPress={() => {
              this.setState({
                showModal: true,
                modalDataRender: 1,
              });
            }}>
            <Image
              source={require('../assets/icons/search.png')}
              style={styles.btnImg}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  //* Montar componente para escanear el códugo qr del equipo
  seleccionarEquipoACargar = () => {
    this.setState({
      showQrScanner: true,
    });
  };

  seleccionarEquipo = (id, equipo, tipoEquipoId) => {
    this.setState({
      equipoId: id,
      equipoNombre: equipo,
      showQrScanner: false,
      tipoEquipoId: tipoEquipoId,
    });
  };

  closeQr = () => {
    this.setState({
      showQrScanner: false,
    });
  };

  _resetForm = () => {
    this.setState({
      showQrScanner: false,
      showModal: false,
      modalDataRender: 1,
      operadorId: null,
      operadorNombre: '',
      numeroTicket: '',
      predioId: null,
      tipoEquipoId: null,
      predioNombre: '',
      equipoId: null,
      equipoNombre: '',
      horometro: '',
      fotoHorometro: null,
      cantidad: '',
      monto: '', //?
      totalizadorInicio: '',
      fotoTotalizadorInicio: null,
      statusCamera: false,
      fotoTotalizadorFinal: null,
      totalizadorFinal: '',
    });
  };

  limpiarCampos = () => {
    Alert.alert('Confirmación', '¿Estás seguro de iniciar el proceso?', [
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
          this._resetForm();
        },
      },
    ]);
  };

  validarCamposIniciarCarga = () => {
    if (this.state.operadorId == null) {
      alert('Selecciona un operador para continuar');
      return false;
    }
    if (this.state.predioId == null) {
      alert('Selecciona un predio para continuar');
      return false;
    }
    if (this.state.equipoId == null) {
      alert('Selecciona un equipo para continuar');
      return false;
    }
    if (
      this.state.horometro == '' ||
      this.state.horometro <= 0 ||
      isNaN(this.state.horometro)
    ) {
      alert('Ingresa un valor válido para el horómetro del equipo');
      return false;
    }
    if (this.state.fotoHorometro == null) {
      alert('Para continuar debes tomar una foto del horómetro de la máquina');
      return false;
    }
    if (
      this.state.totalizadorInicio == '' ||
      this.state.totalizadorInicio <= 0 ||
      isNaN(this.state.totalizadorInicio)
    ) {
      alert('Ingresa un valor válido para el totalizador del camión');
      return false;
    }
    if (this.state.fotoTotalizadorInicio == null) {
      alert('Para continuar debes tomar una foto al totalizador del camión');
      return false;
    }
    return true;
  };

  registrarDataInicio = () => {
    const date = this.state.date;
    let hours = '0' + date.getHours();
    let minutes = '0' + date.getMinutes();
    let month = '0' + (parseInt(date.getMonth()) + 1);
    let day = '0' + date.getDate();
    let anio = date.getFullYear();
    let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
    let dataInicioCarga = {
      EQUIPO_ABASTECEDOR_ID: this.props.equipoOperador.TORIGEN_H,
      EQUIPO_ABASTECEDOR: this.props.equipoOperador.NOMBRE,
      OPERADOR_EQUIPO_CARGA_ID: this.state.operadorId,
      OPERADOR_EQUIPO_CARGA: this.state.operadorNombre,
      TIPO_EQUIPO_CARGA_ID: this.state.tipoEquipoId,
      PREDIO_ID: this.state.predioId,
      PREDIO: this.state.predioNombre,
      EQUIPO_CARGA_ID: this.state.equipoId,
      EQUIPO_CARGA: this.state.equipoNombre,
      TOTALIZADOR_INICIO: this.state.totalizadorInicio,
      HOROMETRO: this.state.horometro,
      FOTO_TOTALIZADOR_INICIO: this.state.fotoTotalizadorInicio,
      FOTO_HOROMETRO: this.state.fotoHorometro,
      HORA_INICIO: formattedTime,
      HORA: hours.substr(-2),
      MINUTOS: minutes.substr(-2),
      FECHA: `${anio}-${month.substr(-2)}-${day.substr(-2)}`,
    };

    this.props.addImage(this.state.fotoHorometro);
    this.props.addImage(this.state.fotoTotalizadorInicio);
    this.setState({sending: false});
    this.props.addDataInicioCarga(dataInicioCarga);
    this.props.definirEstadoCarga(CARGANDO);
    this._resetForm();
  };

  iniciarCargaDiesel = async () => {
    if (!this.validarCamposIniciarCarga()) {
      return;
    }
    Alert.alert('Confirmación', '¿Estás seguro de iniciar el proceso?', [
      {
        text: 'Rechazar',
        onPress: () => {
          this.setState({statusCamera: false, sending: false});
          console.log('cancelada');
        },
      },
      {
        text: 'Aceptar',
        onPress: () => {
          this.getGPSHour()
            .then(() => {
              this.setState({statusCamera: false, sending: false});
              // const date = this.state.date;
              this.registrarDataInicio();
            })
            .catch(() => {
              console.log('Sin acceso al GPS');
            });
        },
      },
    ]);
  };

  validarCamposTerminarCarga = () => {
    if (
      this.state.cantidad == '' ||
      this.state.cantidad <= 0 ||
      isNaN(this.state.cantidad)
    ) {
      alert('Ingresa un valor válido para la cantidad de litros');
      return false;
    }
    if (
      this.state.totalizadorFinal == '' ||
      this.state.totalizadorFinal <= 0 ||
      isNaN(this.state.totalizadorFinal)
    ) {
      alert('Ingresa un valor válido para el totalizador del camión');
      return false;
    }
    if (
      parseInt(this.state.totalizadorFinal) <=
      parseInt(this.props.dataInicioCarga.TOTALIZADOR_INICIO)
    ) {
      alert(
        'El totalizador final no puede ser menor o igual al totalizador inicial',
      );
      return false;
    }
    if (this.state.fotoTotalizadorFinal == null) {
      alert('Para continuar debes tomar una foto al totalizador del camión');
      return false;
    }
    return true;
  };

  generarQR(dataCargaDiesel) {
    const dcd = dataCargaDiesel;
    let copiaItem = {
      TIPO: 1,
      DATA_INICIO_CARGA: [
        dcd.DATA_INICIO_CARGA.EQUIPO_ABASTECEDOR,
        dcd.DATA_INICIO_CARGA.EQUIPO_ABASTECEDOR_ID,
        dcd.DATA_INICIO_CARGA.EQUIPO_CARGA_ID,
        dcd.DATA_INICIO_CARGA.EQUIPO_CARGA,
        dcd.DATA_INICIO_CARGA.FECHA,
        dcd.DATA_INICIO_CARGA.HORA_INICIO,
        dcd.DATA_INICIO_CARGA.HOROMETRO,
        dcd.DATA_INICIO_CARGA.OPERADOR_EQUIPO_CARGA_ID,
        dcd.DATA_INICIO_CARGA.PREDIO_ID,
        dcd.DATA_INICIO_CARGA.TIPO_EQUIPO_CARGA_ID,
        dcd.DATA_INICIO_CARGA.TOTALIZADOR_INICIO,
        dcd.DATA_INICIO_CARGA.PREDIO,
        dcd.DATA_INICIO_CARGA.PREDIO_ID,
      ],
      DATA_TERMINO_CARGA: [
        dcd.DATA_TERMINO_CARGA.CANTIDAD,
        dcd.DATA_TERMINO_CARGA.HORA_TERMINO,
        dcd.DATA_TERMINO_CARGA.NDOCUMENTO,
        dcd.DATA_TERMINO_CARGA.TOTALIZADOR_TERMINO,
      ],
    };
    const dataCargaDieselString = JSON.stringify(copiaItem);

    this.setState({
      dataGenerarQRCarga: dataCargaDieselString,
      showModal: true,
      modalDataRender: 4,
      sending: false,
    });
  }

  registrarDataTermino = () => {
    const date = this.state.date;
    let hours = '0' + date.getHours();
    let minutes = '0' + date.getMinutes();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);

    const dataInicioCarga = this.props.dataInicioCarga;

    const duracion = calcularDuracion(
      dataInicioCarga.HORA_INICIO,
      formattedTime,
    );

    const NDOCUMENTO = `${dia}${mes}${minutes.substr(-2)}${
      dataInicioCarga.EQUIPO_CARGA_ID
    }`;
    let dataTerminoCarga = {
      NDOCUMENTO: NDOCUMENTO,
      TOTALIZADOR_TERMINO: this.state.totalizadorFinal,
      FOTO_TOTALIZADOR_TERMINO: this.state.fotoTotalizadorFinal,
      CANTIDAD: this.state.cantidad,
      HORA_TERMINO: formattedTime,
      DURACION: duracion,
    };
    this.props.addImage(this.state.fotoTotalizadorFinal);
    this._resetForm();
    this.props.definirEstadoCarga(SIN_CARGA);
    this.props.addDataTerminoCarga(dataTerminoCarga);
    const dataCargaDiesel = this.props.dataCargaDiesel;
    this.props.addDataCargasGeneradas(dataCargaDiesel);
    this.props.resetCargaDiesel();
    this.generarQR(dataCargaDiesel);
    this.calcularLitrosStock(dataTerminoCarga.CANTIDAD);
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
            const date = new Date();
            this.setState({showButton: true, sending: false, date: date});
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

  terminarCargaDiesel = () => {
    if (!this.validarCamposTerminarCarga()) {
      return;
    }
    Alert.alert('Confirmación', '¿Estás seguro de terminar la carga diesel?', [
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
              this.registrarDataTermino();
            })
            .catch(() => {
              console.log('Sin acceso al GPS');
            });
        },
      },
    ]);
  };

  _renderCamposForm = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.body}>
          <View style={styles.container}>
            <ScrollView>
              <View>
                {this._renderInputEquipoSuministro()}
                <View>
                  <View>
                    <Text style={styles.labelInput}>Operador equipo: </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        editable={false}
                        style={styles.inputTextSearch}
                        value={
                          this.state.operadorId == null
                            ? 'No Seleccionado'
                            : this.state.operadorNombre
                        }
                      />
                      <TouchableHighlight
                        style={styles.btnSearch}
                        onPress={() => {
                          this.setState({
                            showModal: true,
                            modalDataRender: 3,
                          });
                        }}>
                        <Image
                          source={require('../assets/icons/search.png')}
                          style={styles.btnImg}
                        />
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.labelInput}>Predio: </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        editable={false}
                        style={styles.inputTextSearch}
                        value={
                          this.state.predioId == null
                            ? 'No Seleccionado'
                            : this.state.predioNombre
                        }
                      />
                      <TouchableHighlight
                        style={styles.btnSearch}
                        onPress={() => {
                          this.setState({
                            showModal: true,
                            modalDataRender: 2,
                          });
                        }}>
                        <Image
                          source={require('../assets/icons/search.png')}
                          style={styles.btnImg}
                        />
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.labelInput}>Equipo: </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        editable={false}
                        style={styles.inputTextSearch}
                        value={
                          this.state.equipoId == null
                            ? 'No Seleccionado'
                            : this.state.equipoNombre
                        }
                      />
                      <TouchableHighlight
                        style={styles.btnSearch}
                        onPress={() => this.seleccionarEquipoACargar()}>
                        <Image
                          source={require('../assets/icons/search.png')}
                          style={styles.btnImg}
                        />
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.labelInput}>Horómetro equipo</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Horómetro de equipo"
                        value={this.state.horometro}
                        onChangeText={text => {
                          this.setState({
                            horometro: text,
                          });
                        }}
                        keyboardType={'numeric'}
                      />
                    </View>
                  </View>
                  <View style={styles.fotoContainer}>
                    <Text style={styles.textForm}>Foto Horometro</Text>
                    <View style={styles.imageBox}>
                      {this.state.fotoHorometro != null ? (
                        <Image
                          source={this.state.fotoHorometro}
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
                          onPress={() => this.sacarFoto(1)}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textBtnFoto}>TOMAR FOTO</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                  </View>
                  <View>
                    <Text style={styles.labelInput}>Totalizador inicial</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Totalizador del camión"
                        value={this.state.totalizadorInicio}
                        onChangeText={text => {
                          this.setState({
                            totalizadorInicio: text,
                          });
                        }}
                        keyboardType={'numeric'}
                      />
                    </View>
                  </View>
                  <View style={styles.fotoContainer}>
                    <Text style={styles.textForm}>Foto Totalizador</Text>
                    <View style={styles.imageBox}>
                      {this.state.fotoTotalizadorInicio != null ? (
                        <Image
                          source={this.state.fotoTotalizadorInicio}
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
                          onPress={() => this.sacarFoto(2)}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textBtnFoto}>TOMAR FOTO</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                  </View>
                </View>
                <View>
                  <View style={styles.container}>
                    <View style={styles.btnsSubmitContainer}>
                      <TouchableHighlight
                        style={styles.btnLimpiar}
                        onPress={this.limpiarCampos}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.btnLimpiarText}>Limpiar</Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={styles.btnEnviar}
                        onPress={this.iniciarCargaDiesel}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.btnEnviarText}>Enviar</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View style={styles.container}>
                    <View
                      style={{
                        padding: 5,
                        height: 70,
                        justifyContent: 'center',
                      }}>
                      <TouchableHighlight
                        underlayColor="#8adaf2"
                        style={[
                          styles.btnAccion,
                          {backgroundColor: '#59baaf', marginTop: 5},
                        ]}
                        onPress={() => this.mostrarFormJornada()}>
                        <Text style={styles.btnText}>Terminar jornada</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        <ModalSelect
          modalVisible={this.state.showModal}
          closeModal={this.closeModal}
          modalDataRender={this.state.modalDataRender}
          seleccionarEquipoSuministro={this.seleccionarEquipoSuministro}
          seleccionarOperadorMaquina={this.seleccionarOperadorMaquina}
          seleccionarFundo={this.seleccionarFundo}
          dataCargaDieselString={this.state.dataGenerarQRCarga}
        />
        <ModalLoad modalVisible={this.state.sending} />
      </View>
    );
  };

  _renderQR = () => {
    return (
      <View style={styles.qrContainer}>
        <ScanearQr
          seleccionarEquipo={this.seleccionarEquipo}
          closeQr={this.closeQr}
        />
      </View>
    );
  };

  calcularLitrosStock = litros => {
    const litrosActuales = this.props.litrosEstanque;
    const litrosUpdate = parseFloat(litrosActuales) - parseFloat(litros);
    let lt = litrosUpdate < 0 ? 0 : litrosUpdate;
    console.log('lt ', lt);
    this.props.actualizarLitros(lt);
  };

  mostrarFormJornada = () => {
    this.setState({mostrarFormJornada: true});
  };

  _renderForm = () => {
    return (
      <View>
        {this.state.showQrScanner ? (
          this._renderQR()
        ) : (
          <View>
            <View style={styles.headerTittleContainerBack}>
              <View style={styles.headerTittleContainer}>
                <Text style={styles.headerTittle}>Registrar carga</Text>
              </View>
            </View>
            {this._renderCamposForm()}
          </View>
        )}
      </View>
    );
  };

  _renderLoad = () => {
    const load = <ActivityIndicator size="large" color="#fcbe35" />;
    return load;
  };

  _renderFormFinalizarCarga = () => {
    return (
      <View>
        <View style={styles.headerTittleContainerBack}>
          <View style={styles.headerTittleContainer}>
            <Text style={styles.headerTittle}>Registrar carga</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.body}>
            <View style={styles.container}>
              <ScrollView>
                <View style={styles.resumenContainer}>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>
                      Equipo abastecedor:
                    </Text>
                    <Text>{this.props.dataInicioCarga.EQUIPO_ABASTECEDOR}</Text>
                  </View>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>Equipo carga:</Text>
                    <Text>{this.props.dataInicioCarga.EQUIPO_CARGA}</Text>
                  </View>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>Operador:</Text>
                    <Text>
                      {this.props.dataInicioCarga.OPERADOR_EQUIPO_CARGA}
                    </Text>
                  </View>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>
                      Horómetro equipo:
                    </Text>
                    <Text>{this.props.dataInicioCarga.HOROMETRO}</Text>
                  </View>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>
                      Totalizador inicio:
                    </Text>
                    <Text>{this.props.dataInicioCarga.TOTALIZADOR_INICIO}</Text>
                  </View>
                  <View style={styles.textLabelContainer}>
                    <Text style={styles.textLabelTittle}>Inicio:</Text>
                    <Text>{this.props.dataInicioCarga.HORA_INICIO}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.titleFinalizar}>
                    Finalizar carga diesel
                  </Text>
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
                        value={this.state.cantidad}
                        onChangeText={text => {
                          this.setState({
                            cantidad: text,
                          });
                        }}
                        keyboardType={'numeric'}
                      />
                    </View>
                  </View>
                  <View>
                    <Text style={styles.labelInput}>Totalizador final</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Totalizador del camión"
                        value={this.state.totalizadorFinal}
                        onChangeText={text => {
                          this.setState({
                            totalizadorFinal: text,
                          });
                        }}
                        keyboardType={'numeric'}
                      />
                    </View>
                  </View>
                  <View style={styles.fotoContainer}>
                    <Text style={styles.textForm}>Foto Totalizador</Text>
                    <View style={styles.imageBox}>
                      {this.state.fotoTotalizadorFinal != null ? (
                        <Image
                          source={this.state.fotoTotalizadorFinal}
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
                          onPress={() => this.sacarFoto(3)}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textBtnFoto}>TOMAR FOTO</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                  </View>
                </View>
                {!this.state.pressStatus ? (
                  <View>
                    <View style={styles.container}>
                      <View style={styles.btnsSubmitContainer}>
                        <TouchableHighlight
                          style={styles.btnLimpiar}
                          onPress={this.limpiarCampos}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.btnLimpiarText}>Limpiar</Text>
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                          style={styles.btnEnviar}
                          onPress={this.terminarCargaDiesel}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.btnEnviarText}>Enviar</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{padding: 30}}>{load}</View>
                )}
              </ScrollView>
              <ModalLoad modalVisible={this.state.sending} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    console.log('fotos ', this.props.fotos);
    console.log('reab ', this.props.cargasReabastecimiento);
    console.log('cg ', this.props.dataCargasGeneradas);
    return (
      <View style={{backgroundColor: 'white'}}>
        {this.state.mostrarFormJornada ? (
          <FormInicioJornada
            cerrarFormJornada={this.cerrarFormJornada}
            showFormJornada={this.state.mostrarFormJornada}
          />
        ) : this.props.estadoSuministro === SIN_CARGA ? (
          this._renderForm()
        ) : (
          this._renderFormFinalizarCarga()
        )}
        <ModalLoad modalVisible={this.state.sending} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 8,
    zIndex: 1,
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
  btnSearch: {
    width: '20%',
    height: normalize(30),
    backgroundColor: '#43aff2',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnImg: {
    width: 22,
    height: 22,
  },
  qrContainer: {
    marginTop: 65,
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
  textLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
  },
  textLabelTittle: {
    fontWeight: 'bold',
  },
  resumenContainer: {
    backgroundColor: '#ededed',
    padding: 7,
    borderRadius: 5,
  },
  titleFinalizar: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
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
    borderBottomRightRadius: 20,
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
  divider: {
    borderBottomColor: '#bababa',
    borderWidth: 1,
  },
  btnAccion: {
    borderRadius: 10,
    marginTop: 40,
    padding: 15,
    height: 55,
    width: '100%',
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
});

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    network: state.network,
    equipoOperador: state.equipoOperador,
    estadoSuministro: state.estadoSuministro,
    dataInicioCarga: state.dataCargaDiesel.DATA_INICIO_CARGA,
    dataCargaDiesel: state.dataCargaDiesel,
    dataCargasGeneradas: state.dataCargasGeneradas,
    fotos: state.fotos,
    estadoJornada: state.estadoJornada,
    fechaJornada: state.fechaJornada,
    litrosEstanque: state.litrosEstanque,
    cargasReabastecimiento: state.cargasReabastecimiento,
  };
}

const mapDispatchToProps = dispatch => {
  //Convertir los actions de redux en propiedades
  return {
    definirEquipoOperador: dataEquipo =>
      dispatch(definirEquipoOperador(dataEquipo)),
    definirEstadoCarga: estadoCarga =>
      dispatch(definirEstadoCarga(estadoCarga)),
    addDataInicioCarga: dataInicioCarga =>
      dispatch(addDataInicioCarga(dataInicioCarga)),
    addDataTerminoCarga: dataTerminoCarga =>
      dispatch(addDataTerminoCarga(dataTerminoCarga)),
    addDataCargasGeneradas: dataCargaDiesel =>
      dispatch(addDataCargasGeneradas(dataCargaDiesel)),
    resetCargaDiesel: () => dispatch(resetCargaDiesel()),
    addImage: image => dispatch(addImage(image)),
    actualizarLitros: litros => dispatch(actualizarLitros(litros)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
