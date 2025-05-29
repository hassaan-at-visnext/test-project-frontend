import { Box, Typography, Container } from "@mui/material";
import logo from "../assets/bh-logo-blue-n.png";

const Footer = () => {
    return (
        <Box marginTop={5} sx={{ width: "100%", backgroundColor: "#F2F2F2", py: 3 }}>
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: "column", sm: "row" }}
                    textAlign={{ xs: "center", sm: "left" }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{
                            height: 55,
                            marginRight: { sm: 4 },
                            marginBottom: { xs: 2, sm: 0 }
                        }}
                    />
                    <Typography variant="body2" color="textSecondary">
                        Connecting buyers and manufacturers using the world’s best sourcing experts & technology
                        built by buyers, for buyers. © 2025 BuyersHub. All rights reserved. International copyright laws apply.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
