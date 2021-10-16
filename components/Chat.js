import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'

import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtqFXa_vCzTWNQorhbWCzAsGBpufv8as0",
  authDomain: "chatapp-66064.firebaseapp.com",
  projectId: "chatapp-66064",
  storageBucket: "chatapp-66064.appspot.com",
  messagingSenderId: "876333387812",
  appId: "1:876333387812:web:369554eeedeb465ef148b1"
}

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: 'Logging in...',
      user: {
        _id: '',
        name: '',
      },
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceMessages = firebase.firestore().collection('messages');
    this.referenceMessageUser = null;
        
  }



  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) { 
        firebase.auth().signInAnonymously(); 
      }


    this.setState({
      uid: user.uid,
      messages: [],
          user: {
            _id: user.uid,
            name: name,
         }
        });
      this.referenceMessagesUser = firebase.firestore()
      .collection('messages')
      .where('uid', '==', this.state.uid);

      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });

    });

    this.setState({
      messages,
    });
  }

  addMessage() {
    const message = this.state.messages[0];

    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),

    () => {
      this.addMessage();
    })
  }

  renderSystemMessage(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    if (backgroundColor !== '#FFFFFF') {
      return (
        <SystemMessage
          {...props}
          textStyle={{ color: '#FFFFFF' }}
          timeTextStyle={{ color: '#FFFFFF' }}
        />
      );
    }
  }

    renderBubble(props) {
      let backgroundColor = this.props.route.params.backgroundColor;
      if (backgroundColor === '#FFFFFF') {
        return (
          <Bubble
            {...props}
          />
        )
      } else {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          />
        )
      }
    }


  render() {

    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ 
      title: 'Welcome ' + name,
      backgroundColor: color
   });
    

    return (
      <View style={styles.container}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          onSend={messages => this.onSend(messages)}
          isTyping={true}
          user={this.state.user}
        />
        { Platform.OS === 'android' ? 
          <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})