import axios from "axios";
import { createContext, useContext, useEffect, useState, useRef } from "react";

const AuthContext = createContext();

// Create axios interceptor for global token handling
const createAxiosInstance = () => {
  const instance = axios.create();
  
  // Request interceptor to add token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor to handle auth errors globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || 
          (error.response?.status === 409 && 
           error.response?.data?.message === "Invalid or expired token")) {
        // Token is invalid - clear auth state and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        window.dispatchEvent(new CustomEvent('auth-logout'));
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export const authAxios = createAxiosInstance();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return; // Prevent re-initialization
        const token = localStorage.getItem('token');
        const storedFirstName = localStorage.getItem('firstName');

        if (storedFirstName) {
            setFirstName(storedFirstName);
        }

        // Simple token existence check - no API call needed
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        
        setIsLoading(false);
        initialized.current = true;
        // Listen for logout events from axios interceptor
        const handleLogout = () => {
            setIsAuthenticated(false);
            setFirstName('');
        };

        window.addEventListener('auth-logout', handleLogout);
        
        return () => {
            window.removeEventListener('auth-logout', handleLogout);
        };
    }, []);

    const login = (token, userFirstName = '') => {
        localStorage.setItem('token', token);
        if (userFirstName) {
            localStorage.setItem('firstName', userFirstName);
            setFirstName(userFirstName);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        setIsAuthenticated(false);
        setFirstName('');
    };

    const setName = (first_name) => {
        setFirstName(first_name);    
        localStorage.setItem('firstName', first_name);    
    };

    // Get current token without API call
    const getToken = () => {
        return localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            isLoading, 
            firstName, 
            setName, 
            login, 
            logout,
            getToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);