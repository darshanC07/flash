import { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Platform, StatusBar, TextInput, StyleSheet, Image, TouchableOpacity, Button, Touchable, TouchableWithoutFeedback } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function SignUp({ navigation }) {
  const [name, setName] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [isVisible, setVisibility] = useState(false)
  const [topics, setSelected] = useState([['Artificial Intelligence', 'white', 'black', false], ['Data Science', 'white', 'black', false], ['Maths', 'white', 'black', false], ['Physics', 'white', 'black', false]])

  const baseUrl = "https://rsh1qw88-5000.inc1.devtunnels.ms/"

  async function handleSignUp() {
    try {
      let selectedCourses = []
      topics.map((topic, index) => {
        if (topic[3]) {
          selectedCourses.push(topic[0])
        }
      })
      console.log("Name : " + name + " email : " + email + " password: " + password + " selected courses " + selectedCourses)

      const res = await fetch(baseUrl + "signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          selectedCourses: selectedCourses
        })
      })

      // console.log("here")
      const data = await res.json();
      console.log(data);

      if (data && data.uid) {
        await storeData('uid', data.uid)
        await storeData('name', name)
        await storeData('email', email)

        if (data.code == 200) {
          navigation.navigate("Home")
        }
      } else {
        console.error('Invalid response from server:', data)
      }
    } catch (error) {
      console.error('Error during signup:', error)
    }
  }

  async function storeData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (uid !== null) {
          console.log("User already logged in, navigating to Home");
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, [])

  return (
    <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
      <Text style={{
        fontSize: 36,
        textAlign: 'center',
        marginTop: 40
      }}>Sign Up</Text>

      <View style={{
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
      }}>
        <Text style={stylesheet.field}>Username</Text>
        <View style={stylesheet.input}>
          <TextInput style={stylesheet.textField} value={name} onChangeText={(text) => setName(text)} />
        </View>
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
        <Text style={[stylesheet.field, { marginTop: 20 }]}>Topics</Text>
        <View style={stylesheet.topics}>
          {topics.map((topic, index) => {
            return (
              <TouchableOpacity key={index} style={[stylesheet.topicContainer, { backgroundColor: topic[1] }]} onPress={() => {
                let temp = JSON.parse(JSON.stringify(topics))
                if (!topic[3]) {
                  temp[index][1] = '#8B2CF5'
                  temp[index][2] = 'white'
                  temp[index][3] = true
                } else {
                  temp[index][1] = 'white'
                  temp[index][2] = 'black'
                  temp[index][3] = false
                }

                setSelected(temp)
              }}>
                <View >
                  <Text style={[stylesheet.topicName, { color: topic[2] }]}>{topic[0]}</Text>
                  {topic[3] ?
                    <View></View>
                    : <Image source={require('../assets/signup/plus.png')} style={stylesheet.plus} />
                  }
                </View>

              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity onPress={handleSignUp}>
          <View style={stylesheet.signUpButton}>
            <Text style={{
              fontSize: 25
            }}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View >
    </SafeAreaView >
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
  topics: {
    // height: '40%',
    // borderColor: 'black',
    // borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    gap: 8
  },
  topicContainer: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0'
  },
  topicName: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333'
  },
  plus: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: -20,
    bottom: -15
  },
  signUpButton: {
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

