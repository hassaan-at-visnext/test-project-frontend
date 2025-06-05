// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [Authorization, setAuthorization] = useState('');
//     const [firstName, setFirstName] = useState('');

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const storedFirstName = localStorage.getItem('firstName');

//         if (storedFirstName) {
//             setFirstName(storedFirstName);
//         }

//         const validUser = async () => {
//             if (!token) {
//                 setIsAuthenticated(false);
//                 setIsLoading(false);
//                 return
//             }

//             try {
//                 const API = "http://localhost:5000/api/v1/categories";
//                 const response = await axios.get(API, {
//                     headers: {
//                         'Authorization': token
//                     }
//                 });
//                 if (response.data.success && response.status === 200) {
//                     setIsAuthenticated(true);
//                     setAuthorization(token);
//                 } else {
//                     setIsAuthenticated(false)
//                 }
//             } catch (error) {
//                 console.error('Token validation failed: ', error);
//                 setIsAuthenticated(false);
//                 // localStorage.removeItem('token');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         validUser();
//     }, []);

//     const login = (token) => {
//         localStorage.setItem('token', token);
//         setIsAuthenticated(true);
//     }

//     const logout = () => {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//     }

//     const setName = (first_name) => {
//         setFirstName(first_name);    
//         localStorage.setItem('firstName', first_name);    
//     }

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, isLoading, Authorization, firstName, setName, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () => useContext(AuthContext);

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

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

    useEffect(() => {
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