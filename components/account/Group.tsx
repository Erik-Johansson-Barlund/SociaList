import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Keyboard, Pressable, StyleSheet } from 'react-native'
import { Text, View } from '../Themed'
import UserContext from '../../context/userContext'
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import StyledTextInput from '../StyledTextInput'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

const windowWidth = Dimensions.get('window').width
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

function Group() {
  const [searchText, setSearchText] = useState('')
  const [message, setMessage] = useState('')
  const [foundUser, setFoundUser] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>>()
  const { myGroup, searchUserByEmail, createInvite, email } = useContext(UserContext)

  useEffect(() => {
    const doQuery = async () => {
      if (searchText === email) {
        setMessage('you cannot be in a group with yourself')
        setSearchText('')

        setTimeout(() => {
          setMessage('')
        }, 5000)

        return
      }
      const matchingUser = await searchUserByEmail(searchText)
      if (matchingUser) {
        setFoundUser(matchingUser)
      }
    }
    if (emailRegex.test(searchText)) {
      doQuery()
    }
  }, [searchText])

  useEffect(() => {
    Keyboard.dismiss()
  }, [foundUser])

  const handleSendInvite = () => {
    if (!foundUser) {
      return
    }

    const uid = foundUser?.id

    createInvite(uid)

    setMessage(`Invite sent to ${foundUser.data().userName}`)
    setFoundUser(undefined)
    setSearchText('')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const clearFoundUser = () => {
    setFoundUser(undefined)
    setSearchText('')
  }

  return (
    <View style={styles.groupContainer}>
      <View style={styles.border}>
        <Text style={styles.heading}>Your group:</Text>
        {Object.keys(myGroup).length <= 1 ? (
          <Text>There is no one but you in your group yet. You can add people to your group by inviting them</Text>
        ) : (
          <>
            {Object.entries(myGroup).map(([key, member]) => <Text key={key}>{member}</Text>)}
          </>
        )}
      </View>
      <View style={styles.border}>
        <Text style={styles.heading}>Add new user</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={28}
            color="rgb(106, 103, 103)"
          />
          <View>
            <StyledTextInput
              placeholder="Search for user by email"
              value={searchText}
              onChangeText={(newText) => setSearchText(newText)}
              style={styles.textInput}
            />
          </View>
        </View>

        {foundUser && (
          <View style={styles.foundUserContainer}>
            <FontAwesome name="user-circle-o" size={34} color="rgb(148, 146, 146)" />
            <Text style={styles.foundUserText}> Invite user: <Text style={styles.innerText}>{foundUser?.data().userName}</Text></Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.button}
                onPress={handleSendInvite}
              >
                <View style={styles.addButtonBackground}>
                  <AntDesign name="plus" size={34} color="white" />
                </View>
              </Pressable>
              <Pressable style={styles.button} onPress={clearFoundUser}>
                <View style={styles.deleteButtonBackground}>
                  <AntDesign name="minus" size={34} color="white" />
                </View>
              </Pressable>
            </View>
          </View>
        )}
        {message && <Text style={styles.messageText}>{message}</Text>}
      </View>
    </View >
  )
}

export default Group

const styles = StyleSheet.create({
  groupContainer: {
    borderTopColor: 'white',
    borderTop: 1,
    paddingLeft: 20,
    marginTop: 20,
  },
  border: {
    borderLeftColor: 'rgb(0, 0, 0)',
    borderLeftWidth: 2,
    paddingLeft: 5,
    marginBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    paddingLeft: 5,
    marginTop: 10,
    width: windowWidth * 0.88,
    height: 40,
    borderRadius: 5,
    shadowColor: '#807d7d',
    shadowOffset: { width: -3, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  textInput: {
    fontSize: 22,
    width: windowWidth * 0.69,
    flexShrink: 0,
  },
  foundUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'black',
    marginTop: 10,
    borderWidth: 1,
    marginRight: 20,
    padding: 5,
  },
  foundUserText: {
    fontSize: 20,
  },
  innerText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 10,
  },
  button: {
    zIndex: 100,
    width: 40,
    height: 40,
  },
  addButtonBackground: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonBackground: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    paddingTop: 5,
    paddingLeft: 2,
  },
})