import { secureStorage } from './secureStore';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string) {
    await delay(1500); // Simulate network latency

    // MOCK LOGIN SUCCESS
    if (email && password) {
      const mockUser = {
        id: '12345',
        email: email,
        name: email.split('@')[0],
      };
      const mockToken = 'mock-jwt-token-xyz';

      await secureStorage.saveToken(mockToken);
      await secureStorage.saveUser(mockUser);

      return { user: mockUser, token: mockToken };
    }
    throw new Error('Invalid credentials');
  },

  async signup(email: string, password: string, name: string) {
    await delay(1500);
    
    // MOCK SIGNUP SUCCESS
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: name,
    };
    const mockToken = 'mock-jwt-token-new';

    await secureStorage.saveToken(mockToken);
    await secureStorage.saveUser(mockUser);

    return { user: mockUser, token: mockToken };
  },

  async forgotPassword(email: string) {
    await delay(1000);
    return true;
  }
};
