import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Typography } from "@mui/material";

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (<Box maxWidth={400} mx="auto" mt={20}>
            <Typography variant="h4">Loading...</Typography>
        </Box>)
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children;
}

export default ProtectedRoute;