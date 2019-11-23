import Constants from 'expo-constants';
import React, { useState } from 'react';
import { AsyncStorage, StatusBar, StyleSheet, View } from 'react-native';
import LoggedOut from './src/components/auth/LoggedOut';
import Login from './src/components/auth/Login';
import Register from './src/components/auth/Register';
import Verify from './src/components/auth/Verify';
// main navigation stack
import Stack from './src/navigation/Stack';

/*
States we can be in:
  - New user (type in phone number)
  - Verifying phone number
  - Creating username/email/password
  - Logging in
  - Logged in
*/

function LoggedIn(props) {
  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <Stack screenProps={...props}/>
    </React.Fragment>
  );
}


const loginStates = {
  // User has token that works
  loggedIn: LoggedIn,
  // User does not have a login token,
  // so we ask them where they are in the process
  loggedOut: LoggedOut,
  // User said they would like to register
  register: Register,
  // Only can get to this from Register,
  // after getting code sent to their phone
  verify: Verify,
  // User said they would like to login
  login: Login,
}

export default function App (props) {
  const [loginState, setLoginState] = useState("loggedOut");
  const [token, setToken] = useState("");
  AsyncStorage.getItem('token').then(setToken).then(() => {
    if (token) {
      setLoginState("loggedIn");
    } else {
      setLoginState("loggedOut")
    }
  });

  const Component = loginStates[loginState];
  return (
    <View style={styles.container}>
      <Component/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16
  }
});
