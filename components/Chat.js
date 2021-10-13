import React from 'react';
import { View, Text, Button } from 'react-native';


export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ 
      title: 'Welcome ' + name,
      backgroundColor: color
     });

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <Button
          title="Go Back to Home Screen"
          onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    );
  }
}