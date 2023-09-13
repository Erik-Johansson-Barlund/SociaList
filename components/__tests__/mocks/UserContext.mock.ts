import { UserContextType } from '../../../context/userContext'

const UserContextMock: UserContextType = {
  email: 'erik163@gmail.com',
  userName: 'Erik',
  myGroup: {},
  myList: [],
  myInvites: [],
  login: jest.fn(),
  logout: jest.fn(),
  registerUser: jest.fn(),
  uploadItems: jest.fn(),
  deleteItems: jest.fn(),
  searchUserByEmail: jest.fn(),
  createInvite: jest.fn(),
  rejectInvite: jest.fn(),
  acceptInvite: jest.fn(),
}

export default UserContextMock
