import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";


const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const SIGNUP_API = "http://localhost:5000/api/v1/auth/sign-up";
            const res = await axios.post(SIGNUP_API, {
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                country,
                email,
                password
            });
            
            if(res.data.success) {
                localStorage.clear();
                const { login_token } = res.data;
                login(login_token);
                navigate('/buy');
            } else {
                setError(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Signup failed. Please try again";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box maxWidth={400} mx="auto" mt={3} mb={3} p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to BuyHive
            </Typography>
            <Typography variant="subtitle1">
                Signup to BuyHive as a Buyer
            </Typography>

            <form onSubmit={handleSignup}>
                <TextField fullWidth label="First Name" margin="normal" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <TextField fullWidth label="Last Name" margin="normal" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                <TextField fullWidth label="Company Name" margin="normal" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                <TextField fullWidth label="Country" margin="normal" value={country} onChange={(e) => setCountry(e.target.value)}/>
                <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}/>

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}

                <Button fullWidth variant="contained" disabled={loading} color="primary" type="submit" sx={{ backgroundColor: "#00B2C9", mt: 2 }}>
                   { loading? "Signing Up...": "Sign Up"}
                </Button>
            </form>

            <Typography mt={2}>
                Already have an account <Link to="/login">Login</Link>
            </Typography>
        </Box>
    )
}

export default Signup;