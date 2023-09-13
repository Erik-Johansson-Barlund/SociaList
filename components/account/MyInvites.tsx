import React, { useContext } from 'react'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { Text, View } from '../Themed'
import UserContext, { InviteType } from '../../context/userContext'
import { AntDesign, FontAwesome } from '@expo/vector-icons'

function Group() {
  const { myInvites, rejectInvite, acceptInvite } = useContext(UserContext)

  const acceptInvitePrompt = async (invite: InviteType) => {
    Alert.alert('You are about to join a group', 'Joining a new group means you discard your current shopping list and become co owner of the new one, You will not be able to undo this', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Proceed', onPress: () => acceptInvite(invite) },
    ])
  }

  return (
    <View style={styles.groupContainer}>
      <View style={styles.border}>
        <Text style={styles.heading}>Invites for you:</Text>
        {!myInvites?.length ? (
          <Text>Nothing to display here yet</Text>
        ) : (
          <>
            {myInvites.map((invite) => (
              <View key={invite.group} style={styles.foundUserContainer}>
                <FontAwesome name="user-circle-o" size={34} color="rgb(148, 146, 146)" />
                <View>
                  <Text style={styles.innerText}>{invite.fromName}</Text>
                  <Text>has sent you an invite, accept?</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={styles.button}
                    onPress={() => acceptInvitePrompt(invite)}
                  >
                    <View style={styles.addButtonBackground}>
                      <AntDesign name="plus" size={34} color="white" />
                    </View>
                  </Pressable>
                  <Pressable style={styles.button} onPress={() => rejectInvite(invite)}>
                    <View style={styles.deleteButtonBackground}>
                      <AntDesign name="minus" size={34} color="white" />
                    </View>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}
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
  foundUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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
})