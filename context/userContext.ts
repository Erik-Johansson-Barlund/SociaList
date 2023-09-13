import { createContext } from 'react'

export type ItemType = {
  added: number
  item: string
  uid: string
};

export type InviteType = {
  fromName: string
  group: string
}

export type UserContextType = {
  email: string
  userName: string
  myGroup: { [key: string]: string }
  myList: ItemType[];
  myInvites: InviteType[];
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  registerUser: (email: string, password: string, userName: string) => Promise<boolean>
  uploadItems: (items: string) => Promise<void>
  deleteItems: (itemsToDelete: ItemType[]) => Promise<void>
  searchUserByEmail: (email: string) => Promise<any>
  createInvite: (uid: string) => Promise<void>
  rejectInvite: (invite: InviteType) => Promise<void>
  acceptInvite: (invite: InviteType) => Promise<void>
}

const UserContext = createContext<UserContextType>({
  email: '',
  userName: '',
  myGroup: {},
  myList: [],
  myInvites: [],
  login: async () => false,
  logout: async () => { },
  registerUser: async () => false,
  uploadItems: async () => { },
  deleteItems: async () => { },
  searchUserByEmail: async () => { },
  createInvite: async () => { },
  rejectInvite: async () => { },
  acceptInvite: async () => { },
})

export default UserContext
