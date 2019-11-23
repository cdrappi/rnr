import Constants from 'expo-constants';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function LoggedOut(props) {
    const {setLoginState} = props

    return (
      <View style={styles.container}>
        <Button title='Register' onPress={() => setLoginState("register")}/>
        <Button title='Log In' onPress={() => setLoginState("login")}/>      
      </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16
    },
    title: {
        textAlign: 'center',
        marginVertical: 8,
        justifyContent: 'center',
        color: '#fff',
        fontSize: 18
    },
    fixToText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: '#777',
        // borderWidth: 1,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#000'
    }
});
