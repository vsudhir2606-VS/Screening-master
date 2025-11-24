import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Allowed users configuration
// Password field removed as it is no longer required
const USERS: Record<string, { name: string; role: 'admin' | 'user' }> = {
  'tchub': { name: 'T. Chub', role: 'admin' },
  'admin': { name: 'Administrator', role: 'admin' },
  'screener': { name: 'Screener One', role: 'user' },
  'guest': { name: 'Guest User', role: 'user' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (username: string): Promise<boolean> => {
    // Simulate API delay for smooth UI effect
    await new Promise(resolve => setTimeout(resolve, 500));

    const account = USERS[username.trim().toLowerCase()];
    if (account) {
      setUser({ username, name: account.name, role: account.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};