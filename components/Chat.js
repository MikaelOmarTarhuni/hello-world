import React from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Button, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


const firebase = require('firebase').default;
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            loggedInText: 'Please wait, you are getting logged in',
            user: {
                _id: '',
                name: '',
                avatar: null,
            },
            isConnected: false,
        };


        const firebaseConfig = {
          apiKey: "AIzaSyCtqFXa_vCzTWNQorhbWCzAsGBpufv8as0",
          authDomain: "chatapp-66064.firebaseapp.com",
          projectId: "chatapp-66064",
          storageBucket: "chatapp-66064.appspot.com",
          messagingSenderId: "876333387812",
          appId: "1:876333387812:web:369554eeedeb465ef148b1"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.referenceMessageUser = null;

    }

    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    componentDidMount() {
        //check if a user is online
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({
                    isConnected: true,
                });
                console.log('online');

                // listen to authentication events
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    // Update user state with active user    
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any',
                        }
                    });

                    // Create reference to the active users messages
                    this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);

                    // Listen for collection changes
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy("createdAt", "desc")
                        .onSnapshot(this.onCollectionUpdate);
                });

            } else {
                console.log('offline');
                this.setState({ isConnected: false })
                //get messages from the async storage
                this.getMessages();
            }
        });

        //Reference the name entered on the start screen
        let name = this.props.route.params.name;
        //set name to be on top of screen
        this.props.navigation.setOptions({ title: name });
    }

    componentWillUnmount() {
        this.authUnsubscribe();
    }

    //Send messages
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            //call addMessages to save messages to the collection on firebase (only available online)
            () => {
                this.addMessages();
                //call save messages to save messages to async storage (available offline)
                this.saveMessages()
            });
    }

    //add a new message to Async storage

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    // add a new message to the collection
    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text,
            uid: this.state.uid,
            user: message.user,
        });
    }

    //function to delete stored messages (from async storage?)
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    // Retrieve current messages and store them in the state: messages
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
            });
        });
        this.setState({
            messages,
        });
    }

    // Sets message bubble color
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#cdc8da'
                    }
                }}
            />
        )
    }

    //only render input tool bar hen the user is online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    render() {
        let backgroundColor = this.props.route.params.backgroundColor;
        
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({title: 'Welcome ' + name});

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}