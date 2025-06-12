import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  role: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState & {
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const role = Cookies.get('role');

    setAuthState({
      isAuthenticated: !!token,
      username: username || null,
      role: role || null,
      loading: false,
    });
  }, []);

  const login = (token: string, username: string, role: string) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    Cookies.set('username', username, { expires: 1 });
    Cookies.set('role', role, { expires: 1 });
    
    setAuthState({
      isAuthenticated: true,
      username,
      role,
      loading: false,
    });
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('role');
    
    setAuthState({
      isAuthenticated: false,
      username: null,
      role: null,
      loading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};