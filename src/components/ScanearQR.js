'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
class ScanearQR extends Component {
  static navigationOptions = {
    title: '',
  };

  onSuccess = e => {
    const arrayDataEquipo = e.data.split(',');
    if (arrayDataEquipo.length == 4) {
      this.props.seleccionarEquipo(
        arrayDataEquipo[1],
        arrayDataEquipo[0],
        arrayDataEquipo[3],
      );
    } else {
      alert('El código escaneado no es válido' + e.data);
      this.props.closeQr();
    }
  };

  cancelarEscaneoQr = () => {
    this.props.closeQr();
  };

  render() {
    return (
      <View>
        <QRCodeScanner
          onRead={this.onSuccess}
          topContent={
            <Text style={styles.centerText}>
              Escanea el código de inicio en el equipo
            </Text>
          }
        />
        <View style={styles.btnContainer}>
          <TouchableHighlight
            style={styles.btnCancelar}
            onPress={() => this.cancelarEscaneoQr()}>
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 15,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  btnContainer: {
    position: 'absolute',
    top: 430,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  btnCancelar: {
    height: 45,
    width: 110,
    backgroundColor: 'gray',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
  },
  btnCancelarText: {
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
  },
});

export default ScanearQR;
