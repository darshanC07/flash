import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Generate({navigation}) {
    const [input, setInput] = useState("")
    const [cards, setCards] = useState(null)
    const baseUrl = "https://rsh1qw88-5000.inc1.devtunnels.ms/"

    async function generateFlashCard() {
        console.log("input : " + input)
        const res = await fetch(baseUrl + "generate", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: input
            })
        })

        const data = await res.json();
        console.log(Object.values(data.result));
        setCards(Object.values(data.result))
    }

    useEffect(()=>{
        if(cards!=null){
            navigation.navigate("FlashCards",{cards : cards})
            // navigation.navigate("FlashCards")
        }
    },[cards])

    return (
        <SafeAreaView style={{ marginTop: StatusBar.currentHeight, alignItems: 'center', justifyContent: 'center', height: '80%' }}>
            <View style={{
                // alignSelf:'center',
                height: '50%',
                // borderColor: 'black',
                // borderWidth: 1,
                width: '90%',
                marginLeft: 10,
                marginRight: 10
            }}>
                <Text style={{
                    fontSize: 20,
                    alignSelf: 'center'
                }}>Describe Your Topic</Text>
                <View style={stylesheet.input}>
                    <TextInput style={stylesheet.textField} multiline={true}
                        numberOfLines={10} value={input} onChangeText={(text) => setInput(text)} />
                </View>
                <TouchableOpacity style={stylesheet.createButton} onPress={()=>generateFlashCard()}>
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
        width: '100%'
    },
    input: {
        width: '100%',
        height: '71%',
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 30
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
        backgroundColor: '#8485E1'
    }
})