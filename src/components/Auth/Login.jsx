import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Incorrect email format").required("Email is required"),
    password: Yup.string().min(6, "Incorrect Password").required("Password is required"),
});

const Login = () => {
    const { login, setName } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError("");

        try {

            const encryptedPassword = CryptoJS.AES.encrypt(values.password, 'my-secret-key').toString();

            const LOGIN_API = "http://localhost:5000/api/v1/auth/login";
            const res = await axios.post(LOGIN_API, {
                email: values.email,
                password: encryptedPassword
            });

            if (res.status === 200) {
                const { data: token, name } = res.data;
                login(token);
                setName(name);
                navigate('/buy');
            } else {
                setError("Invalid Credentials");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please try again";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={15} p={3} borderRadius={2} boxShadow={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Sign in to BuyHive as a Buyer
            </Typography>

            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, handleChange }) => (
                    <Form>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            margin="normal"
                            onChange={(e) => {
                                handleChange(e);
                                if (error) setError("");
                            }}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            margin="normal"
                            onChange={(e) => {
                                handleChange(e);
                                if (error) setError("");
                            }}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ backgroundColor: "#00B2C9", mt: 2 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Form>
                )}
            </Formik>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Don't have an account <Link to="/signup">Signup</Link>
            </Typography>
        </Box>
    );
};

export default Login;
