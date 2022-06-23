import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';

class RadioButton extends React.Component {
  constructor(props) {
    super(props);
  }

  selectOption(value) {
    this.props.selectOption(value);
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        {[...this.props.options].map((item, index) => {
          return (
            <View style={styles.radioContainer} key={index}>
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                  style={[
                    styles.button,
                    this.props.value == item.VALUE
                      ? styles.buttonChecked
                      : styles.buttonUncheck,
                  ]}
                  onPress={() => this.props.selectOption(item.VALUE)}>
                  <Text />
                </TouchableHighlight>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.TEXTO}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 30,
    width: 30,
    borderStyle: 'solid',
    borderWidth: 4,
    borderRadius: 15,
    borderColor: '#025769',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  buttonChecked: {
    backgroundColor: '#025769',
  },
  buttonUncheck: {
    backgroundColor: 'transparent',
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  text: {
    fontSize: 15,
    marginRight: 15,
  },
  textContainer: {
    padding: 5,
    marginLeft: 8,
  },
});

export default RadioButton;
