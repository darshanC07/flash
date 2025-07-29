import { View, Text, SafeAreaView, StatusBar, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export default function Home({navigation}) {
  const [name, setName] = useState(null)
  const [uid, setUID] = useState(null)
  const [email, setEmail] = useState(null)
  const [greeting, setGreeting] = useState(null)
  const [collections, setCollections] = useState([])
  useEffect(() => {
    let now = new Date()
    let hrs = now.getHours()

    if (hrs >= 4 && hrs <= 12) {
      setGreeting("Good Morning")
    }
    else if (hrs > 12 && hrs <= 16) {
      setGreeting("Good Afternoon")
    }
    else if (hrs > 16 && hrs <= 19) {
      setGreeting("Good Evening")
    }
    else {
      setGreeting("Good Night")
    }
  }, [])

  useEffect(() => {
    const setData = async () => {
      try {
        console.log(await AsyncStorage.getItem('uid') + " ") // + await AsyncStorage.getItem('name')
        setUID(await AsyncStorage.getItem('uid'))
        // setName(await AsyncStorage.getItem('name'))
        setEmail(await AsyncStorage.getItem('email'))
      } catch (error) {
        console.error('Error getting data:', error);
      }
    }
    setData()
  }, []);


  return (
    <SafeAreaView style={{
      marginTop: StatusBar.currentHeight + 10,
      // borderColor: 'black',
      // borderWidth: 2,
      height: '92%',
      marginLeft: 10,
      marginRight: 10,
      paddingLeft: 10,
      paddingRight: 10
    }}>
      <View key={'header'} style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View>
          <Text>Flash</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 10
        }}>
          <View style={{
            flexDirection: 'row',
            borderColor: 'black',
            borderWidth: 1,
            padding: 6,
            paddingTop: 3,
            paddingBottom: 3,
            alignSelf: 'center',
            borderRadius: 10
          }}>
            <Image source={require("../assets/home/streak.png")} style={stylesheet.streak} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>2</Text>
          </View>
          <TouchableWithoutFeedback onPress={()=>{navigation.navigate("Profile")}}>
            <Image source={require("../assets/home/user.png")} style={stylesheet.user} />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View key={'greeting'} style={stylesheet.greetingContainer}>
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ fontSize: 20 }}>{greeting}</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}> {name ? name : 'Buddy'}</Text>
          </View>
          <Text style={{ color: "#454242", fontSize: 18 }}>Ready to learn something new?"</Text>
        </View>
      </View>
      <TouchableOpacity style={stylesheet.start} onPress={()=>{navigation.navigate("Generate")}}>
        <View >
          <Text style={{ fontSize: 20 }}>Generate</Text>
        </View>

      </TouchableOpacity>
      <Text style={{
        position: 'absolute',
        bottom: '56%',
        paddingLeft: 20,
        fontSize: 20
      }}>Your Collections</Text>
      <View style={stylesheet.collections}>
        {collections.length == 0 ?
          <Text style={{
            alignSelf: 'center',
            marginTop: '50%',
            fontSize: 20,
            color: '#555353'
          }}>No flashcards created</Text> : <Text></Text>

        }
      </View>
    </SafeAreaView>
  )
}

const stylesheet = StyleSheet.create({
  streak: {
    height: 25,
    width: 25,
  },
  user: {
    height: 45,
    width: 45,
    alignSelf: 'flex-end'
  },
  greetingContainer: {
    borderColor: 'black',
    borderWidth: 1,
    height: '10%',
    backgroundColor: '#ddd8e0ff',
    borderRadius: 10,
    marginTop: '3%',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    marginTop: '10%',
  },
  collections: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    height: '50%',
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#ddd8e0ff'
  },
  start: {
    borderWidth: 1,
    borderColor: 'black',
    width: '40%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '65%',
    backgroundColor:'#8485E1',
    borderRadius:10
  }
})