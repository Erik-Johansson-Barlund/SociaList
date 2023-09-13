import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Pressable, Keyboard } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, View } from './Themed'
import UserContext from '../context/userContext'
import * as Haptics from 'expo-haptics'
import * as Progress from 'react-native-progress'
import StyledTextInput from './StyledTextInput'

const windowWidth = Dimensions.get('window').width
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

function Login({ keyboardShowing }: { keyboardShowing: boolean }): JSX.Element {
  const [emailText, setEmailText] = useState('')
  const [passwordText, setPasswordText] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(UserContext)

  useEffect(() => {
    if (keyboardShowing) {
      setErrorMessage('')
    }
  }, [keyboardShowing])

  const startLogin = async () => {
    setLoading(true)
    Haptics.selectionAsync()
    Keyboard.dismiss()

    setErrorMessage('')
    setEmailError(false)
    setPasswordError(false)

    if (!emailRegex.test(emailText)) {
      setEmailError(true)
      setLoading(false)
      return
    }

    if (!passwordText.trim()) {
      setPasswordError(true)
      setLoading(false)
      return
    }

    const loggedInStatus = await login(emailText, passwordText)

    if (loggedInStatus === false) {
      setErrorMessage('No user with that email/password found')
      setEmailText('')
      setPasswordText('')
    }

    setLoading(false)
  }

  return (
    <>
      <View>
        <Text
          style={styles.loginText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          LOGIN
        </Text>
        <Text
          style={styles.loginSubText}
          lightColor="rgba(0,0,0,0.5)"
          darkColor="rgba(255,255,255,0.5)">
          Please sign in to continue.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="email-outline"
          size={28}
          color={emailError ? 'rgb(211, 44, 44)' : 'rgb(106, 103, 103)'}
        />
        <View>
          <StyledTextInput
            placeholder="Email"
            value={emailText}
            onChangeText={(newText: string) => setEmailText(newText)}
            style={styles.textInput}
            testID="userNameInput"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="account-lock-outline"
          size={30}
          color={passwordError ? 'rgb(211, 44, 44)' : 'rgb(106, 103, 103)'}
        />
        <View>
          <StyledTextInput
            placeholder="Password"
            testID="passwordInput"
            secureTextEntry={true}
            value={passwordText}
            onChangeText={(newText: string) => setPasswordText(newText)}
            style={styles.textInput}
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Pressable onPress={startLogin}>
        <View style={styles.loginButton} testID='loginButton'>
          {!loading ? (
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          ) : (
            <Progress.Circle size={40} indeterminate={true} />
          )}
        </View>
      </Pressable>
    </>
  )
}

export default Login

const styles = StyleSheet.create({
  loginText: {
    fontSize: 40,
  },

  loginSubText: {
    fontSize: 27,
    lineHeight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    paddingLeft: 5,
    marginTop: 30,
    width: windowWidth * 0.8,
    height: 60,
    borderRadius: 5,
    shadowColor: '#807d7d',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },
  textInput: {
    fontSize: 22,
    width: windowWidth * 0.69,
    flexShrink: 0,
  },
  loginButton: {
    marginRight: 0,
    marginLeft: 'auto',
    marginTop: 30,
    backgroundColor: '#131212',
    width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#807d7d',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },
  loginButtonText: {
    fontSize: 24,
    color: 'white',
  },
  keyboardVisible: {
    marginBottom: 150,
  },
  signUpContainer: {
    position: 'absolute',
    bottom: 80,
  },
  signUpText: {
    fontSize: 24,
    color: 'rgb(106, 103, 103)',
  },
  signUpLink: {
    fontSize: 24,
    color: 'rgb(210, 154, 32)',
    marginBottom: -3,
  },
  errorMessage: {
    marginTop: 8,
    marginBottom: -8,
    color: 'red',
  },
})
