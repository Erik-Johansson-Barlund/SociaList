import React from 'react'
import { TextInput, useColorScheme } from 'react-native'

type PropType = {
  placeholder?: string
  value?: string
  onChangeText?: (textInput: string) => void
  style?: { [key: string]: string | number }
  secureTextEntry?: boolean
  testID?: string
};

function StyledTextInput(props: PropType) {
  const { placeholder, value, onChangeText, secureTextEntry, style, testID } = props
  const theme = useColorScheme() || 'light'
  const color = theme === 'dark' ? 'rgb(225, 225, 225)' : 'rgb(50, 50, 50)'
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[{ color }, style]}
      secureTextEntry={secureTextEntry}
      testID={testID}
    />
  )
}

export default StyledTextInput