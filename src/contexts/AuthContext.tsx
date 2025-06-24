import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleUser: any, role?: 'trainer' | 'client', additionalInfo?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('fittrainer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('fittrainer_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginWithGoogle = async (
    googleUser: any, 
    role?: 'trainer' | 'client', 
    additionalInfo?: any
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      let existingUser = mockUsers.find(u => u.email === googleUser.email);
      
      if (existingUser) {
        // User exists, log them in
        setUser(existingUser);
        localStorage.setItem('fittrainer_user', JSON.stringify(existingUser));
        setIsLoading(false);
        return true;
      } else if (role) {
        // New user with role selection
        const newUser: User = {
          id: `google_${googleUser.id}`,
          email: googleUser.email,
          name: googleUser.name,
          role: role,
          avatar: googleUser.picture,
          createdAt: new Date(),
          ...(role === 'client' && additionalInfo && {
            age: additionalInfo.age,
            height: additionalInfo.height,
            currentWeight: additionalInfo.weight,
            goals: additionalInfo.goals || []
          }),
          ...(role === 'trainer' && additionalInfo && {
            experience: additionalInfo.experience,
            specialization: additionalInfo.specialization,
            certification: additionalInfo.certification
          })
        };

        // In a real app, you would save this to your backend
        mockUsers.push(newUser);
        
        setUser(newUser);
        localStorage.setItem('fittrainer_user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      } else {
        // New user, needs role selection
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fittrainer_user');
    
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}