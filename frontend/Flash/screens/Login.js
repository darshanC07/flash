import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login({navigation}){
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [isVisible, setVisibility] = useState(false)

  const baseUrl = "https://flash-g7zw.onrender.com/"

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
      console.log('email saved successfully!');
      await AsyncStorage.setItem("name", data["name"]);
      console.log('name saved successfully!');
      navigation.replace("Home")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue learning</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.textInput} 
                value={email} 
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Password</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <View style={styles.passwordWrapper}>
              <TextInput 
                style={styles.passwordInput} 
                secureTextEntry={!isVisible} 
                value={password} 
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableWithoutFeedback onPress={() => setVisibility(!isVisible)}>
                <View style={styles.eyeIconContainer}>
                  <Image 
                    source={isVisible ? require('../assets/signup/showPassword.png') : require('../assets/signup/hidePassword.png')} 
                    style={styles.eyeIcon} 
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Get Started</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableWithoutFeedback onPress={() => navigation.replace("SignUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerGradient: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 50,
  },
  passwordWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 50,
  },
  eyeIconContainer: {
    paddingHorizontal: 16,
  },
  eyeIcon: {
    height: 24,
    width: 24,
    tintColor: '#6B7280',
  },
  loginButton: {
    marginTop: 32,
    marginBottom: 24,
  },
  buttonGradient: {
    backgroundColor: '#8485E1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8485E1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 16,
    color: '#3366CC',
    fontWeight: '600',
  },
})