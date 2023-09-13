import React, { useContext } from 'react'
import { StyleSheet, Dimensions, Pressable } from 'react-native'
import { Text, View } from '../Themed'
import { FontAwesome } from '@expo/vector-icons'
import UserContext from '../../context/userContext'
import Group from './Group'
import MyInvites from './MyInvites'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

function AccountTab() {
  const { userName, email, logout } = useContext(UserContext)
  return (
    <View style={styles.mainContainer}>
      <View style={styles.accountInfo}>
        <FontAwesome name="user-circle-o" size={64} color="rgb(69, 65, 65)" />
        <View style={styles.accountInfoTextContainer}>
          <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
            style={styles.accountInfoParagraph}
          >Account info</Text>
          <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
          >
            Display name: {userName}
          </Text>
          <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
          >
            Email:
          </Text>
          <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
          >
            {email}
          </Text>
        </View>
        <Pressable onPress={logout}>
          <View
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(194, 187, 187, 0.8)"
            style={styles.logoutButton}>
            <Text
              lightColor="rgba(255, 255, 255, 0.8)"
              darkColor="rgba(0, 0, 0, 0.8)"
              style={styles.logoutButtonText}>
              Logout
            </Text>
          </View>
        </Pressable>
      </View>
      <Group />
      <MyInvites />
    </View>
  )
}

export default AccountTab

const styles = StyleSheet.create({
  mainContainer: {
    height: windowHeight * 0.8,
    width: windowWidth,
    justifyContent: 'flex-start',
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  accountInfoTextContainer: {
    flexGrow: 2,
  },
  accountInfoParagraph: {
    fontWeight: 'bold',
    lineHeight: 20,
  },
  logoutButton: {
    width: 90,
    height: 50,
    marginTop: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 22,
  },
})