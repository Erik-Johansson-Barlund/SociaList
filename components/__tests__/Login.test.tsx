import { render, screen, userEvent } from '@testing-library/react-native'
import UserContext from '../../context/userContext'
import UserContextMock from './mocks/UserContext.mock'
import Login from '../Login'

describe('Login', () => {
  it('Clicking the login button without providing information does not trigger the login flow', async () => {
    // Arrange
    expect.assertions(1)

    const loginMock = jest.fn()
    render(
      <UserContext.Provider value={{
        ...UserContextMock,
        login: loginMock,
      }}>
        <Login keyboardShowing={false} />
      </UserContext.Provider>
    )

    // Act
    const loginButton = screen.getByTestId('loginButton')

    await userEvent.press(loginButton)

    // Assert
    expect(loginMock).toHaveBeenCalledTimes(0)
  })

  it('Clicking the login button with wrong email format does not trigger the login flow', async () => {
    // Arrange
    expect.assertions(1)

    const loginMock = jest.fn()
    render(
      <UserContext.Provider value={{
        ...UserContextMock,
        login: loginMock,
      }}>
        <Login keyboardShowing={false} />
      </UserContext.Provider>
    )

    // Act
    const userNameInput = screen.getByTestId('userNameInput')
    const passwordInput = screen.getByTestId('passwordInput')
    const loginButton = screen.getByTestId('loginButton')

    await userEvent.type(userNameInput, 'notAnEmail')
    await userEvent.type(passwordInput, 'testpassword')
    await userEvent.press(loginButton)

    // Assert
    expect(loginMock).toHaveBeenCalledTimes(0)
  })

  it('Clicking the login button with correct inputs triggers the login flow', async () => {
    // Arrange
    expect.assertions(1)

    const loginMock = jest.fn()
    render(
      <UserContext.Provider value={{
        ...UserContextMock,
        login: loginMock,
      }}>
        <Login keyboardShowing={false} />
      </UserContext.Provider>
    )

    // Act
    const userNameInput = screen.getByTestId('userNameInput')
    const passwordInput = screen.getByTestId('passwordInput')
    const loginButton = screen.getByTestId('loginButton')

    await userEvent.type(userNameInput, 'test@test.se')
    await userEvent.type(passwordInput, 'testpassword')
    await userEvent.press(loginButton)

    // Assert
    expect(loginMock).toHaveBeenCalledTimes(1)
  })
})