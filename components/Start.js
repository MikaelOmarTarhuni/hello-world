import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: ''
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/Background_Image.png')} resizeMode='cover' style={styles.image}>
          <Text style={styles.title}>Welcome to my Chat!</Text>
          <View style={styles.box}>
            <TextInput style={[styles.textBox, styles.text, styles.opacity50]}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name' />

            <Text style={styles.text}>Choose Background Color: </Text>
            <View style={styles.chooseColor}>
              <TouchableOpacity style={[styles.colorDot, styles.dot1]}
                onPress={() => this.setState({ color: '#090C08' })}></TouchableOpacity>
              <TouchableOpacity style={[styles.colorDot, styles.dot2]}
                onPress={() => this.setState({ color: '#474056' })}></TouchableOpacity>
              <TouchableOpacity style={[styles.colorDot, styles.dot3]}
                onPress={() => this.setState({ color: '#8A95A5' })}></TouchableOpacity>
              <TouchableOpacity style={[styles.colorDot, styles.dot4]}
                onPress={() => this.setState({ color: '#B9C6AE' })}></TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.chatBtn}
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                color: this.state.color
              })}>
              <Text style={styles.chatBtnTxt}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  image: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    marginTop: 100,
    textAlign: 'center',
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  box: {
    flex: .88,
    backgroundColor: 'white',
    margin: 20,
    padding: 22,
  },

  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },

  textBox: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },

  opacity50: {
    opacity: .5,
  },

  chooseColor: {
    flexDirection: 'row',
  },

  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 50,
    margin: 8,
  },

  dot1: {
    backgroundColor: '#090C08'
  },

  dot2: {
    backgroundColor: '#474056'
  },

  dot3: {
    backgroundColor: '#8A95A5'
  },

  dot4: {
    backgroundColor: '#B9C6AE'
  },

  chatBtn: {
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#757083',
    marginTop: 15,
  },

  chatBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});