import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface SignupRequest {
  username: string;
  nickname: string;
  password: string;
  encryptedMasterKeyByPassword: string;
  passwordSalt: string;
  encryptedMasterKeyByRecovery: string;
  recoverySalt: string;
  recoveryKey: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    nickname: string;
    encryptedMasterKey?: string;
    masterKeySalt?: string;
  };
  recoveryKey?: string;
}

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    }
    throw new Error('Signup failed');
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
}

export async function verifyToken(token: string): Promise<AuthResponse['user']> {
  const response = await api.get('/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}
