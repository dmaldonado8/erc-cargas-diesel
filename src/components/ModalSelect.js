import React from 'react';
import {connect} from 'react-redux';
import {Modal, View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {normalize} from '../helpers/normalize';
import QRCode from 'react-native-qrcode-generator';

class ModalSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderEquiposSuministro = () => {
    const dataEquipos = this.props.dataEquiposSuministro;
    return (
      <View>
        <View style={styles.modalTittleContainer}>
          <Text style={styles.modalTittle}>Equipo de suministro</Text>
        </View>
        <View style={{maxHeight: 500}}>
          <ScrollView>
            {dataEquipos.map((item, key) => {
              return (
                <TouchableHighlight
                  underlayColor="#ace5e6"
                  key={key}
                  style={styles.modalOption}
                  onPress={() => this.props.seleccionarEquipoSuministro(item)}>
                  <Text
                    style={{
                      fontSize: normalize(8),
                      color: 'black',
                    }}>
                    {item.NOMBRE}
                  </Text>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  _renderFundos = () => {
    const dataFundos = this.props.dataFundos;
    return (
      <View>
        <View style={styles.modalTittleContainer}>
          <Text style={styles.modalTittle}>Fundos</Text>
        </View>
        <View style={{maxHeight: 500}}>
          <ScrollView>
            {dataFundos.map((item, key) => {
              return (
                <TouchableHighlight
                  underlayColor="#ace5e6"
                  key={key}
                  style={styles.modalOption}
                  onPress={() => this.props.seleccionarFundo(item)}>
                  <Text
                    style={{
                      fontSize: normalize(8),
                      color: 'black',
                    }}>
                    {item.FUNDO}
                  </Text>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  _renderOperadores = () => {
    const dataOperadores = this.props.dataOperadores;
    return (
      <View>
        <View style={styles.modalTittleContainer}>
          <Text style={styles.modalTittle}>Operador de máquina</Text>
        </View>
        <View style={{maxHeight: 500}}>
          <ScrollView>
            {dataOperadores.map((item, key) => {
              return (
                <TouchableHighlight
                  underlayColor="#ace5e6"
                  key={key}
                  style={styles.modalOption}
                  onPress={() => this.props.seleccionarOperadorMaquina(item)}>
                  <Text
                    style={{
                      fontSize: normalize(8),
                      color: 'black',
                    }}>
                    {item.NOMBRE_OPERADOR}
                  </Text>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  _renderCodigoQR = () => {
    return (
      <View>
        <View style={styles.modalTittleContainer}>
          <Text style={styles.modalTittle}>Código a escanear</Text>
        </View>
        <View style={{maxHeight: 500}}>
          <View style={styles.containerCodigoQR}>
            <QRCode
              value={this.props.dataCargaDieselString}
              size={280}
              bgColor="black"
              fgColor="white"
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <Modal transparent={true} visible={this.props.modalVisible}>
        <View style={styles.fondoModal}>
          <View style={styles.modalContainer}>
            <TouchableHighlight
              underlayColor="#ace5e6"
              style={styles.btnCerrarModal}
              onPress={() => this.props.closeModal()}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                X
              </Text>
            </TouchableHighlight>
            {this.props.modalDataRender === 1
              ? this._renderEquiposSuministro()
              : this.props.modalDataRender === 2
              ? this._renderFundos()
              : this.props.modalDataRender === 3
              ? this._renderOperadores()
              : this.props.modalDataRender === 4
              ? this._renderCodigoQR()
              : null}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  fondoModal: {
    backgroundColor: 'rgba(35, 35, 35, .8)',
    height: '100%',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    position: 'relative',
  },
  btnCerrarModal: {
    position: 'absolute',
    zIndex: 2000,
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
  },
  modalTittleContainer: {
    backgroundColor: '#007bff',
    height: 70,
    justifyContent: 'center',
  },
  modalTittle: {
    fontSize: normalize(12),
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    height: 50,
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomColor: '#d4d4d4',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  containerCodigoQR: {
    display: 'flex',
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: '70%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});

function mapStateToProps(state) {
  return {
    dataEquiposSuministro: state.dataEquiposSuministro,
    dataFundos: state.dataFundos,
    dataOperadores: state.dataOperadores,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ModalSelect);
