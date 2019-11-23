import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { fetchVerifyPhone } from "../../../../common/auth";

export default function Verify(props) {
    const {phone} = props;
    const [code, setCode] = useState("phone");

    function onPress() {
        return fetchVerifyPhone(phone, code)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                true;  // TODO: move to logged in
            } else {
                console.log(`Failed to verify code: ${json}`)
            }
        })
        .catch((reason) => console.log(`Error verifying code: ${reason}`))
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setCode}
                value={code}
                autoCapitalize={'none'}
                placeholder={" ... "}
                placeholderTextColor="#ccc"
            />
            <Button title='Verify code' onPress={onPress} />
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
  