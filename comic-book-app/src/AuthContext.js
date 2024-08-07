import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  // No need to store user and token in state
  const login = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully!'); // Show success toast
  };

  return (
      <AuthContext.Provider value={{ login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return { ...context, user, token };
};
