import { StyleSheet, Text, View, StatusBar, Image, ScrollView, Dimensions, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Themes({ navigation }) {
    const [theme, setTheme] = useState({
        basic: true,
        landscape: false,
        dark: false
    })

    function selectTheme(chooseThemeName) {
        console.log("before : " + JSON.stringify(theme, null, 2));
        let temp = JSON.parse(JSON.stringify(theme))
        for (let key in temp) {
            if (temp[key]) {
                temp[key] = false
            }
            else {
                temp[key] = false
            }
        }
        temp[chooseThemeName] = true
        console.log("after : " + JSON.stringify(temp, null, 2))
        setTheme(temp)
    }

    useEffect(() => {
        const getTheme = async () => {
            let currentTheme = await AsyncStorage.getItem("theme")
            let temp = JSON.parse(JSON.stringify(theme))
            for (let key in temp) {
                if (temp[key]) {
                    temp[key] = false
                }
            }
            if (currentTheme) {
                temp[currentTheme] = true
            }
            setTheme(temp)
        }
        getTheme()
    }, [])

    useEffect(() => {
        const saveTheme = async () => {
            let currentTheme = await AsyncStorage.getItem("theme")


            let chooseTheme;
            for (let key in theme) {
                if (theme[key]) {
                    chooseTheme = key
                    break;
                }
            }
            if (currentTheme != null) {
                await AsyncStorage.removeItem("theme")
            }
            await AsyncStorage.setItem("theme", chooseTheme)
            console.log("theme : " + await AsyncStorage.getItem("theme"))
        }

        saveTheme()
    }, [theme])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            navigation.replace("Profile");
            return true;
        });

        return () => backHandler.remove();
    }, []);


    return (
        <SafeAreaView >

            <View style={styles.main}>
                <View style={styles.header}>

                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image source={require("../assets/other/backArrow.png")} style={styles.backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Card Themes</Text>
                </View>
                <View style={{ flex: 1, paddingBottom: 20, marginTop: 10 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                        scrollEventThrottle={16}
                        overScrollMode="never"
                        nestedScrollEnabled={false}
                        contentInsetAdjustmentBehavior="never"

                        style={{
                            // backgroundColor:'pink'
                        }}
                    >

                        <View style={styles.theme}>
                            <View style={styles.themeNameContainer}>
                                <Text style={styles.themeName}>Basic</Text>
                                <TouchableOpacity onPress={() => selectTheme("basic")}>
                                    <Image source={theme["basic"] ? require("../assets/other/selected.png") : require("../assets/other/unselected.png")} style={styles.selectIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imgContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Image style={styles.themeImage} source={require("../assets/themes/basic/theme1.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/basic/theme2.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/basic/theme3.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/basic/theme4.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/basic/theme5.jpg")} />
                                </ScrollView>
                            </View>
                        </View>
                        <View style={[styles.theme, { marginBottom: 0 }]}>
                            <View style={styles.themeNameContainer}>
                                <Text style={styles.themeName}>Landscape</Text>
                                <TouchableOpacity onPress={() => selectTheme("landscape")}>
                                    <Image source={theme["landscape"] ? require("../assets/other/selected.png") : require("../assets/other/unselected.png")} style={styles.selectIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imgContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme1.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme2.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme3.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme4.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme5.jpg")} />
                                </ScrollView>
                            </View>
                        </View>
                        <View style={[styles.theme, { marginBottom: 0 }]}>
                            <View style={styles.themeNameContainer}>
                                <Text style={styles.themeName}>Landscape</Text>
                                <TouchableOpacity onPress={() => selectTheme("dark")}>
                                    <Image source={theme["dark"] ? require("../assets/other/selected.png") : require("../assets/other/unselected.png")} style={styles.selectIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imgContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme1.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme2.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme3.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme4.jpg")} />
                                    <Image style={styles.themeImage} source={require("../assets/themes/landscape/theme5.jpg")} />
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        // flex: 1,
        // marginTop: 10,
        // borderWidth:1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderColor: 'black',
        marginLeft: 10,
        marginRight: 10,
        // height: Dimensions.get('window').height,
        height: '100%'
        // backgroundColor: '#e1dadaff'
    },
    title: {
        fontSize: 22,
        alignSelf: 'center',
        // marginTop: '5%'
    },
    backArrow: {
        width: 30,
        height: 30,
        // position:'absolute',
        left: 0
    },
    header: {
        flexDirection: 'row',
        alignSelf: 'left',
        marginTop: '5%',
        gap: '25%',
        marginLeft: 10
        // width:'100%'
    },
    themeNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    selectIcon: {
        width: 30,
        height: 30
    },
    themeName: {
        fontSize: 24
    },
    theme: {
        paddingLeft: '5%',
        paddingRight: '5%',
        height: 300,
        // marginBottom: 10,
    },
    scrollContent: {
        paddingBottom: 0,
    },
    imgContainer: {
        width: '100%',
        height: "80%",
        // backgroundColor:'white',
        // borderWidth: 1,
        // borderColor: 'black',
        marginTop: 20
    },
    themeImage: {
        height: 230,
        width: 120,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        marginRight: 10
    }
});