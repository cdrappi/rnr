import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { fetchSendCode } from "../../../../common/auth";

export default function Register(props) {
    const [phone, setPhone] = useState("phone");

    function onPress() {
        fetchSendCode(phone)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                true;  // TODO: move screen
            } else {
                console.log(`Failed to register: ${json}`)
            }
        })
        .catch((reason) => console.log(`Error registering: ${reason}`))
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setPhone}
                value={phone}
                autoCapitalize={'none'}
                placeholder={"18008675309"}
                placeholderTextColor="#ccc"
            />
            <Button title='Send SMS code' onPress={onPress} />
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
    }
  });
  