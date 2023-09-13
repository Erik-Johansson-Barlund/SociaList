import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Pressable, Keyboard } from 'react-native'
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { Text, View } from './Themed'
import UserContext from '../context/userContext'
import * as Haptics from 'expo-haptics'
import * as Progress from 'react-native-progress'
import StyledTextInput from './StyledTextInput'

const windowWidth = Dimensions.get('window').width
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

function Register({ keyboardShowing, setSignUpMode }: { keyboardShowing: boolean, setSignUpMode: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const [emailText, setEmailText] = useState('')
  const [userName, setUserName] = useState('')
  const [passwordText, setPasswordText] = useState('')
  const [passwordConfirmText, setPasswordConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [userNameError, setUserNameError] = useState(false)
  const [passwordConfirmError, setPasswordConfirmError] = useState(false)
  const [, setErrorMessage] = useState('')

  const { registerUser } = useContext(UserContext)

  useEffect(() => {
    if (keyboardShowing) {
      setErrorMessage('')
    }
  }, [keyboardShowing])

  const startRegister = async () => {
    Haptics.selectionAsync()
    Keyboard.dismiss()

    setLoading(true)
    setErrorMessage('')
    setEmailError(false)
    setPasswordError(false)
    setPasswordConfirmError(false)
    setUserNameError(false)

    if (!emailRegex.test(emailText)) {
      setEmailError(true)
      setLoading(false)
      return
    }

    if (!userName.trim()) {
      setUserNameError(true)
      setLoading(false)
      return
    }

    if (passwordText.trim().length < 6) {
      setPasswordError(true)
      setLoading(false)
      setPasswordText('')
      setPasswordConfirmText('')
      return
    }

    if (passwordConfirmText !== passwordText) {
      setPasswordConfirmError(true)
      setLoading(false)
      setPasswordConfirmText('')
      return
    }

    const registerSuccess = await registerUser(emailText, passwordText, userName)
    if (!registerSuccess) {
      setErrorMessage('Something went wrong, please try again')
      setEmailText('')
      setPasswordText('')
      setPasswordConfirmText('')
      setUserName('')
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
          Create account
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
            onChangeText={(newText) => setEmailText(newText)}
            style={styles.textInput}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome5
          name="user-circle"
          size={24}
          color={userNameError ? 'rgb(211, 44, 44)' : 'rgb(106, 103, 103)'}
        />
        <View>
          <StyledTextInput
            placeholder="Display name"
            value={userName}
            onChangeText={(newText) => setUserName(newText)}
            style={styles.textInput}
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
            placeholder="Password, min 6 characters"
            secureTextEntry={true}
            value={passwordText}
            onChangeText={(newText) => setPasswordText(newText)}
            style={styles.textInput}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="account-lock-outline"
          size={30}
          color={passwordConfirmError ? 'rgb(211, 44, 44)' : 'rgb(106, 103, 103)'}
        />
        <View>
          <StyledTextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={passwordConfirmText}
            onChangeText={(newText) => setPasswordConfirmText(newText)}
            style={styles.textInput}
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Pressable onPress={() => setSignUpMode(false)}>
          <Ionicons style={styles.backIcon} name="arrow-back-circle-outline" size={50} color="rgb(106, 103, 103)" />
        </Pressable>
        <Pressable onPress={startRegister}>
          <View style={styles.loginButton}>
            {!loading ? (
              <Text style={styles.loginButtonText}>
                Register
              </Text>
            ) : (
              <Progress.Circle size={40} indeterminate={true} />
            )}
          </View>
        </Pressable>
      </View>
    </>
  )
}

export default Register

const styles = StyleSheet.create({
  loginText: {
    fontSize: 36,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    paddingLeft: 5,
    marginTop: 20,
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
    marginTop: 20,
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
    marginTop: 15,
  },
  backIcon: {
    // marginTop: 10,
  },
})
