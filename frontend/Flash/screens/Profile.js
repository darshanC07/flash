import { ScrollView, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, BackHandler, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { openBrowserAsync } from 'expo-web-browser';

export default function Profile({ navigation }) {
    const [theme, setTheme] = useState("temp")
    const [name, setName] = useState("User")
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

    function capitalizeFirstLetter(word) {
        if (typeof word !== 'string' || word.length === 0) {
            return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            navigation.replace("Home");
            return true;
        });

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const getName = async () => {
            setName(await AsyncStorage.getItem("name"))
        }
        getName()
    }, [])

    async function referFriend() {
        console.log("clicked")

        try {
            const result = await Share.share({
                message: ("Flash App - Practice through creative flashcards \nShare : " + "https://github.com/darshanC07/flash")
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

    return (
        <SafeAreaView >
            <View style={styles.main}>
                <Image source={require("../assets/profile/bg.png")} style={styles.bg} />
                <View style={styles.dataContainer}>
                    <View style={styles.pictureCircle}>
                        <Image source={require("../assets/profile/profile.png")} style={styles.profileIcon} />
                    </View>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.optionContainer}>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/cards.png")} style={styles.icon} /> */}
                            <MaterialCommunityIcons name="cards-outline" size={30} color="black" />
                            <TouchableOpacity onPress={() => navigation.navigate("Themes")}>
                            <Text style={styles.optionText}>Set Card Theme</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.theme} onPress={() => navigation.navigate("Themes")}>
                                <View>
                                    <Text style={{ fontSize: 18, color: '#323487ff', fontWeight: 'bold' }}>{capitalizeFirstLetter(theme)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/collection.png")} style={styles.icon} /> */}
                            <MaterialIcons name="collections-bookmark" size={30} color="black" />
                            <TouchableOpacity onPress={() => navigation.replace("Home")}>
                                <Text style={styles.optionText}>Your Collection</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.option}>
                            <Ionicons name="key-outline" size={30} color="black" />
                            <Text style={styles.optionText}>Reset Password</Text>
                        </View> */}
                        <View style={styles.option}>
                            <Image source={require("../assets/profile/premium.png")} style={styles.icon} />
                            <Text style={styles.optionText}>Premium Features</Text>
                        </View>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/refer.png")} style={styles.icon} /> */}
                            <MaterialCommunityIcons name="share-outline" size={30} color="black" />
                            <TouchableOpacity onPress={referFriend}>
                                <Text style={styles.optionText}>Refer to friend</Text>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.option}>
                            <Image source={require("../assets/profile/feedback.png")} style={styles.icon} />
                            <TouchableOpacity onPress={() => openBrowserAsync("https://github.com/darshanC07/flash")}>
                                <Text style={styles.optionText}>Feedback and support</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={() => {
                        const logout = async () => {
                            await AsyncStorage.removeItem('uid')
                            await AsyncStorage.removeItem('name')
                            await AsyncStorage.removeItem('email')

                        }
                        logout()
                        navigation.replace("SignUp")
                    }}>
                        <View>
                            <Text style={{ fontSize: 20 ,color:'#1F2937'}}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    pictureCircle: {
        height: 130,
        width: 130,
        // backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: '50%',
        position: 'relative',
        bottom: "10%",
        // borderWidth: 2,
        // borderColor: 'black',
        alignItems:'center',
        justifyContent:'center'
    },
    profileIcon: {
        height: 153,
        width: 153,
    },
    dataContainer: {
        // backgroundColor: '#E9DEEE',
        backgroundColor: '#d9daf3ff',
        height: '80%',
        position: 'absolute',
        bottom: 0,
        zIndex: 3,
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: 'black'
    },
    main: {
        // marginTop: 10,
        // borderWidth:1,
        borderRadius: 20,
        // borderTopRightRadius: 20,
        // borderTopLeftRadius: 20,
        borderColor: 'black',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#b585ecff'
    },
    bg: {
        width: '100%',
        height: '28%',
        borderRadius: 20,
    },
    name: {
        fontSize: 25,
        alignSelf: 'center',
        position: 'relative',
        bottom: '8%',
        color:'#1F2937'
        // fontStyle:'italic'
    },
    optionContainer: {
        // borderWidth: 1,
        // borderColor: 'black',
        width: '90%',
        height: '60%',
        alignSelf: 'center',
        position: 'relative',
        bottom: '3%',
        paddingLeft: '3%',
        paddingRight: '3%',
        paddingTop: 20
    },
    option: {
        height: 40,
        // borderWidth:1,
        // borderColor:'black',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    icon: {
        width: 28,
        height: 28,
        // alignSelf:'flex-start'
    },
    optionText: {
        fontSize: 20,
        marginLeft: 15,
        color:'#1F2937'
    },
    loginButton: {
        width: 150,
        height: 40,
        backgroundColor: '#8485E1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'center'
    },
    theme: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#8485E1',
        padding: 5,
        position: 'absolute',
        right: 0,
        // backgroundColor:'white'
    }
})
