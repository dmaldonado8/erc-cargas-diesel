import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  TouchableHighlight,
  Text,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {
  addEquipoSuministroData,
  addFundosData,
  addOperadoresData,
  removeDataCargasGeneradas,
  removeImage,
  removeCargaReabastecimiento,
} from '../redux/actions';
import {url} from '../constants';

class SyncScreen extends React.Component {
  // *Opciones de la librería de navegación
  // *react-native navigation
  static navigationOptions = {
    title: 'SyncScreen',
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  // *States
  // *isLoading: Determina si el estado de carga está o no pendiente(true ó false)

  componentDidMount() {
    const type = this.props.navigation.getParam('type', 1);
    // *Validación del estado de conexión
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (type == 1) {
          this._cargaDataAsync();
        }
        if (type == 2) {
          this._subirDataAsync();
        }
      } else {
        this.setState({isLoading: false});
      }
    });
  }

  subirImagenesDespacho = element => {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      for (var i = 0; i <= 1; i++) {
        formData.append(
          'uploadedfile[]',
          {
            uri: element.uri,
            type: element.type,
            name: element.name,
          },
          element.name,
        );
      }
      fetch(
        'http://terranova-001-site8.btempurl.com/fotos/prevencion/socket_erioclaro_fotos.php',
        // 'http://192.168.18.82/copia_terranova/api/socket_erioclaro_fotos.php',
        {
          method: 'post',
          body: formData,
        },
        // Se envía el formdata con las imágenes al servidor
      )
        .then(response => response.text())
        .then(dataResponse => {
          console.log(dataResponse);

          resolve(dataResponse.trim());
          // Las imágenes se almacenaron correctamente
        })
        .catch(error => {
          reject();
          // Las imágenes no se almacenaron correctamente
          console.log('error', error);
        });
    });
  };

  subirCargaDiesel = item => {
    return new Promise((resolve, reject) => {
      const signInData = this.props.signInData;
      const idUsr = signInData[0].userId;
      const rut = signInData[0].rut;
      const myInit = {
        name: 'ingresarCargaDiesel',
        param: {
          fecha: item.DATA_INICIO_CARGA.FECHA,
          hh: item.DATA_INICIO_CARGA.HORA,
          mm: item.DATA_INICIO_CARGA.MINUTOS,
          nDocumento: item.DATA_TERMINO_CARGA.NDOCUMENTO,
          tOrigenH: item.DATA_INICIO_CARGA.EQUIPO_ABASTECEDOR_ID,
          rutOriId: idUsr,
          equipoId: item.DATA_INICIO_CARGA.EQUIPO_CARGA_ID,
          rutDesId: item.DATA_INICIO_CARGA.OPERADOR_EQUIPO_CARGA_ID,
          horometro: item.DATA_INICIO_CARGA.HOROMETRO,
          cantidad: item.DATA_TERMINO_CARGA.CANTIDAD,
          totalizador: item.DATA_INICIO_CARGA.TOTALIZADOR_INICIO,
          fotoTotalizadorInicio:
            item.DATA_INICIO_CARGA.FOTO_TOTALIZADOR_INICIO.name,
          fotoHorometro: item.DATA_INICIO_CARGA.FOTO_HOROMETRO.name,
          fotoTotalizadorTermino:
            item.DATA_TERMINO_CARGA.FOTO_TOTALIZADOR_TERMINO.name,
          fundoId: item.DATA_INICIO_CARGA.PREDIO_ID,
          totalizadorTermino: item.DATA_TERMINO_CARGA.TOTALIZADOR_TERMINO,
          latCarga: item.DATA_INICIO_CARGA.LAT_INICIO,
          lngCarga: item.DATA_INICIO_CARGA.LNG_INICIO,
          horaCarga: item.DATA_INICIO_CARGA,
          horaTerminoCarga: item.DATA_TERMINO_CARGA.HORA_TERMINO,
          rut: rut,
        },
      };
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(myInit),
        headers: {
          'Content-Type': 'application/json',
          Authorization: rut,
        },
      })
        .then(response => response.json())
        .then(json => {
          if (json.response.status === 200) {
            this.props.removeDataCargasGeneradas(item);
            resolve('Ingresado');
          }
          reject('Error en el envío de datos');
        })
        .catch(error => {
          reject(error);
          console.log('Ha ocurrido un error ', error);
        });
    });
  };

  subirReabastecimiento = (item, rut, usuarioId) => {
    return new Promise((resolve, reject) => {
      const myInit = {
        name: 'ingresarReabastecimientoDiesel',
        param: {
          litros: item.LITROS,
          monto: item.MONTO,
          nDocumento: item.NDOCUMENTO,
          fecha: item.FECHA,
          hora: item.HORA,
          usuarioId: item.USUARIOID,
          fechaJornada: item.FECHA_JORNADA,
          foto: item.FOTO,
          rut: rut,
        },
      };
      console.log(myInit);
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(myInit),
        headers: {
          'Content-Type': 'application/json',
          Authorization: rut,
        },
      })
        .then(response => response.json())
        .then(json => {
          if (json.response.result.status == 'success') {
            resolve();
          } else {
            reject(json);
          }
        })
        .catch(error => {
          console.log('Ha ocurrido un error ', error);
          reject(error);
        });
    });
  };

  _subirDataAsync = () => {
    const dataCargasGeneradas = [...this.props.dataCargasGeneradas];
    const arrayImages = [...this.props.fotos];
    const cargasReabastecimiento = [...this.props.cargasReabastecimiento];
    console.log(cargasReabastecimiento);
    this.setState({isLoading: true});
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        dataCargasGeneradas.forEach((item, idx) => {
          this.subirCargaDiesel(item)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
        });
        arrayImages.forEach((item, idx) => {
          console.log('foto', item);
          this.subirImagenesDespacho(item)
            .then(response => {
              if (response == 'subido') {
                this.props.removeImage(item);
              }
            })
            .catch(() => {
              console.log('error');
            });
        });
        if (cargasReabastecimiento.length > 0) {
          cargasReabastecimiento.forEach((item, idx) => {
            const rut = item.RUT;
            const usuarioId = item.USUARIOID;
            this.subirReabastecimiento(item, rut, usuarioId)
              .then(() => {
                this.props.removeCargaReabastecimiento(item);
              })
              .catch(error => {
                console.log(error);
              });
          });
        }
        setTimeout(() => {
          this.setState({isLoading: false});
          alert('Sincronización finalizada');
          this.props.navigation.navigate('SettingsScreen');
        }, 8000);
      } else {
        this.setState({isLoading: false});
        alert('No hay conexión a internet');
      }
    });
  };

  /**
   *Función para cargar los datos de sincronización desde el servidor
   *
   * @memberof SyncScreen
   */
  _cargaDataAsync = () => {
    const signInData = this.props.signInData;
    //*Se obtienen los datos de sesión del usuario
    const rutUsr = signInData[0].rut;
    // *Data fechas
    var date = '0' + new Date().getDate();
    var month = '0' + (new Date().getMonth() + 1);
    var year = new Date().getFullYear();
    var fechaActual = `${date.substr(-2)}-${month.substr(-2)}-${year}`;

    // *Validación del estado de conexión
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({isLoading: true});
        var myInit = {
          method: 'POST',
          body: JSON.stringify({
            name: 'sincronizarDatosCargaDiesel',
            param: {
              fecha: fechaActual,
            },
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: rutUsr,
          },
        };
        fetch(url, myInit)
          .then(response => response.json())
          .then(data => {
            if (data.response.status == 200) {
              const dataResponse = data.response.result;
              this.props.addEquipoSuministroData(dataResponse.EQUIPOS);
              this.props.addFundosData(dataResponse.FUNDOS);
              this.props.addOperadoresData(dataResponse.OPERADORES);
              alert('Sincronización realizada con éxito');
              this.props.navigation.navigate('SettingsScreen');
            } else {
              alert('Error al sincronizar los datos');
              this.setState({isLoading: false});
            }
          })
          .catch(error => {
            this.setState({isLoading: false});
            alert(
              'No se ha podido conectar con el servidor. Vuelva a intentarlo más tarde.',
            );
          });
      } else {
        this.setState({isLoading: false});
        alert('No hay conexión a internet');
      }
    });
  };

  render() {
    // *Botón reintentar sincronización
    const reTryBtn = (
      <TouchableHighlight
        style={styles.btnIngresar}
        onPress={this._cargaDataAsync}>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
            alignSelf: 'center',
          }}>
          Reintentar
        </Text>
      </TouchableHighlight>
    );
    // *Loader visual
    const load = <ActivityIndicator size="large" color="#007bff" />;
    return (
      <View style={styles.container}>
        <Image
          source={require('./../assets/logo-erc.png')}
          style={styles.logoRc}
          resizeMode="contain"
        />
        <View>{this.state.isLoading ? load : reTryBtn}</View>
        <Text>{this.state.load}</Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  //Convertir los actions de redux en propiedades
  return {
    addEquipoSuministroData: data => dispatch(addEquipoSuministroData(data)),
    addFundosData: data => dispatch(addFundosData(data)),
    addOperadoresData: data => dispatch(addOperadoresData(data)),
    removeDataCargasGeneradas: item =>
      dispatch(removeDataCargasGeneradas(item)),
    removeImage: image => dispatch(removeImage(image)),
    removeCargaReabastecimiento: item =>
      dispatch(removeCargaReabastecimiento(item)),
  };
};

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    signInData: state.signInData,
    dataCargasGeneradas: state.dataCargasGeneradas,
    fotos: state.fotos,
    cargasReabastecimiento: state.cargasReabastecimiento,
  };
}

// Opciones de diseño ui
const styles = StyleSheet.create({
  logoRc: {
    height: 80,
    width: 200,
    alignSelf: 'center',
    marginBottom: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 100,
  },
  btnIngresar: {
    backgroundColor: '#43aff2',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnVolver: {
    backgroundColor: '#c6c6c6',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnVolverContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

//Conexion del componente con el estado global 'redux'
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SyncScreen);
