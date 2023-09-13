import React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logoText}
        source={require('../assets/images/logoText.png')}
      />
      <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/images/welcomeScreen.jpg')}
        resizeMode="cover"
      >
        <View style={styles.imageContainer}>
          <Text style={styles.tagline}>
            Manage your shopping, share your list.
          </Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9dcded9'
  },
  imageContainer: {
    height: windowHeight * 0.5,
    width: windowWidth,
    alignItems: 'center',
  },
  imageBackground: {
    position: 'absolute',
    bottom: 0,
  },
  tagline: {
    marginTop: -10,
    fontSize: 20,
  },
  logoText: {
    width: 350,
    height: 110,
    marginTop: -150,
    zIndex: 200,
  },
})