import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Box maxWidth={400} mx="auto" mt={20}>
            <Typography variant="h4">404 - Page not Found</Typography>
            <Typography variant="subtitle1"> Back to Login <Link to="/">Login</Link> </Typography>
        </Box>
    );
};

export default NotFound;