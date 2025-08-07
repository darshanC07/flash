import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, BackHandler, Dimensions } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { useVideoPlayer, VideoView } from 'expo-video';

export default function Generate({ navigation }) {
    const [input, setInput] = useState("")
    const [cards, setCards] = useState(null)
    const baseUrl = "https://flash-g7zw.onrender.com/"
    const [userID, setID] = useState(null);
    async function getUID() {
        let userID = await AsyncStorage.getItem("uid")
        return userID
    }
    useEffect(() => {
        const temp = async () => {
            setID(await getUID())
        }
        temp()
    }, [])
    async function generateFlashCard() {
        console.log("input : " + input)
        const res = await fetch(baseUrl + "generate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: userID,
                input: input
            })
        })

        const data = await res.json();
        console.log(JSON.stringify(data.result));
        setCards(data.result)
        // setCards(Object.values(data.result).slice(0, 10))
        // setTitle(Object.values(data.result)[10])
    }

    useEffect(() => {
        if (cards != null) {
            const data = cards
            navigation.navigate("FlashCards", { data })
            // navigation.navigate("FlashCards")
        }
    }, [cards])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            navigation.replace("Home");
            return true;
        });

        return () => backHandler.remove();
    }, []);

    const player = useVideoPlayer(require("../assets/other/bg.mp4"), player => {
        player.loop = true;
        player.staysActiveInBackground = true;
        player.play();
        // useNativeControls={false};
    });

    return (
        <SafeAreaView style={{ marginTop: StatusBar.currentHeight-15, alignItems: 'center', justifyContent: 'center', height: '90%' }}>
            <View pointerEvents="none" style={stylesheet.bgVideoContainer}>
                <VideoView style={stylesheet.bgVideo} player={player} contentFit="cover"/>
            </View>
            <View style={{
                // alignSelf:'center',
                height: '50%',
                // borderColor: 'black',
                // borderWidth: 1,
                width: '80%',
                marginLeft: 10,
                marginRight: 10,
                // backgroundColor: 'white'
            }}>
                <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0)', 
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                    height: 60,
                    width: "100%",
                    zIndex: 3,
                    position: 'absolute',
                    top: 0, 
                    justifyContent: 'center' 
                }}>

                    <Text style={{
                        fontSize: 24,
                        alignSelf: 'center',
                        color: 'white',
                       
                    }}>Describe Your Topic</Text>
                </View>
                <View style={stylesheet.input}>
                    <TextInput style={stylesheet.textField} multiline={true}
                        numberOfLines={10} value={input} onChangeText={(text) => setInput(text)} />
                </View>
                <TouchableOpacity style={stylesheet.createButton} onPress={() => generateFlashCard()}>
                    <View>
                        <Text style={{
                            fontSize: 20
                        }}>Create</Text>

                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}



const stylesheet = StyleSheet.create({
    textField: {
        fontSize: 20,
        color: "#242424",
        textAlign: "left",
        width: '100%',
        zIndex: 2,
        backgroundColor: 'white', 
        padding: 10 ,
        borderRadius:20
    },
    input: {
        width: '100%',
        height: '71%',
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: "20%",
        zIndex: 2,
        backgroundColor: 'white' 
    },
    createButton: {
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        width: '60%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: '#8485E1',
        zIndex: 2
    },
    bgVideoContainer: {
        height: Dimensions.get("window").height,
        width: '100%',
        marginLeft: 5,
        marginRight: 5,
        position: 'absolute',
        zIndex: 1,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop:"32%"
    },
    bgVideo: {
        height: '100%',
        width: '100%',
        // zIndex: 2,
    }
})