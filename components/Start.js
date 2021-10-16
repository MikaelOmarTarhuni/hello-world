import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const background = require('../assets/Background_Image.png');
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE', '#FFFFFF'];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            backgroundColor: '#408337',
        }
    }

    onGoToChat = (name, backgroundColor) => {
        if (name == '') {
            return Alert.alert('Please enter your name.');
        }
        this.props.navigation.navigate('Chat', {
            name: `${name}`,
            backgroundColor: `${backgroundColor}`,
        });
    };

    render() {
        const setColor = this.state.backgroundColor;
        return (
            <View style={styles.container}>
                <ImageBackground source={background} style={styles.background}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>Chat App</Text>
                    </View>
                    <View style={styles.wrapper}>
                        <TextInput
                            style={styles.namefield}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Your Name'
                        />
                        <Text style={styles.text}>Choose Background Color:</Text>
                        <View style={styles.colorsMenu}>
                            {colors.map((selectedColor) => (
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel="Select Background Color"
                                    accessibilityHint="Sets your chat screens background color."
                                    accessibilityRole="button"

                                    key={selectedColor}
                                    style={[
                                        styles.colorOptions(selectedColor),
                                        setColor === selectedColor ? styles.border : null,
                                    ]}
                                    activeOpacity={0.5}
                                    onPress={() => this.setState({ backgroundColor: selectedColor })}
                                />
                            ))}
                        </View>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="Go to chat"
                            accessibilityHint="Takes you to the chat screen."
                            accessibilityRole="button"
                            style={styles.button}
                            onPress={() => this.onGoToChat(this.state.name, this.state.backgroundColor)}>
                            <Text style={styles.buttonText}>
                                GO TO CHAT
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    titleWrapper: {
        flex: 0.4,
        justifyContent: 'space-evenly',
    },
    title: {
        color: '#fff',
        fontSize: 42,
        fontWeight: 'bold',

    },
    text: {
        color: "gray",
        fontSize: 16,
    },
    namefield: {
        backgroundColor: '#fff',
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        padding: 5,
    },
    wrapper: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        width: '88%',
        flex: 0.44,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    colorsMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    colorOptions: (selectedColor) => ({
        backgroundColor: selectedColor,
        width: 40,
        height: 40,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 50,
    }),
    border: {
        borderWidth: 2,
        borderColor: 'black',
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#757083',
        alignItems: 'center',
        fontWeight: 'bold',
        justifyContent: 'space-evenly',
    },
    buttonText: {
        color: '#FFFFFF'
    },
});