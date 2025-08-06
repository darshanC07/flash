import { SafeAreaView, StyleSheet, Text, View, StatusBar, PanResponder, Animated, Easing, TouchableWithoutFeedback, ImageBackground, BackHandler, TouchableOpacity, Image, Share } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export default function FlashCards({ navigation }) {

    const baseUrl = "https://rsh1qw88-5000.inc1.devtunnels.ms/"

    const route = useRoute();
    const { data } = route.params;
    const [index, setIndex] = useState(0);
    const [cards, setCards] = useState([])
    const [title, setTitle] = useState(null)
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current
    const [toPlay, setPlaying] = useState(false)
    const [themeN, setThemeN] = useState(0)
    const [theme, setTheme] = useState("basic")
    const themes = {
        "landscape": [[require("../assets/themes/landscape/theme1.jpg"), '#f49700', "black"], [require("../assets/themes/landscape/theme2.jpg"), "#38dca5", "black"], [require("../assets/themes/landscape/theme3.jpg"), "#5c409d", "white"], [require("../assets/themes/landscape/theme4.jpg"), "#700021", "white"], [require("../assets/themes/landscape/theme5.jpg"), "#fac8c0", "black"],],
        "basic": [[require("../assets/themes/basic/theme1.jpg"), '#22618f', "white"], [require("../assets/themes/basic/theme2.jpg"), "#f5a25f", "black"], [require("../assets/themes/basic/theme3.jpg"), "#f9eddd", "black"], [require("../assets/themes/basic/theme4.jpg"), "#0b4e5d", "white"], [require("../assets/themes/basic/theme5.jpg"), "#0f596f", "white"],]
    }

    console.log("Theme loaded successfully")

    useEffect(() => {
        const getTheme = async () => {
            const valTheme = await AsyncStorage.getItem("theme")
            console.log("current theme : " + valTheme)
            if (valTheme) {
                setTheme(valTheme)
            }
            else
                setTheme("basic")
        }
        getTheme()
    }, [])

    let tempcards = [["What is the primary characteristic of the Waterfall model?", "Sequential phases."], ["List the typical phases of the Waterfall model.", "Requirements, Design, Implementation, Testing, Deployment, Maintenance."], ["Is the Waterfall model an iterative development approach?", "No."], ["What type of projects is the Waterfall model best suited for?", "Projects with stable and well-understood requirements."], ["What is a major disadvantage of the Waterfall model regarding late changes?", "It is difficult and costly to accommodate changes late in the lifecycle."], ["What is an advantage of using the Waterfall model?", "It is simple to understand and manage."], ["Does the Waterfall model allow for feedback loops between phases?", "No, typically not directly."], ["When is testing typically performed in the Waterfall model?", "After implementation is complete."], ["What happens if a critical error is found during the testing phase?", "It can lead to significant rework across previous phases."], ["Is customer involvement continuous throughout the Waterfall project?", "No, mostly at the beginning and end."]]

    let temptitle = "WaterFall Model"


    // useEffect(() => {
    //     setCards(tempcards);
    //     setTitle(temptitle);
    // }, [])

    useEffect(() => {
        if (data) {
            const nestedArray = Object.keys(data)
                .map(key => data[key])
                .filter(pair => pair.length === 2)
            console.log(nestedArray)
            // console.log("received data")
            setCards(nestedArray)

            const Title = Object.keys(data)
                .map(key => data[key])
                .filter(pair => pair.length === 1)
            setTitle(Title)
        }
    }, [])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            navigation.replace("Home");
            return true;
        });

        return () => backHandler.remove();
    }, []);

    const [pan] = useState(new Animated.ValueXY());

    useEffect(() => {
        flipAnimation.setValue(0);
        setIsFlipped(false);
        pan.setValue({ x: 0, y: 0 });

    }, [index]);



    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const flipToFrontStyle = {
        transform: [{ rotateY: frontInterpolate }]
    };

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipToBackStyle = {
        transform: [{ rotateY: backInterpolate }]
    };

    const flipCard = () => {
        console.log("Flipping card, current isFlipped:", isFlipped);

        if (isFlipped) {
            // animate back to the front side
            Animated.spring(flipAnimation, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start(() => {
                console.log("Animation to front completed");
            });
        } else {
            // animate to the back side
            Animated.spring(flipAnimation, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start(() => {
                console.log("Animation to back completed");
            });
        }
        setIsFlipped(!isFlipped);
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
            [null, { dx: pan.x }],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, gestureState) => {
            console.log('Gesture State:', gestureState);

            if (Math.abs(gestureState.dx) > 50) {
                if (gestureState.dx > 100 && index > 0) {
                    setIndex((prevIndex) => prevIndex - 1);
                    themeN == 0 ? setThemeN(4) : setThemeN((prev) => prev - 1)
                    setIsFlipped(false);
                } else if (gestureState.dx < -100 && index < cards.length - 1) {
                    setIndex((prevIndex) => prevIndex + 1);
                    themeN == 4 ? setThemeN(0) : setThemeN((prev) => prev + 1)
                    setIsFlipped(false);
                }
            }
            else if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
                console.log('Tap detected, flipping card');
                flipCard();
            }

            Animated.timing(pan, {
                toValue: { x: 0, y: 0 },
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        },
    });

    async function speakText(text) {
        Speech.speak(text, {
            language: 'en-IN',
            voice: 'en-in-x-end-network',
            pitch: 1.5,
            rate: 1,
            onDone: () => console.log('Speech finished!'),
            onError: (error) => console.error('Speech error:', error),
        }
        )
    }

    useEffect(() => {
        if (toPlay) {
            Speech.stop()
        } else {
            if (cards && cards.length > 0 && cards[index] && cards[index][0]) {
                speakText(cards[index][0]);
            }
        }
    }, [toPlay, cards, index])

    async function shareCard() {
        console.log("clicked")
        const uid = await AsyncStorage.getItem("uid")

        const res = await fetch(baseUrl + "getPandC", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: uid,
                title: title,
            })
        })

        const data = await res.json();
        console.log(data);
        if (data.code == 200) {
            let shareURL = baseUrl + "open?f=" + data["pID"] + "&i=" + data["cID"]

            try {
                const result = await Share.share({
                    message: ("Flash App - Practice through creative flashcards \n Open this card : " + shareURL)
                });

                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log("shared with : ", result.activityType)
                    } else {
                        console.log("shared")
                    }
                }
                else if (result.action === Share.dismissedAction) {
                    console.log("dismissed")
                }

            } catch (error) {
                console.log(error.message)
            }

        }
    }

    return (
        <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
            <View style={{
                borderWidth: 1,
                borderColor: 'black',
                margin: 10,
                width: '90%',
                height: '93%',
                alignSelf: 'center',
                marginTop: 30,
                borderRadius: 20
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '10%', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
                    <TouchableOpacity onPress={() => setPlaying(prevVal => !prevVal)}>
                        <Image source={toPlay ? require("../assets/other/offSpeaker.png") : require("../assets/other/onSpeaker.png")} style={styles.speakericon} />
                    </TouchableOpacity>
                    <View style={{ maxWidth: '65%', alignSelf: 'center', maxHeight: '100%' }}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <TouchableOpacity onPress={shareCard}>
                        <Image source={require("../assets/other/share.png")} style={styles.speakericon} />
                    </TouchableOpacity>

                </View>
                <View style={{ height: '95%' }}>

                    <View style={{
                        width: '80%',
                        alignSelf: 'center',
                        marginTop: '23%',
                        height: '60%',
                        zIndex: 2,

                    }} {...panResponder.panHandlers}>

                        {/* Pan animation wrapper */}
                        <Animated.View style={{
                            width: '100%',
                            height: '100%',
                            transform: [{ translateX: pan.x }]
                        }}>

                            {/* Card container for flip animation */}
                            <TouchableWithoutFeedback onPress={flipCard}>
                                <View style={{
                                    width: '100%',
                                    height: '100%',
                                }}>
                                    <Animated.View style={[{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '99%',
                                        height: '100%',
                                        // backgroundColor: 'rgba(222, 228, 95, 1)',
                                        borderRadius: 20,
                                        borderWidth: 3,
                                        borderColor: 'black',
                                        position: 'absolute',
                                        backfaceVisibility: 'hidden',
                                    }, flipToFrontStyle]}>
                                        <ImageBackground source={themes[theme][themeN][0]} resizeMode="cover" style={{
                                            width: '100%',
                                            height: '100%', justifyContent: 'center', alignItems: 'center'
                                        }} imageStyle={{ borderRadius: 15, alignSelf: 'center', width: '100%' }}>
                                            <View style={{
                                                width: '90%',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                // borderRadius:20
                                            }}>
                                                {/* <BlurView
                                                    style={styles.absolute}
                                                    blurType="light"
                                                    blurAmount={10}
                                                    reducedTransparencyFallbackColor="white"
                                                /> */}
                                                <Text style={{
                                                    fontSize: 20,
                                                    textAlign: 'center',
                                                }}>{cards[index] && cards[index][0]}</Text>

                                            </View>
                                        </ImageBackground>
                                    </Animated.View>

                                    <Animated.View style={[{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        // backgroundColor: '#ffa742',
                                        backgroundColor: themes[theme][themeN][1],
                                        borderRadius: 20,
                                        borderWidth: 2.5,
                                        borderColor: 'black',
                                        position: 'absolute',
                                        backfaceVisibility: 'hidden',
                                    }, flipToBackStyle]}>
                                        <Text style={{
                                            fontSize: 22,
                                            width: '90%',
                                            textAlign: 'center',
                                            color: themes[theme][themeN][2],
                                            // backgroundColor:'white'
                                            // fontWeight:'bold'
                                        }}>{cards[index] && cards[index][1]}</Text>
                                    </Animated.View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Animated.View>
                    </View>

                    <View style={{
                        width: '80%',
                        // backgroundColor: '#8b3d3dff',
                        backgroundColor: 'rgba(222, 228, 95, 1)',
                        borderColor: 'black',
                        borderWidth: 1,
                        alignSelf: 'center',
                        marginTop: '16%',
                        height: '60%',
                        borderRadius: 20,
                        zIndex: 1,
                        position: 'absolute',
                        right: 20,
                        bottom: '28%',
                        transform: [{ rotate: '2deg' }]
                    }}></View>
                </View>

                <View style={{
                    position: 'absolute',
                    bottom: '5%',
                    alignSelf: 'center',
                    alignContent: 'center'
                }}>
                    <Text style={{ textAlign: 'center', color: '#887E7E' }}>Tap to view answer</Text>
                    <Text style={{ textAlign: 'center', color: '#887E7E', marginTop: 10 }}>Slide for next question</Text>
                    {/* <Text style={{ textAlign: 'center', color: '#887E7E', marginTop: 5, fontSize: 12 }}>
                        Card {index + 1} of {cards.length} | {isFlipped ? 'Answer' : 'Question'}
                    </Text> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        alignSelf: 'center',
        // marginTop: '10%',
        // maxWidth: '65%',
        textAlign: 'center',
        // borderWidth: 1,
        // borderColor: 'black'
    },
    speakericon: {
        width: 30,
        height: 30
    }
})