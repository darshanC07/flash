import { View, Text, SafeAreaView, StatusBar, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Home({ navigation }) {
  const [name, setName] = useState(null)
  const [uid, setUID] = useState(null)
  const [email, setEmail] = useState(null)
  const [greeting, setGreeting] = useState(null)
  const [collections, setCollections] = useState([])

  const baseUrl = "https://rsh1qw88-5000.inc1.devtunnels.ms/"

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
        console.log(await AsyncStorage.getItem('uid') + " ")
        let storedUID = await AsyncStorage.getItem('uid')
        if (storedUID != null) {
          setUID(storedUID)
          setName(await AsyncStorage.getItem('name'))
          setEmail(await AsyncStorage.getItem('email'))
          
          await getCreations(storedUID)
        } else {
          navigation.replace("SignUp")
        }
      } catch (error) {
        console.error('Error getting data:', error);
      }
    }

    async function getCreations(userID) {
      try {
        const res = await fetch(baseUrl + "getCreations", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID: userID
          })
        })

        const data = await res.json();
        console.log(data.creations.length)
        if (data.creations.length > 0) {
          console.log(data.creations[0][11])
        }
        setCollections(data.creations)
      } catch (error) {
        console.error('Error fetching creations:', error);
      }
    }

    setData()
  }, []);



  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
      navigation.replace("Home");
      return true;
    });

    return () => backHandler.remove();
  }, []);

  function showCard(index) {
    // console.log("cards  : "+JSON.stringify(collections[index]))
    let data = collections[index]
    console.log("navigating")
    navigation.navigate("FlashCards", { data })
  }

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
          <TouchableWithoutFeedback onPress={() => { navigation.navigate("Profile") }}>
            {/* <Image source={require("../assets/home/user.png")} style={stylesheet.user} /> */}
            <FontAwesome5 name="user-circle" size={35} color="black" />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View key={'greeting'} style={stylesheet.greetingContainer}>
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ fontSize: 24 }}>{greeting}</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}> {name ? name : 'Buddy'}</Text>
          </View>
          <Text style={{ color: "#454242", fontSize: 18 }}>Ready to learn something new?</Text>
        </View>
      </View>
      <TouchableOpacity style={stylesheet.start} onPress={() => { navigation.navigate("Generate") }}>
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
        {collections.length === 0 ?
          <Text style={{
            alignSelf: 'center',
            marginTop: '50%',
            fontSize: 20,
            color: '#555353'
          }}>No flashcards created</Text> :
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              collections.map((card, index) => {
                const gradientSets = [
                  {
                    colors: ["#8485E1", "#a294f0", "#ddd8e0ff"],
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 1 }
                  },
                  {
                    colors: ["#9c8cf0", "#8485E1", "#b8a9f5"],
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 0 }
                  },
                  {
                    colors: ["#8485E1", "#7269d6", "#a294f0"],
                    start: { x: 0, y: 1 },
                    end: { x: 1, y: 0 }
                  },
                  {
                    colors: ["#a294f0", "#8485E1", "#ddd8e0ff"],
                    start: { x: 0.2, y: 0 },
                    end: { x: 0.8, y: 1 }
                  },
                  {
                    colors: ["#ddd8e0ff", "#b8a9f5", "#8485E1"],
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 1 }
                  }
                ];

                const currentGradient = gradientSets[index % gradientSets.length];

                let Title = Object.keys(card)
                  .map(key => card[key])
                  .filter(pair => pair.length === 1)

                return (
                  <TouchableOpacity style={stylesheet.cardContainer} key={index} onPress={() => showCard(index)}>
                    <LinearGradient
                      colors={currentGradient.colors}
                      style={stylesheet.gradientBackground}
                      start={currentGradient.start}
                      end={currentGradient.end}>

                      <View style={stylesheet.decorativeCircle1} />
                      <View style={stylesheet.decorativeCircle2} />

                      <View style={stylesheet.cardContent}>
                        <Text style={stylesheet.cardTitle}>{Title}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        }
      </View>
    </SafeAreaView >
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
    backgroundColor: '#ddd8e0ff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
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
    backgroundColor: '#a3a4efff',
    borderRadius: 10
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 0,
    marginBottom: 15,
    position: 'relative',
    overflow: 'hidden',
    height: 70,
    elevation: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    // paddingTop: 10,
    // paddingBottom: 15,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -10,
    left: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  arrowIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  }
})