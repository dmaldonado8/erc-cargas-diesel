import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import ModalSelect from '../components/ModalSelect';
import {FlatList} from 'react-native-gesture-handler';

class CargasScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalDataRender: 4,
      dataGenerarQRCarga: null,
      litros: ['0', '0', '0', '0', '0'],
    };
    this.didFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.componentDidFocus();
      },
    );
  }

  static navigationOptions = {
    title: 'Cargas',
    headerShown: false,
  };

  componentDidFocus() {
    const litros = this.props.litrosEstanque;
    if (litros > 0) {
      const litrosStr = '00000' + litros.toString();
      const ot = litrosStr.substr(-5);
      const arrayLitros = ot.split('');
      this.setState({litros: arrayLitros});
    }
  }

  generarCodigoQR = item => {
    let dcd = {...item};
    const dataQR = {
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
    this.setState({
      dataGenerarQRCarga: JSON.stringify(dataQR),
      showModal: true,
      modalDataRender: 4,
    });
  };

  closeModal = () => {
    this.setState({showModal: false});
  };

  _renderItem = ({item}) => (
    <View key={item.ID}>
      {item.TIPO == 1 ? (
        <View
          style={{
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
          <TouchableHighlight
            underlayColor="#d4fabb"
            onPress={() => this.generarCodigoQR(item)}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 3,
                borderStyle: 'solid',
                borderLeftColor: '#14c7c0',
                borderLeftWidth: 4,
                flexDirection: 'row',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 6,
              }}>
              <View
                style={{
                  flex: 1,
                  height: 'auto',
                  backgroundColor: '#14c7c0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    transform: [{rotate: '-90deg'}],
                    width: '100%',
                    position: 'relative',
                    width: 76,
                    fontSize: 18,
                    color: 'white',
                  }}>
                  Descarga
                </Text>
              </View>
              <View style={{flex: 8, padding: 15}}>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Documento: </Text>
                  <Text>{item.DATA_TERMINO_CARGA.NDOCUMENTO}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>
                    Equipo abastecedor:{' '}
                  </Text>
                  <Text>{item.DATA_INICIO_CARGA.EQUIPO_ABASTECEDOR}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Equipo carga: </Text>
                  <Text>{item.DATA_INICIO_CARGA.EQUIPO_CARGA}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Operador máquina: </Text>
                  <Text>{item.DATA_INICIO_CARGA.OPERADOR_EQUIPO_CARGA}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Horómetro: </Text>
                  <Text>{item.DATA_INICIO_CARGA.HOROMETRO}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>
                    Totalizador Inicio:{' '}
                  </Text>
                  <Text>{item.DATA_INICIO_CARGA.TOTALIZADOR_INICIO}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>
                    Totalizador Termino:{' '}
                  </Text>
                  <Text>{item.DATA_TERMINO_CARGA.TOTALIZADOR_TERMINO}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Litros: </Text>
                  <Text>{item.DATA_TERMINO_CARGA.CANTIDAD} lts.</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Hora Inicio: </Text>
                  <Text>{item.DATA_INICIO_CARGA.HORA_INICIO} hrs.</Text>
                </View>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.textLabelTittle}>Hora Termino: </Text>
                  <Text>{item.DATA_TERMINO_CARGA.HORA_TERMINO} hrs.</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      ) : (
        <View
          style={{
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 3,
              borderStyle: 'solid',
              borderLeftColor: '#ff9924',
              borderLeftWidth: 4,
              flexDirection: 'row',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }}>
            <View
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: '#ff9924',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  transform: [{rotate: '-90deg'}],
                  width: '100%',
                  position: 'relative',
                  width: 66,
                  fontSize: 18,
                  color: 'white',
                }}>
                Recarga
              </Text>
            </View>
            <View style={{flex: 8, padding: 15}}>
              <View style={styles.textLabelContainer}>
                <Text style={styles.textLabelTittle}>Documento: </Text>
                <Text>{item.NDOCUMENTO}</Text>
              </View>
              <View style={styles.textLabelContainer}>
                <Text style={styles.textLabelTittle}>Litros: </Text>
                <Text>{item.LITROS} ltrs.</Text>
              </View>
              <View style={styles.textLabelContainer}>
                <Text style={styles.textLabelTittle}>Monto($): </Text>
                <Text>$ {item.MONTO}</Text>
              </View>
              <View style={styles.textLabelContainer}>
                <Text style={styles.textLabelTittle}>Hora: </Text>
                <Text>{item.HORA} hrs.</Text>
              </View>
              <View style={styles.textLabelContainer}>
                <Text style={styles.textLabelTittle}>Fecha: </Text>
                <Text>{item.FECHA}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  _keyExtractor = (item, index) => item.ID;

  _listEmptyRender = () => {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 30,
          paddingBottom: 15,
        }}>
        <Image
          source={require('./../assets/icons/empty-box.png')}
          style={{width: 250, height: 250}}
        />
        <Text style={{fontSize: 18, marginTop: 10}}>
          No hay registros para mostrar
        </Text>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  listado() {
    const dcg = this.props.dataCargasGeneradas;
    const drg = this.props.cargasReabastecimiento;
    const list = [...dcg, ...drg];
    return list;
  }

  render() {
    return (
      <View style={{height: '100%', backgroundColor: '#ebebeb'}}>
        <View style={styles.textHelpContainer}>
          <Text style={styles.textHelp}>
            Selecciona una carga para generar el código QR
          </Text>
        </View>
        <View
          style={{
            height: '20%',
            backgroundColor: '#43aff2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {this.state.litros.map((item, idx) => {
              return (
                <View style={{backgroundColor: 'black', padding: 3}} key={idx}>
                  <View
                    style={{
                      backgroundColor: 'black',
                      borderWidth: 1,
                      borderColor: 'white',
                      padding: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 32,
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      {item}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>
            Litros
          </Text>
        </View>
        <FlatList
          data={this.listado()}
          ListEmptyComponent={this._listEmptyRender}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        <ModalSelect
          modalVisible={this.state.showModal}
          closeModal={this.closeModal}
          modalDataRender={this.state.modalDataRender}
          dataCargaDieselString={this.state.dataGenerarQRCarga}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  textHelpContainer: {
    padding: 4,
    backgroundColor: '#f0e000',
  },
  textHelp: {
    fontSize: 12,
  },
});

function mapStateToProps(state) {
  //Convertir el estado global de la app en props del componente
  return {
    dataCargasGeneradas: state.dataCargasGeneradas,
    litrosEstanque: state.litrosEstanque,
    cargasReabastecimiento: state.cargasReabastecimiento,
  };
}

export default connect(
  mapStateToProps,
  null,
)(CargasScreen);
