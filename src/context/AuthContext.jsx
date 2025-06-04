import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [Authorization, setAuthorization] = useState('');
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedFirstName = localStorage.getItem('firstName');

        if (storedFirstName) {
            setFirstName(storedFirstName);
        }

        const validUser = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return
            }

            try {
                const API = "http://localhost:5000/api/v1/categories";
                const response = await axios.get(API, {
                    headers: {
                        'Authorization': token
                    }
                });
                if (response.data.success && response.status === 200) {
                    setIsAuthenticated(true);
                    setAuthorization(token);
                } else {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Token validation failed: ', error);
                setIsAuthenticated(false);
                // localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };
        validUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    const setName = (first_name) => {
        setFirstName(first_name);    
        localStorage.setItem('firstName', first_name);    
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, Authorization, firstName, setName, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);