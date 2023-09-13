/* eslint-disable no-console */
import { useState, useMemo, useEffect } from 'react'
import UserContext, { InviteType, ItemType, UserContextType } from './userContext'
import app from '../firebase/firebaseConfig'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  Auth,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  DocumentData,
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot
} from 'firebase/firestore'

/**
 * Sets up an auth session with persistence across app reloads
 */
let auth: Auth
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  })
} catch (error) {

  console.log('auth already initialized')
}

/**
 * User context provider, stores values derived from firebase
 */
export default function UserProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [uid, setUid] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [groupId, setGroupId] = useState('')
  const [myGroup, setMyGroup] = useState<DocumentData>({})
  const [myList, setMyList] = useState<ItemType[]>([])
  const [myInvites, setMyInvites] = useState<InviteType[]>([])
  const firestoreDB = getFirestore(app)

  /**
   * Sets up a listener to act on any Auth state change & update the context state accordingly
   */
  useEffect(() => {
    onAuthStateChanged(auth, async (user): Promise<void> => {
      if (!user) {
        setUserName('')
        setEmail('')
        setUid('')
        setGroupId('')
        setMyGroup({})
        setMyList([])
        setMyInvites([])
        return
      }
      const docRef = doc(firestoreDB, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        return
      }
      const userData = docSnap.data()
      setUserName(userData.userName as string)
      setEmail(user.email as string)
      setUid(user.uid)
      setGroupId(userData.group)
    })
  }, [auth])

  useEffect(() => {
    if (groupId) {
      /**
       * Set up a listener to listen to changes in group and update state on them
       */
      onSnapshot(doc(firestoreDB, 'users', uid), (doc) => {
        setGroupId(doc.data()?.group)
      })
      /**
       * Set up a listener to listen to changes in group and update state on them
       */
      onSnapshot(doc(firestoreDB, 'groups', groupId), (doc) => {
        setMyGroup(doc.data() || {})
      })

      /**
       * Set up a listener to listen to changes in the shoppingList and update state on them
       */
      onSnapshot(doc(firestoreDB, 'shoppingLists', groupId), (doc) => {
        setMyList(doc?.data()?.items)
      })

      /**
       * Set up a listener to listen to changes in the invites and update state on them
       */
      onSnapshot(doc(firestoreDB, 'invites', uid), (doc) => {
        if (doc.id === uid) {
          setMyInvites(doc?.data()?.invites)
        }
      })
    }
  }, [groupId])

  /**
   * Logs in a user
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.log('Error getting user: ', error)
      return false
    }
  }

  /**
   * Registers a new user and sets up neccessary DB collections
   */
  const registerUser = async (email: string, password: string, userName: string): Promise<boolean> => {
    try {
      // creates a new user in auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      // setup a new group that the new user belongs to
      const groupUid = uuid()
      await setDoc(doc(firestoreDB, 'groups', groupUid), {
        [userCredential.user.uid]: userName,
      })
      // finally sets up the userDoc
      await setDoc(doc(firestoreDB, 'users', userCredential.user.uid), {
        userName: userName,
        email,
        group: groupUid,
      })
      // need to log out to trigger state change, has something to do with the auth listener
      // think it is because we "log in" when new user is created which triggers auth listener
      // but we have yet to set up all the db collections and so the auth logic returns early
      // we need to trigger it again.
      await logout()
      await login(email, password)
      return true
    } catch (error) {
      console.log('did not go as planned: ', error)
      return false
    }
  }

  /**
   * Logs out the user
   */
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.log('something went wrong on logout ', error)
    }
  }

  /**
   * Saves new items to DB collection
   */
  const uploadItems = async (item: string) => {
    const newItemDoc = {
      added: new Date().getTime(),
      item,
      uid: uuid(),
    }

    const docRef = doc(firestoreDB, 'shoppingLists', groupId)
    const docSnap = await getDoc(docRef)
    try {
      if (docSnap.exists()) {
        await updateDoc(doc(firestoreDB, 'shoppingLists', groupId), {
          items: [
            ...docSnap.data().items,
            newItemDoc,
          ]
        })
      } else {
        await setDoc(doc(firestoreDB, 'shoppingLists', groupId), {
          items: [
            newItemDoc,
          ]
        })
      }
    } catch (error) {
      console.log('Something went wrong when uploading item ', error)
    }
  }

  /**
   * Removes items from DB collection
   */
  const deleteItems = async (itemsToDelete: ItemType[]) => {
    const docRef = doc(firestoreDB, 'shoppingLists', groupId)
    const docSnap = await getDoc(docRef)
    try {
      if (docSnap.exists()) {
        const newDocs = docSnap.data().items.filter((doc: ItemType) => !itemsToDelete.find((item) => item.uid === doc.uid))
        await setDoc(doc(firestoreDB, 'shoppingLists', groupId), {
          items: [
            ...newDocs,
          ]
        })
      }
    } catch (error) {
      console.log('Something went wrong when deleting an item ', error)
    }
  }

  /**
   * Searches the "users" collection for matches on given email, returns found userDoc
   */
  const searchUserByEmail = async (email: string) => {
    const usersRef = collection(firestoreDB, 'users')
    const matchingUser = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(matchingUser)
    const matchingDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = []

    querySnapshot.forEach((doc) => {
      if (doc.id) {
        matchingDocs.push(doc)
      }
    })
    // [0] should be safe as we should only ever have 1 user with matching email
    if (!matchingDocs[0]) {
      return null
    }
    return matchingDocs[0]
  }

  /**
   * Creates a new invite object
   */
  const createInvite = async (toUid: string) => {
    const docRef = doc(firestoreDB, 'invites', toUid)
    const docSnap = await getDoc(docRef)
    try {
      if (docSnap.exists()) {
        const newDocs = docSnap.data().invites
        await updateDoc(doc(firestoreDB, 'invites', toUid), {
          invites: [
            ...newDocs, { fromName: userName, group: groupId }
          ]
        })
      } else {
        await setDoc(doc(firestoreDB, 'invites', toUid), {
          invites: [
            { fromName: userName, group: groupId },
          ]
        })
      }
    } catch (error) {
      console.log('Something went wrong when creating new invite ', error)
    }
  }

  /**
   * Removes an invite object
   */
  const rejectInvite = async (invite: InviteType): Promise<void> => {
    const docRef = doc(firestoreDB, 'invites', uid)
    const docSnap = await getDoc(docRef)
    try {
      if (docSnap.exists()) {
        const newDocs = docSnap.data().invites.filter((doc: InviteType) => invite.fromName !== doc.fromName && invite.group !== doc.group)
        await setDoc(doc(firestoreDB, 'invites', uid), {
          invites: [
            ...newDocs,
          ]
        })
      }
    } catch (error) {
      console.log('Something went wrong when deleting an invitation ', error)
    }
  }

  /**
   * Handles the flow for accepting an invite (not my proudest moment)
   */
  const acceptInvite = async (invite: InviteType): Promise<void> => {
    try {
      const usersInCurrentGroup = Object.keys(myGroup).length
      const oldGroupDocRef = doc(firestoreDB, 'groups', groupId)
      const oldGroupDocSnap = await getDoc(oldGroupDocRef)
      const { group } = invite // the new groupId
      const oldGroupId = groupId

      await updateDoc(doc(firestoreDB, 'users', uid), { userName, group })

      // First we handle the current group
      if (usersInCurrentGroup > 1) {
        // if more than one user in a group we delete the user from the group
        const oldGroupDocs = oldGroupDocSnap.data()!
        delete oldGroupDocs[uid]

        await setDoc(doc(firestoreDB, 'groups', oldGroupId), oldGroupDocs)
      } else {
        // only 1 user in group, might as well delete the group
        await deleteDoc(doc(firestoreDB, 'groups', oldGroupId))

        // If only one user in group we should also delete the itemList
        await deleteDoc(doc(firestoreDB, 'shoppingLists', oldGroupId))
      }

      // We then add the user to the new group  

      const newGroupDocRef = doc(firestoreDB, 'groups', group)
      const newGroupDocSnap = await getDoc(newGroupDocRef)
      const newGroupDocs = newGroupDocSnap.data()!
      newGroupDocs[uid] = userName

      await updateDoc(doc(firestoreDB, 'groups', group), newGroupDocs)

      // Finally we remove the invite
      await rejectInvite(invite)
    } catch (error) {
      console.log('Something went horribly wrong while updating groups: ', error)
    }
  }

  const api: UserContextType = useMemo((): UserContextType => ({
    email,
    userName,
    myGroup,
    myList,
    myInvites,
    login,
    logout,
    registerUser,
    uploadItems,
    deleteItems,
    createInvite,
    rejectInvite,
    acceptInvite,
    searchUserByEmail,
  }), [uid, userName, email, myGroup, myList, myInvites])

  return (
    <UserContext.Provider value={api}>
      {children}
    </UserContext.Provider>
  )
}
