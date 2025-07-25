import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login({navigation}){
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [isVisible, setVisibility] = useState(false)

  const baseUrl = "https://rsh1qw88-5000.inc1.devtunnels.ms/"

  async function handleLogin() {
    console.log(" email : " + email + " password: " + password)
    const res = await fetch(baseUrl + "login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })

    // console.log("here")
    const data = await res.json();
    console.log(data);
    if (data["code"] == 200) {
      // removing already stored data
      let storedUID = await AsyncStorage.getItem("uid");
      let storedEmail = await AsyncStorage.getItem("email");
      let storedName = await AsyncStorage.getItem("name");
      if (storedUID != null) {
        AsyncStorage.removeItem("uid");
      }
      if (storedEmail != null) {
        AsyncStorage.removeItem("email");
      }
      if (storedName != null) {
        AsyncStorage.removeItem("name");
      }

      //storing new data
      await AsyncStorage.setItem("uid", data["uid"]);
      console.log('UID saved successfully!');
      await AsyncStorage.setItem("email", email);
      console.log('Data saved successfully!');
      navigation.navigate("Home")
      // await AsyncStorage.setItem("uid", data["uid"]);
      // console.log('Data saved successfully!');
    }
  }

  return (
    <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
      <Text style={{
        fontSize: 36,
        textAlign: 'center',
        marginTop: 40
      }}>Login</Text>
      <View style={{
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
      }}>
        <Text style={[stylesheet.field, { marginTop: 20 }]}>Email</Text>
        <View style={stylesheet.input}>
          <TextInput style={stylesheet.textField} value={email} onChangeText={(text) => setEmail(text)} />
        </View>
        <Text style={[stylesheet.field, { marginTop: 20 }]}>Password</Text>
        <View style={[stylesheet.input, { display: 'flex', justifyContent: 'center' }]}>
          <TextInput style={stylesheet.textField} secureTextEntry={isVisible ? false : true} value={password} onChangeText={(text) => setPassword(text)} />
          <TouchableWithoutFeedback style={{
            position: 'absolute',
            right: 10
          }} onPress={() => {
            isVisible ? setVisibility(false) : setVisibility(true)
          }}><Image source={isVisible ? require('../assets/signup/showPassword.png') : require('../assets/signup/hidePassword.png')} style={stylesheet.visibilityImage} /></TouchableWithoutFeedback>
        </View>
        <TouchableOpacity onPress={handleLogin}>
          <View style={stylesheet.LoginButton}>
            <Text style={{
              fontSize: 25
            }}>Get Started</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}



const stylesheet = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    // width: "80%",
    height: 50,
    textAlignVertical: 'center',
  },
  field: {
    fontSize: 22,
    color: '#8c888eff'
  },
  textField: {
    fontSize: 20,
    color: "#242424",
    textAlign: "left",
  },
  visibilityImage: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 10
  },
  LoginButton: {
    marginTop: '20%',
    height: 40,
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center'
  }
})