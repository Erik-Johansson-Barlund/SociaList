import { render, screen, userEvent } from '@testing-library/react-native'
import LoginScreen from '../LoginScreen'

describe('StyledText', () => {
  it('Clicking the signup link switches view from login to register', async () => {
    // Arrange & Act
    expect.assertions(4)

    render(<LoginScreen />)

    let loginHeader = screen.queryByText('LOGIN')
    let signUpHeader = screen.queryByText('Create account')
    const signUpLink = screen.getByTestId('signUpLink')

    // Assert
    expect(loginHeader).toBeDefined()
    expect(signUpHeader).toBeNull()

    // Act
    await userEvent.press(signUpLink)

    loginHeader = screen.queryByText('LOGIN')
    signUpHeader = screen.queryByText('Create account')

    // Assert
    expect(loginHeader).toBeNull()
    expect(signUpHeader).toBeDefined()
  })
})