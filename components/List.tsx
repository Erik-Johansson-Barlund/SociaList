import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Pressable, ScrollView, Dimensions, Keyboard, TextInput, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { Text, View } from './Themed'
import UserContext, { ItemType } from '../context/userContext'
import * as Haptics from 'expo-haptics'
import useKeyboardShowing from '../hooks/useKeyboardShowing'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default function List() {
  const { myList, deleteItems, uploadItems } = useContext(UserContext)
  const [selectedItems, setSelectedItems] = useState<ItemType[]>([])
  const [inputColor, setInputColor] = useState('rgb(225, 225, 225)')
  const [inputBackground, setInputBackground] = useState('rgb(46, 59, 64)')
  const [itemText, setItemText] = useState('')
  const [inputMode, setInputMode] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const keyboardShowing = useKeyboardShowing()

  const theme = useColorScheme() || 'light'

  useEffect(() => {
    setInputColor(theme === 'dark' ? 'rgb(225, 225, 225)' : 'rgb(50, 50, 50)')
    setInputBackground(theme === 'dark' ? 'rgb(46, 59, 64)' : 'rgb(239, 237, 237)')
  }, [theme])
  useEffect(() => {
    if (!keyboardShowing) {
      setInputMode(false)
    }
  }, [keyboardShowing])

  const addItem = () => {
    Haptics.selectionAsync()
    uploadItems(itemText)
    setItemText('')
    Keyboard.dismiss()
  }

  const removeItems = async () => {
    Haptics.selectionAsync()
    await deleteItems(selectedItems)
    setSelectedItems([])
  }

  const selectItem = (item: ItemType): void => {
    Haptics.selectionAsync()
    setSelectedItems((items: ItemType[]) => {
      if (items.find(x => x.uid === item.uid)) {
        return items.filter(x => x.uid !== item.uid)
      }
      return [...items, item]
    })
  }

  const startInput = () => {
    Haptics.selectionAsync()
    setInputMode(true)
    inputRef?.current?.focus()
  }

  const filteredToday = useMemo(() => myList?.filter((listItem) => {
    const startOfToday = new Date().setUTCHours(0, 0, 0, 0)
    return listItem.added > startOfToday
  }), [myList])

  const filteredYesterday = useMemo(() => myList?.filter((listItem) => {
    const startOfToday = new Date()
    const startOfYesterday = new Date()
    startOfYesterday.setDate(startOfToday.getDate() - 1)
    startOfToday.setUTCHours(0, 0, 0, 0)
    startOfYesterday.setUTCHours(0, 0, 0, 0)
    const todayInMs = startOfToday.getTime()
    const yesterdayInMs = startOfYesterday.getTime()
    return (listItem.added > yesterdayInMs) && (listItem.added < todayInMs)
  }), [myList])

  const filteredOlder = useMemo(() => myList?.filter((listItem) => {
    const startOfYesterday = new Date()
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setUTCHours(0, 0, 0, 0)
    const yesterdayInMs = startOfYesterday.getTime()
    return listItem.added <= yesterdayInMs
  }), [myList])


  const isSelected = (item: ItemType) => selectedItems.find((selectedItem: ItemType) => item.uid === selectedItem.uid)

  const subSection = (listItem: ItemType) => (
    <Pressable
      key={listItem.uid}
      style={styles.pressableArea}
      onPress={() => selectItem(listItem)}
    >
      {!isSelected(listItem) ?
        <MaterialCommunityIcons
          style={styles.basketIcon}
          name="basket-plus-outline"
          size={28}
          color="rgb(127, 123, 123)"
        /> :
        <AntDesign style={styles.basketIcon} name="check" size={28} color="green" />}
      <Text style={isSelected(listItem) ? styles.stricken : styles.itemText}>
        {listItem.item}
      </Text>

    </Pressable>
  )

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.cartContainer}>
          <>
            <Text
              style={styles.dayHeadline}
              lightColor="rgba(0,0,0,0.8)"
              darkColor="rgba(255,255,255,0.8)">
              Added today
            </Text>
            {filteredToday?.length > 0 ? filteredToday.map((listItem) => (
              subSection(listItem)
            )) : <Text>Nothing added yet</Text>}
            <Text
              style={styles.dayHeadline}
              lightColor="rgba(0,0,0,0.8)"
              darkColor="rgba(255,255,255,0.8)">
              Added yesterday
            </Text>
            {filteredYesterday?.length > 0 ? filteredYesterday.map((listItem) => (
              subSection(listItem)
            )) : <Text>Nothing added yesterday</Text>}
            <Text
              style={styles.dayHeadline}
              lightColor="rgba(0,0,0,0.8)"
              darkColor="rgba(255,255,255,0.8)">
              Older items
            </Text>
            {filteredOlder?.length > 0 ? filteredOlder.map((listItem) => (
              subSection(listItem)
            )) : <Text>Nothing to display</Text>}
          </>
          <View style={{ height: myList.length * 12 }} />
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        {selectedItems.length > 0 && !keyboardShowing &&
          <Pressable style={styles.deleteButton} onPress={removeItems}>
            <View style={styles.deleteButtonBackground}>
              <AntDesign name="minus" size={34} color="white" />
            </View>
          </Pressable>
        }
        <Pressable
          style={inputMode ? styles.addButtonKeyboard : styles.addButton}
          onPress={inputMode ? addItem : startInput}
        >
          <View style={styles.addButtonBackground}>
            <AntDesign name="plus" size={34} color="white" />
          </View>
        </Pressable>
        <TextInput
          ref={inputRef}
          placeholder="Add item to list"
          value={itemText}
          onChangeText={(newText) => setItemText(newText)}
          style={[
            { color: inputColor, backgroundColor: inputBackground },
            inputMode ? styles.textInput : styles.hiddenInput
          ]}
        />
      </KeyboardAvoidingView >
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  cartContainer: {
    alignItems: 'flex-start',
    marginHorizontal: 10,
    height: '100%',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  dayHeadline: {
    fontSize: 44,
    lineHeight: 50,
    paddingHorizontal: 20,
    marginTop: 25,
    marginLeft: -25,
    backgroundColor: 'rgba(58, 209, 154, 0.53)',
  },
  pressableArea: {
    flexDirection: 'row',
    gap: 10,
  },
  itemText: {
    fontSize: 30,
    lineHeight: 44,
    textAlign: 'left',
  },
  stricken: {
    fontSize: 30,
    lineHeight: 44,
    textAlign: 'left',
    color: 'gray',
    textDecorationLine: 'line-through',
  },
  basketIcon: {
    marginTop: 7,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  addButton: {
    position: 'sticky',
    bottom: 15,
    left: '80%',
    zIndex: 100,
    width: 60,
    height: 60,
  },
  addButtonKeyboard: {
    position: 'sticky',
    bottom: -55,
    left: '80%',
    zIndex: 100,
    width: 60,
    height: 60,
  },
  addButtonBackground: {
    backgroundColor: 'green',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'sticky',
    bottom: 30,
    left: '80%',
    zIndex: 100,
    width: 60,
    height: 60,
  },
  deleteButtonBackground: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 30,
    width: windowWidth * 0.88,
    marginBottom: windowHeight * 0.12,
    paddingVertical: 7,
    paddingLeft: 5,
    shadowColor: '#807d7d',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },
  hiddenInput: {
    display: 'none',
  },
  keyboardContainer: {
    marginTop: -150,
    paddingTop: 0,
  },
})