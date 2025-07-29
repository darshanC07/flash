import { ScrollView, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'

export default function Profile({ navigation }) {
    const [theme, setTheme] = useState("temp")
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
    return (
        <SafeAreaView >
            <View style={styles.main}>
                <View style={styles.dataContainer}>
                    <View style={styles.pictureCircle}></View>
                    <Text style={styles.name}>Darshan</Text>
                    <View style={styles.optionContainer}>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/cards.png")} style={styles.icon} /> */}
                            <MaterialCommunityIcons name="cards-outline" size={30} color="black" />
                            <Text style={styles.optionText}>Set Card Theme</Text>
                            <TouchableOpacity style={styles.theme} onPress={() => navigation.navigate("Themes")}>
                                <View>
                                    <Text style={{ fontSize: 18, color: '#323487ff' }}>{capitalizeFirstLetter(theme)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/collection.png")} style={styles.icon} /> */}
                            <MaterialIcons name="collections-bookmark" size={30} color="black" />
                            <Text style={styles.optionText}>Your Collection</Text>
                        </View>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/password.png")} style={styles.icon} /> */}
                            <Ionicons name="key-outline" size={30} color="black" />
                            <Text style={styles.optionText}>Reset Password</Text>
                        </View>
                        <View style={styles.option}>
                            <Image source={require("../assets/profile/premium.png")} style={styles.icon} />
                            <Text style={styles.optionText}>Premium Features</Text>
                        </View>
                        <View style={styles.option}>
                            {/* <Image source={require("../assets/profile/refer.png")} style={styles.icon} /> */}
                            <MaterialCommunityIcons name="share-outline" size={30} color="black" />
                            <Text style={styles.optionText}>Refer to friend</Text>
                        </View>
                        <View style={styles.option}>
                            <Image source={require("../assets/profile/feedback.png")} style={styles.icon} />
                            <Text style={styles.optionText}>Feedback and support</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={() => {
                        const logout = async () => {
                            await AsyncStorage.removeItem('uid')
                            await AsyncStorage.removeItem('name')
                            await AsyncStorage.removeItem('email')

                        }
                        logout()
                        navigation.navigate("SignUp")
                    }}>
                        <View>
                            <Text style={{ fontSize: 20 }}>Logout</Text>
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
        backgroundColor: 'black',
        alignSelf: 'center',
        borderRadius: '50%',
        position: 'relative',
        bottom: "10%"
    },
    dataContainer: {
        backgroundColor: '#E9DEEE',
        height: '82%',
        position: 'absolute',
        bottom: 0,
        zIndex: 3,
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%'
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
    name: {
        fontSize: 20,
        alignSelf: 'center',
        position: 'relative',
        bottom: '8%'
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
        marginLeft: 15
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