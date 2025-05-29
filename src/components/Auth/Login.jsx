import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const LOGIN_API = "http://localhost:5000/api/v1/auth/login";
            const res = await axios.post(LOGIN_API, {email, password});

            if (res.status === 200) {
                const {data: token} = res.data;
                login(token);
                navigate('/buy');
            } else {
                setError("Invalid Credentials");
                setLoading(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please try again";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box maxWidth={400} mx="auto" mt={15} p={3} borderRadius={2} boxShadow={3}>
            {/* Login Header start */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back!
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Sign in to BuyHive as a Buyer
            </Typography>
            {/* Login Header end */}

            <form onSubmit={handleLogin}>
                <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)}/>
                <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)}/>
                
                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}

                <Button fullWidth disabled={loading} variant="contained" color="primary" type="submit" sx={{ backgroundColor: "#00B2C9", mt: 2 }}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Don't have an account <Link to="/signup">Signup</Link>
            </Typography>
        </Box>
    )
}

export default Login;