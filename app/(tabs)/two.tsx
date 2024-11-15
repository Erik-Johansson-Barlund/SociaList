import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import AccountTab from '../../components/account/AccountTab'

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <AccountTab />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
