import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import CryptoJS from "crypto-js";

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .transform((value) => value?.trim())
        .required("First name is required")
        .min(1, "First name cannot be empty or contain only spaces")
        .matches(/^[^0-9]*$/, "First name cannot contain numbers"),
    lastName: Yup.string()
        .transform((value) => value?.trim())
        .required("Last name is required")
        .min(1, "Last name cannot be empty or contain only spaces")
        .matches(/^[^0-9]*$/, "Last name cannot contain numbers"),
    companyName: Yup.string()
        .transform((value) => value?.trim())
        .required("Company name is required")
        .min(1, "Company name cannot be empty or contain only spaces"),
    country: Yup.string()
        .transform((value) => value?.trim())
        .required("Country name is required")
        .min(1, "Country name cannot be empty or contain only spaces")
        .matches(/^[^0-9]*$/, "Country name cannot contain numbers"),
    email: Yup.string()
        .transform((value) => value?.trim())
        .email("Incorrect email format")
        .required("Email is required"),
    password: Yup.string()
        .transform((value) => value?.trim())
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');

        try {
            const encryptedPassword = CryptoJS.AES.encrypt(values.password.trim(), 'my-secret-key').toString();

            const SIGNUP_API = "http://localhost:5000/api/v1/auth/sign-up";
            const res = await axios.post(SIGNUP_API, {
                first_name: values.firstName.trim(),
                last_name: values.lastName.trim(),
                company_name: values.companyName.trim(),
                country: values.country.trim(),
                email: values.email.trim(),
                password: encryptedPassword
            });

            if (res.data.success) {
                localStorage.clear();
                const { login_token } = res.data;
                login(login_token);
                // navigate('/buy');
                navigate('/login')
            } else {
                setError(res.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Signup failed. Please try again";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    // Custom handler to trim leading spaces from input
    const handleInputChange = (e, handleChange, setFieldValue) => {
        const { name, value } = e.target;
        // Remove leading spaces but keep the rest of the string intact
        const trimmedValue = value.replace(/^\s+/, '');
        
        // Update the field value without leading spaces
        setFieldValue(name, trimmedValue);
        
        // Clear error when user starts typing
        if (error) setError("");
    };

    return (
        <Box maxWidth={400} mx="auto" mt={3} mb={3} p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to BuyHive
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Signup to BuyHive as a Buyer
            </Typography>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    country: '',
                    email: '',
                    password: ''
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, handleChange, setFieldValue, values }) => (
                    <Form>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={values.firstName}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                        />
                        <TextField
                            fullWidth
                            label="Company Name"
                            name="companyName"
                            value={values.companyName}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
                            error={touched.companyName && Boolean(errors.companyName)}
                            helperText={touched.companyName && errors.companyName}
                        />
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={values.country}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
                            error={touched.country && Boolean(errors.country)}
                            helperText={touched.country && errors.country}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={values.email}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            value={values.password}
                            margin="normal"
                            onChange={(e) => handleInputChange(e, handleChange, setFieldValue)}
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
                            variant="contained"
                            disabled={loading}
                            color="primary"
                            type="submit"
                            sx={{ backgroundColor: "#00B2C9", mt: 2 }}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                    </Form>
                )}
            </Formik>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Already have an account <Link to="/login">Login</Link>
            </Typography>
        </Box>
    )
}

export default Signup;