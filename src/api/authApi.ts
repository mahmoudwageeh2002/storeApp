import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { User } from '../features/auth/authSlice';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

const authApi = axios.create({
  baseURL: API_BASE_URL,
});

// Mock user database with admin accounts
const mockUsers: { [username: string]: User } = {
  // Admin accounts
  admin: {
    id: 1001,
    username: 'admin',
    email: 'admin@storeapp.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  superadmin: {
    id: 1002,
    username: 'superadmin',
    email: 'superadmin@storeapp.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'admin',
  },
};

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', credentials.username);

    // Check if user is in our mock admin database first
    const adminUser = mockUsers[credentials.username];
    if (adminUser) {
      console.log('Admin user found in mock database');
      // For admin users, we'll create a mock token
      return {
        token: `mock-admin-token-${Date.now()}`,
        refreshToken: `mock-admin-refresh-${Date.now()}`,
        user: adminUser,
      };
    }

    // Try DummyJSON auth for regular users
    const response = await authApi.post('/auth/login', credentials);
    console.log('DummyJSON login response:', response.data);

    const dummyUser = response.data;
    const user: User = {
      id: dummyUser.id,
      username: dummyUser.username,
      email: dummyUser.email,
      firstName: dummyUser.firstName,
      lastName: dummyUser.lastName,
      role: determineUserRole(dummyUser),
      gender: dummyUser.gender,
      image: dummyUser.image,
    };

    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user,
    };
  } catch (error) {
    console.error('Login error:', error);

    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error('Invalid username or password');
      } else if (typeof status === 'number' && status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }

    throw new Error('Login failed. Please check your credentials.');
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    // For mock tokens, just check if they exist
    if (token.startsWith('mock-admin-token')) {
      return true;
    }

    // For real tokens, we could validate with the API
    // For now, just return true if token exists
    return !!token;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const fetchUserProfile = async (token: string): Promise<User> => {
  try {
    // Handle mock admin tokens
    if (token.startsWith('mock-admin-token')) {
      // Return admin user data based on token
      return mockUsers.admin; // or determine which admin based on token
    }

    const response = await authApi.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dummyUser = response.data;

    // Map DummyJSON user to our User interface
    const user: User = {
      id: dummyUser.id,
      username: dummyUser.username,
      email: dummyUser.email,
      firstName: dummyUser.firstName,
      lastName: dummyUser.lastName,
      role: determineUserRole(dummyUser),
      gender: dummyUser.gender,
      image: dummyUser.image,
    };

    return user;
  } catch (error) {
    console.error('Failed to fetch user profile from API:', error);
    throw error;
  }
};

// Function to determine user role based on DummyJSON user data
const determineUserRole = (dummyUser: any): 'user' | 'admin' => {
  // Make specific users admin based on username or ID
  const adminUsernames = ['admin', 'superadmin'];
  const adminIds = [1, 2]; // Adjust based on your needs

  if (
    adminUsernames.includes(dummyUser.username) ||
    adminIds.includes(dummyUser.id)
  ) {
    return 'admin';
  }

  return 'user';
};
