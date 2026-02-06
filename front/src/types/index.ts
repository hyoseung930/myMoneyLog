export interface User {
  id: string
  username: string
  nickname: string
}

export interface StoredUser extends User {
  password: string
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message?: string
}

export interface Transaction {
  id: string
  date: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  accountId: string
}

export interface Account {
  id: string
  name: string
  type: string
  balance: number
}
