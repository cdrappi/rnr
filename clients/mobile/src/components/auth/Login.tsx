import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import Separator from "../Separator";


export default function Login(props) {
    const [loginType, setLoginType] = useState("phone");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    function ButtonToggle(innerProps) {
        const {toggleType} = innerProps;
        return (<Button 
            style={toggleType === loginType ? styles.activeButton : styles.inactiveButton} 
            onPress={() => setLoginType(toggleType)} 
            title={toggleType}/>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginTypes}>
                <ButtonToggle toggleType={'phone'}/>
                <ButtonToggle toggleType={'email'}/>
                <ButtonToggle toggleType={'number'}/>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={setLogin}
                value={login}
                autoCapitalize={'none'}
                placeholder={loginType}
                placeholderTextColor="#ccc"
            />
            <Separator flex={1} />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="password"
                placeholderTextColor="#ccc"
                secureTextEntry={true}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginHorizontal: 16
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: '#777',
      // borderWidth: 1,
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#000'
    },
    activeButton: {
        color: '#0f0'
    },
    inactiveButton: {
        color: '#000'
    }
  });
  