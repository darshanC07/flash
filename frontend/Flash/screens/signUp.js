import { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Platform, StatusBar, TextInput, StyleSheet, Image, TouchableOpacity, Button, Touchable, TouchableWithoutFeedback, ScrollView } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SignUp({ navigation }) {
  const [name, setName] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [isVisible, setVisibility] = useState(false)
  const [topics, setSelected] = useState([['Artificial Intelligence', 'white', 'black', false], ['Data Science', 'white', 'black', false], ['Maths', 'white', 'black', false], ['Physics', 'white', 'black', false]])

  const baseUrl = "https://flash-g7zw.onrender.com/"

  async function handleSignUp() {
    try {
      let selectedCourses = []
      topics.map((topic, index) => {
        if (topic[3]) {
          selectedCourses.push(topic[0])
        }
      })
      if (!name || !email || !password || selectedCourses.length == 0) {
        console.log("no data entered")
      } else {
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

        if (data.code == 200 && data.uid) {
          await storeData('uid', data.uid)
          await storeData('name', name)
          await storeData('email', email)

          navigation.replace("Home")
          
        } else {
          console.error('Invalid response from server:', data)
        }
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Flash and start learning</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Username</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.textInput} 
                value={name} 
                onChangeText={(text) => setName(text)}
                placeholder="Enter your username"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

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

          <View style={styles.topicsSection}>
            <Text style={styles.topicsTitle}>Choose Your Interests</Text>
            <Text style={styles.topicsSubtitle}>Select topics you'd like to learn about</Text>
            <View style={styles.topicsGrid}>
              {topics.map((topic, index) => {
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.topicChip, topic[3] && styles.topicChipSelected]} 
                    onPress={() => {
                      let temp = JSON.parse(JSON.stringify(topics))
                      if (!topic[3]) {
                        temp[index][1] = '#8485E1'
                        temp[index][2] = 'white'
                        temp[index][3] = true
                      } else {
                        temp[index][1] = 'white'
                        temp[index][2] = 'black'
                        temp[index][3] = false
                      }
                      setSelected(temp)
                    }}
                  >
                    <Text style={[styles.topicText, topic[3] && styles.topicTextSelected]}>
                      {topic[0]}
                    </Text>
                    {!topic[3] && (
                      <View style={styles.plusIcon}>
                        <Text style={styles.plusText}>+</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Create Account</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableWithoutFeedback onPress={() => navigation.replace("Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    paddingTop: 40,
    paddingBottom: 30,
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
  topicsSection: {
    marginBottom: 32,
  },
  topicsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  topicsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicChip: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topicChipSelected: {
    backgroundColor: '#8485E1',
    borderColor: '#8485E1',
  },
  topicText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  topicTextSelected: {
    color: 'white',
  },
  plusIcon: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8485E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signUpButton: {
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#3366CC',
    fontWeight: '600',
  },
})

