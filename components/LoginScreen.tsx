import React, { useState } from 'react'
import { StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import { Text, View } from './Themed'
import Login from './Login'
import Register from './Register'
import useKeyboardShowing from '../hooks/useKeyboardShowing'

const windowHeight = Dimensions.get('window').height

export default function EditScreenInfo() {
  const keyboardShowing = useKeyboardShowing()
  const [signupMode, setSignupMode] = useState(false)

  return (
    <View style={styles.loginContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={keyboardShowing && styles.keyboardVisible}
      >
        {!signupMode ?
          <Login keyboardShowing={keyboardShowing} />
          :
          <Register keyboardShowing={keyboardShowing} setSignUpMode={setSignupMode} />
        }
      </KeyboardAvoidingView>
      {!signupMode && <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>No account yet?
          <Pressable onPress={() => setSignupMode(true)}>
            <Text
              style={styles.signUpLink}
              testID="signUpLink"
            >
              {' '}
              Sign up
            </Text>
          </Pressable>
        </Text>
      </View>}
    </View >
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
})
