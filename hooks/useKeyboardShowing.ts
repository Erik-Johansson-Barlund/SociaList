import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

function useKeyboardShowing() {
  const [keyboardShowing, setKeyboardShowing] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardShowing(true)
    })
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardShowing(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return keyboardShowing
}

export default useKeyboardShowing